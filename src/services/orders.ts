import { firestore } from '@/lib/firebaseAdmin';
import type { SubmitOrderRequest, OrderRecord, OrderStatusUpdate } from '@/types/orders';
import { submitOrderSchema, orderStatusSchema } from '@/types/orders';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';
import { randomUUID } from 'crypto';
import { demoOrders } from '@/data/sampleData';

const COUNTER_DOC = firestore.collection('metadata').doc('counters');

function canUseFirestore() {
  return Boolean(process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT);
}

async function nextSequentialOrderNumber(): Promise<string> {
  const result = await firestore.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(COUNTER_DOC);
    const current = snapshot.data()?.nextOrderNumber ?? 1;
    transaction.set(COUNTER_DOC, { nextOrderNumber: current + 1 }, { merge: true });
    return current as number;
  });

  return `SHC-${result.toString().padStart(5, '0')}`;
}

export async function createOrder(payload: SubmitOrderRequest, userId: string | null): Promise<{ id: string; orderNumber: string }> {
  const validated = submitOrderSchema.parse(payload);
  const orderId = randomUUID();
  const orderNumber = await nextSequentialOrderNumber();
  const now = Timestamp.now();
  const base: OrderRecord = {
    id: orderId,
    orderNumber,
    userId,
    createdAt: now.toDate().toISOString(),
    updatedAt: now.toDate().toISOString(),
    shippingInfo: validated.shippingInfo,
    device: validated.device,
    payment: {
      ...validated.payment,
      status: 'pending'
    },
    statusTimeline: [
      {
        status: 'submitted',
        actor: userId ?? 'guest',
        timestamp: now.toDate().toISOString()
      }
    ],
    labels: [],
    reOffer: undefined,
    activityLogs: [
      {
        actor: userId ?? 'guest',
        action: 'order.created',
        timestamp: now.toDate().toISOString(),
        context: {
          quotedAmount: validated.quotedAmount,
          shippingPreference: validated.shippingPreference
        }
      }
    ]
  };

  await firestore.runTransaction(async (transaction) => {
    const orderRef = firestore.collection('orders').doc(orderId);
    transaction.create(orderRef, base);

    if (userId) {
      const mirrorRef = firestore.collection('users').doc(userId).collection('orders').doc(orderId);
      transaction.create(mirrorRef, {
        ...base,
        mirroredAt: FieldValue.serverTimestamp()
      });
    }

    transaction.set(
      firestore.collection('adminAuditLogs').doc(),
      {
        actor: userId ?? 'system',
        action: 'order.created',
        orderId,
        orderNumber,
        timestamp: now,
        details: {
          quotedAmount: validated.quotedAmount
        }
      },
      { merge: true }
    );
  });

  return { id: orderId, orderNumber };
}

export async function listOrders(limit = 25): Promise<OrderRecord[]> {
  if (!canUseFirestore()) {
    return demoOrders.slice(0, limit);
  }

  try {
    const snapshot = await firestore.collection('orders').orderBy('createdAt', 'desc').limit(limit).get();
    return snapshot.docs.map((doc) => doc.data() as OrderRecord);
  } catch (error) {
    console.warn('Falling back to demo orders', error);
    return demoOrders.slice(0, limit);
  }
}

export async function getOrderById(orderId: string): Promise<OrderRecord | null> {
  if (!canUseFirestore()) {
    return demoOrders.find((order) => order.id === orderId) ?? null;
  }

  try {
    const snapshot = await firestore.collection('orders').doc(orderId).get();
    return snapshot.exists ? (snapshot.data() as OrderRecord) : null;
  } catch (error) {
    console.warn('Falling back to demo order lookup', error);
    return demoOrders.find((order) => order.id === orderId) ?? null;
  }
}

export async function updateOrderStatus(orderId: string, update: OrderStatusUpdate, actor: string): Promise<void> {
  const validated = orderStatusSchema.parse(update);
  const now = Timestamp.now().toDate().toISOString();
  await firestore.runTransaction(async (transaction) => {
    const ref = firestore.collection('orders').doc(orderId);
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists) {
      throw new Error('Order not found');
    }

    const order = snapshot.data() as OrderRecord;
    const timeline = [
      ...order.statusTimeline,
      { status: validated.status, actor, timestamp: now }
    ];

    transaction.update(ref, {
      statusTimeline: timeline,
      updatedAt: now,
      activityLogs: FieldValue.arrayUnion({
        actor,
        action: 'order.status.update',
        timestamp: now,
        context: { status: validated.status, reason: validated.reason ?? null }
      })
    });

    if (order.userId) {
      transaction.update(firestore.collection('users').doc(order.userId).collection('orders').doc(orderId), {
        statusTimeline: timeline,
        updatedAt: now
      });
    }

    transaction.set(firestore.collection('adminAuditLogs').doc(), {
      actor,
      action: 'order.status.update',
      orderId,
      orderNumber: order.orderNumber,
      timestamp: Timestamp.now(),
      details: {
        status: validated.status,
        notifyCustomer: validated.notifyCustomer ?? false
      }
    });
  });
}
