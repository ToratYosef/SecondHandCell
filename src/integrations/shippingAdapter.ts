import type { OrderRecord } from '@/types/orders';
import { randomUUID } from 'crypto';
import { ShipEngineAdapter } from './shipengine';

export interface ShippingLabel {
  labelId: string;
  carrier: string;
  tracking: string;
  url: string;
  metadata?: Record<string, unknown>;
}

export interface ShippingAdapter {
  createInboundLabel(order: OrderRecord): Promise<ShippingLabel>;
  voidLabel(label: ShippingLabel): Promise<void>;
  refreshTracking(order: OrderRecord): Promise<Partial<ShippingLabel> | null>;
}

class MockShippingAdapter implements ShippingAdapter {
  async createInboundLabel(order: OrderRecord): Promise<ShippingLabel> {
    console.info('Mock create label for order', order.id);
    return {
      labelId: randomUUID(),
      carrier: 'MockCarrier',
      tracking: `MOCK${Math.round(Math.random() * 1_000_000)}`,
      url: 'https://example.com/label.pdf',
      metadata: { mode: 'mock' }
    };
  }

  async voidLabel(label: ShippingLabel): Promise<void> {
    console.info('Mock void label', label.labelId);
  }

  async refreshTracking(): Promise<Partial<ShippingLabel> | null> {
    return null;
  }
}

let adapter: ShippingAdapter | null = null;

export function shippingAdapter(): ShippingAdapter {
  if (adapter) {
    return adapter;
  }

  if (process.env.SHIPENGINE_API_KEY && !process.env.SHIPENGINE_DISABLED) {
    adapter = new ShipEngineAdapter();
    return adapter;
  }

  adapter = new MockShippingAdapter();
  return adapter;
}
