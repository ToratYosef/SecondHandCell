import type { ShippingAdapter, ShippingLabel } from './shippingAdapter';
import type { OrderRecord } from '@/types/orders';

export class ShipEngineAdapter implements ShippingAdapter {
  private readonly apiKey = process.env.SHIPENGINE_API_KEY!;

  async createInboundLabel(order: OrderRecord): Promise<ShippingLabel> {
    console.info('ShipEngineAdapter#createInboundLabel called for', order.orderNumber);
    // TODO: integrate actual ShipEngine label creation call.
    return {
      labelId: `${order.orderNumber}-label`,
      carrier: 'ShipEngine',
      tracking: `SE${order.orderNumber.replace('SHC-', '')}`,
      url: 'https://example.com/shipengine-label.pdf',
      metadata: { mode: 'stub' }
    };
  }

  async voidLabel(label: ShippingLabel): Promise<void> {
    console.info('ShipEngineAdapter#voidLabel', label.labelId);
  }

  async refreshTracking(): Promise<Partial<ShippingLabel> | null> {
    return null;
  }
}
