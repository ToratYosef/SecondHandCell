import { getServerFirestore } from '@/lib/firebaseAdmin';
import { shippingAdapter } from '@/integrations/shippingAdapter';

export async function autoRefreshInboundTracking() {
  const firestore = getServerFirestore();
  if (!firestore) {
    console.warn('Skipping inbound tracking refresh; Firestore not configured');
    return;
  }
  const adapter = shippingAdapter();
  const snapshot = await firestore.collection('orders').where('statusTimeline', 'array-contains', { status: 'kit_sent' }).get();
  for (const doc of snapshot.docs) {
    const order = doc.data();
    await adapter.refreshTracking(order as any);
  }
}

export async function autoVoidExpiredLabels() {
  const firestore = getServerFirestore();
  if (!firestore) {
    console.warn('Skipping label void automation; Firestore not configured');
    return;
  }
  const snapshot = await firestore.collection('orders').get();
  for (const doc of snapshot.docs) {
    const order = doc.data() as any;
    if (Array.isArray(order.labels)) {
      const stale = order.labels.filter((label: any) => label.metadata?.status === 'expired');
      for (const entry of stale) {
        await shippingAdapter().voidLabel(entry);
      }
    }
  }
}

export async function autoAcceptOffers() {
  const firestore = getServerFirestore();
  if (!firestore) {
    return;
  }
  await firestore.collection('orders').where('reOffer.status', '==', 'pending').get();
}

export async function autoCancelDormantOrders() {
  const firestore = getServerFirestore();
  if (!firestore) {
    return;
  }
  await firestore.collection('orders').where('status', '==', 'awaiting_device').get();
}
