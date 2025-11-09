import { firestore } from '@/lib/firebaseAdmin';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';

export async function appendActivity(orderId: string, actor: string, action: string, context?: Record<string, unknown>) {
  const now = Timestamp.now().toDate().toISOString();
  const ref = firestore.collection('orders').doc(orderId);
  await firestore.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists) {
      throw new Error('Order not found');
    }

    const data = snapshot.data();
    transaction.update(ref, {
      activityLogs: FieldValue.arrayUnion({ actor, action, timestamp: now, context: context ?? null }),
      updatedAt: now
    });

    if (data?.userId) {
      transaction.update(firestore.collection('users').doc(data.userId).collection('orders').doc(orderId), {
        activityLogs: FieldValue.arrayUnion({ actor, action, timestamp: now, context: context ?? null }),
        updatedAt: now
      });
    }

    transaction.set(firestore.collection('adminAuditLogs').doc(), {
      actor,
      action,
      orderId,
      orderNumber: data?.orderNumber,
      timestamp: Timestamp.now(),
      details: context ?? null
    });
  });
}
