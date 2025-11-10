import { adminDb } from "./firebaseAdmin";

export interface QuoteInput {
  deviceSlug: string;
  capacity: string;
  network: string;
  condition: string;
}

export interface QuoteResult {
  bestPrice: number;
  merchantOffers: Array<{
    merchantId: string;
    displayName: string;
    payout: number;
    notes?: string;
  }>;
  breakdown: Record<string, unknown>;
}

// TODO: Introduce a shared caching layer (Redis or Firestore TTL collection) to avoid
// recomputing pricing for the same payload within a short time window.
export async function getQuoteForDevice({
  deviceSlug,
  capacity,
  network,
  condition,
}: QuoteInput): Promise<QuoteResult> {
  const deviceDoc = await adminDb.collection("devices").doc(deviceSlug).get();
  if (!deviceDoc.exists) {
    return { bestPrice: 0, merchantOffers: [], breakdown: {} };
  }

  const pricingSnapshot = await adminDb
    .collection("pricingSnapshots")
    .where("deviceSlug", "==", deviceSlug)
    .orderBy("capturedAt", "desc")
    .limit(1)
    .get();

  const [latestSnapshot] = pricingSnapshot.docs;
  const offers = (latestSnapshot?.data()?.offers as QuoteResult["merchantOffers"]) || [];

  const matchingOffers = offers.filter((offer) => {
    const constraints = latestSnapshot?.data()?.constraints?.[offer.merchantId] as
      | Record<string, string[]>
      | undefined;
    const allowedCapacities = constraints?.capacity;
    const allowedNetworks = constraints?.network;
    const allowedConditions = constraints?.condition;
    return (
      (!allowedCapacities || allowedCapacities.includes(capacity)) &&
      (!allowedNetworks || allowedNetworks.includes(network)) &&
      (!allowedConditions || allowedConditions.includes(condition))
    );
  });

  const bestPrice = matchingOffers.reduce((max, offer) => Math.max(max, offer.payout), 0);

  return {
    bestPrice,
    merchantOffers: matchingOffers,
    breakdown: {
      device: deviceDoc.data(),
      snapshotId: latestSnapshot?.id ?? null,
      requested: { deviceSlug, capacity, network, condition },
    },
  };
}
