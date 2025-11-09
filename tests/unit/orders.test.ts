import { describe, it, expect } from 'vitest';
import { submitOrderSchema, DeviceCondition, PaymentMethod } from '@/types/orders';

describe('submitOrderSchema', () => {
  it('validates a complete payload', () => {
    const parsed = submitOrderSchema.parse({
      userToken: null,
      shippingInfo: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1-555-0100',
        address: '123 Demo St',
        city: 'Demo City',
        state: 'CA',
        postalCode: '94016',
        country: 'US'
      },
      device: {
        brand: 'Apple',
        model: 'iPhone 14',
        storage: '128GB',
        condition: DeviceCondition.Good
      },
      payment: {
        method: PaymentMethod.PayPal
      },
      shippingPreference: 'kit',
      quotedAmount: 550,
      notes: 'Great condition'
    });

    expect(parsed.device.brand).toBe('Apple');
  });

  it('rejects missing data', () => {
    expect(() => submitOrderSchema.parse({})).toThrowError();
  });
});
