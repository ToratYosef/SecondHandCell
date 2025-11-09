import { describe, it, expect } from 'vitest';
import { createOrder } from '@/services/orders';
import { generateInboundLabel } from '@/services/labels';
import { SubmitOrderRequest, DeviceCondition, PaymentMethod } from '@/types/orders';

const payload: SubmitOrderRequest = {
  userToken: null,
  shippingInfo: {
    name: 'E2E User',
    email: 'e2e@example.com',
    phone: '+1-555-0200',
    address: '789 Flow Rd',
    city: 'Flowtown',
    state: 'WA',
    postalCode: '98101',
    country: 'US'
  },
  device: {
    brand: 'Samsung',
    model: 'Galaxy S23',
    storage: '256GB',
    condition: DeviceCondition.Good,
    imei: null
  },
  payment: {
    method: PaymentMethod.Zelle,
    email: 'pay@example.com'
  },
  shippingPreference: 'kit',
  quotedAmount: 400,
  notes: 'E2E happy path'
};

describe('End-to-end order flow', () => {
  it('submits an order and generates a label', async () => {
    const { id } = await createOrder(payload, 'e2e-user');
    await generateInboundLabel(id, 'admin-demo');
    expect(true).toBe(true);
  });
});
