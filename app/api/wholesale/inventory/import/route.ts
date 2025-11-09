import { NextResponse } from 'next/server';
import { requireAdminToken, upsertWholesaleInventory } from '@/services/wholesale';
import { z } from 'zod';

const schema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      sku: z.string().min(1),
      price: z.number().nonnegative(),
      stock: z.number().int().nonnegative(),
      imageUrl: z.string().url().optional()
    })
  )
});

export async function POST(request: Request) {
  try {
    await requireAdminToken(request);
    const body = await request.json();
    const { items } = schema.parse(body);
    await upsertWholesaleInventory(items, 'api-token');
    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    return NextResponse.json({ message: (error as Error).message }, { status });
  }
}
