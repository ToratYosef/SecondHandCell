import { firestore } from '@/lib/firebaseAdmin';
import { shippingAdapter } from '@/integrations/shippingAdapter';

export async function autoRefreshInboundTracking() {
  const adapter = shippingAdapter();
  const snapshot = await firestore.collection('orders').where('statusTimeline', 'array-contains', { status: 'kit_sent' }).get();
  for (const doc of snapshot.docs) {
    const order = doc.data();
    await adapter.refreshTracking(order as any);
  }
}

export async function autoVoidExpiredLabels() {
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
  await firestore.collection('orders').where('reOffer.status', '==', 'pending').get();
}

export async function autoCancelDormantOrders() {
  await firestore.collection('orders').where('status', '==', 'awaiting_device').get();
}
