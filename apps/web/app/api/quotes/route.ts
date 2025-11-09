import { NextResponse } from "next/server";
import { getQuoteForDevice } from "@web/lib/pricing";

interface QuoteRequestBody {
  deviceSlug: string;
  capacity: string;
  network: string;
  condition: string;
}

type CacheEntry = {
  expiresAt: number;
  value: Awaited<ReturnType<typeof getQuoteForDevice>>;
};

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 1000; // TODO: swap with shared redis-based rate limiter

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as QuoteRequestBody | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const { deviceSlug, capacity, network, condition } = body;
  if (!deviceSlug || !capacity || !network || !condition) {
    return NextResponse.json({ error: "Missing quote parameters" }, { status: 400 });
  }

  const cacheKey = JSON.stringify({ deviceSlug, capacity, network, condition });
  const existing = cache.get(cacheKey);
  if (existing && existing.expiresAt > Date.now()) {
    return NextResponse.json({ ...existing.value, fromCache: true });
  }

  const quote = await getQuoteForDevice({ deviceSlug, capacity, network, condition });
  cache.set(cacheKey, { value: quote, expiresAt: Date.now() + CACHE_TTL_MS });

  return NextResponse.json({ ...quote, fromCache: false });
}
