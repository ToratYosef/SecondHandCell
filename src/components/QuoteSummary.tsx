import type { SubmitOrderRequest } from '@/types/orders';

export function QuoteSummary({
  order,
  confirmation
}: {
  order: SubmitOrderRequest;
  confirmation: { orderNumber: string; orderId: string };
}) {
  return (
    <aside className="card" style={{ border: '1px solid rgba(15, 23, 42, 0.1)' }}>
      <h2 className="section-title" style={{ fontSize: '1.75rem' }}>
        Order confirmed
      </h2>
      <p style={{ lineHeight: 1.6 }}>
        We&apos;ve saved your quote and started preparing a kit. Track progress from your account any time.
      </p>
      <dl style={{ display: 'grid', gap: '0.5rem', marginTop: '1.5rem' }}>
        <div>
          <dt style={{ fontWeight: 600 }}>Order number</dt>
          <dd>{confirmation.orderNumber}</dd>
        </div>
        <div>
          <dt style={{ fontWeight: 600 }}>Device</dt>
          <dd>
            {order.device.brand} {order.device.model} • {order.device.storage}
          </dd>
        </div>
        <div>
          <dt style={{ fontWeight: 600 }}>Payout method</dt>
          <dd>{order.payment.method}</dd>
        </div>
      </dl>
    </aside>
  );
}
