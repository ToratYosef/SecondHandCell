import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { setLogLevel } from 'firebase/firestore';
import { createOrder } from '@/services/orders';
import { SubmitOrderRequest, DeviceCondition, PaymentMethod } from '@/types/orders';
import { firestore } from '@/lib/firebaseAdmin';

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  setLogLevel('error');
  testEnv = await initializeTestEnvironment({
    projectId: process.env.FIREBASE_PROJECT_ID ?? 'secondhandcell-test'
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

const payload: SubmitOrderRequest = {
  userToken: null,
  shippingInfo: {
    name: 'Integration Tester',
    email: 'integration@example.com',
    phone: '+1-555-0199',
    address: '123 Integration St',
    city: 'Testville',
    state: 'CA',
    postalCode: '94016',
    country: 'US'
  },
  device: {
    brand: 'Google',
    model: 'Pixel 7',
    storage: '128GB',
    condition: DeviceCondition.Good,
    imei: null
  },
  payment: {
    method: PaymentMethod.PayPal,
    email: 'payout@example.com'
  },
  shippingPreference: 'kit',
  quotedAmount: 300,
  notes: 'Ready to ship'
};

describe('Order creation', () => {
  it('creates an order and mirror document', async () => {
    const { id, orderNumber } = await createOrder(payload, null);
    expect(orderNumber.startsWith('SHC-')).toBe(true);
    const orderDoc = await firestore.collection('orders').doc(id).get();
    expect(orderDoc.exists).toBe(true);
  });
});
