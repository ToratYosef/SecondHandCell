import { firestore } from '@/lib/firebaseAdmin';
import type { OrderRecord } from '@/types/orders';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';
import { shippingAdapter } from '@/integrations/shippingAdapter';

export async function generateInboundLabel(orderId: string, actor: string) {
  await firestore.runTransaction(async (transaction) => {
    const ref = firestore.collection('orders').doc(orderId);
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists) {
      throw new Error('Order not found');
    }

    const order = snapshot.data() as OrderRecord;
    const label = await shippingAdapter().createInboundLabel(order);
    const now = Timestamp.now().toDate().toISOString();

    transaction.update(ref, {
      labels: FieldValue.arrayUnion(label),
      updatedAt: now,
      activityLogs: FieldValue.arrayUnion({
        actor,
        action: 'label.generated',
        timestamp: now,
        context: { labelId: label.labelId }
      })
    });

    if (order.userId) {
      transaction.update(firestore.collection('users').doc(order.userId).collection('orders').doc(orderId), {
        labels: FieldValue.arrayUnion(label),
        updatedAt: now
      });
    }

    transaction.set(firestore.collection('adminAuditLogs').doc(), {
      actor,
      action: 'label.generated',
      orderId,
      orderNumber: order.orderNumber,
      timestamp: Timestamp.now(),
      details: {
        labelId: label.labelId,
        carrier: label.carrier
      }
    });
  });
}

export async function voidLabel(orderId: string, labelId: string, actor: string) {
  await firestore.runTransaction(async (transaction) => {
    const ref = firestore.collection('orders').doc(orderId);
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists) {
      throw new Error('Order not found');
    }

    const order = snapshot.data() as OrderRecord;
    const label = order.labels.find((entry) => entry.labelId === labelId);
    if (!label) {
      throw new Error('Label not found');
    }

    await shippingAdapter().voidLabel(label);

    const remaining = order.labels.filter((entry) => entry.labelId !== labelId);
    const now = Timestamp.now().toDate().toISOString();

    transaction.update(ref, {
      labels: remaining,
      updatedAt: now,
      activityLogs: FieldValue.arrayUnion({
        actor,
        action: 'label.voided',
        timestamp: now,
        context: { labelId }
      })
    });

    transaction.set(firestore.collection('adminAuditLogs').doc(), {
      actor,
      action: 'label.voided',
      orderId,
      orderNumber: order.orderNumber,
      timestamp: Timestamp.now(),
      details: {
        labelId
      }
    });
  });
}
