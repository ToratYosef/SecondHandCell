import { firestore } from '@/lib/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';
import { StripeAdapter } from '@/integrations/stripeAdapter';
import type { WholesaleItem } from '@/types/wholesale';
import { demoWholesaleInventory } from '@/data/sampleData';

function canUseFirestore() {
  return Boolean(process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT);
}

export async function listWholesaleInventory(): Promise<WholesaleItem[]> {
  if (!canUseFirestore()) {
    return demoWholesaleInventory;
  }

  try {
    const snapshot = await firestore.collection('wholesaleInventory').get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as WholesaleItem) }));
  } catch (error) {
    console.warn('Falling back to demo wholesale inventory', error);
    return demoWholesaleInventory;
  }
}

export async function upsertWholesaleInventory(items: WholesaleItem[], actor: string) {
  const batch = firestore.batch();
  const now = Timestamp.now().toDate().toISOString();
  for (const item of items) {
    const ref = firestore.collection('wholesaleInventory').doc(item.id);
    batch.set(ref, { ...item, updatedAt: now }, { merge: true });
  }
  batch.set(firestore.collection('adminAuditLogs').doc(), {
    actor,
    action: 'wholesale.inventory.import',
    timestamp: Timestamp.now(),
    details: { count: items.length }
  });
  await batch.commit();
}

export async function createWholesaleCheckout(
  payload: { items: Array<{ id: string; quantity: number }>; currency: string },
  userId: string
) {
  const adapter = new StripeAdapter();
  const itemsSnapshot = await firestore.getAll(
    ...payload.items.map((item) => firestore.collection('wholesaleInventory').doc(item.id))
  );

  const amount = payload.items.reduce((total, item, index) => {
    const doc = itemsSnapshot[index];
    const data = doc.data() as WholesaleItem | undefined;
    if (!data) {
      throw new Error(`Item ${item.id} not found`);
    }
    return total + data.price * item.quantity;
  }, 0);

  const payment = await adapter.createWholesaleIntent(Math.round(amount * 100), payload.currency, {
    userId,
    orderType: 'wholesale'
  });

  const orderRef = firestore.collection('wholesaleOrders').doc();
  await orderRef.set({
    id: orderRef.id,
    userId,
    amount,
    currency: payload.currency,
    paymentIntentId: payment.paymentIntentId,
    createdAt: Timestamp.now().toDate().toISOString(),
    status: 'pending',
    items: payload.items
  });

  return payment;
}

export async function requireAdminToken(request: Request) {
  const token = request.headers.get('x-admin-token');
  if (!token || token !== process.env.WHOLESALE_ADMIN_TOKEN) {
    const error = new Error('Forbidden');
    (error as any).status = 403;
    throw error;
  }
}
