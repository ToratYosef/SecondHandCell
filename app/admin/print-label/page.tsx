import { assertRole, getAuthContext } from '@/lib/auth';
import { listOrders } from '@/services/orders';

export default async function PrintLabelPage() {
  const context = await getAuthContext();
  assertRole(context, 'admin');
  const orders = await listOrders(10);
  return (
    <div className="card" style={{ maxWidth: '720px', margin: '0 auto' }}>
      <h1 className="section-title" style={{ fontSize: '2rem' }}>Print label</h1>
      <p>Select an order to generate a new inbound shipping label via ShipEngine.</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {orders.map((order) => (
          <li key={order.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid rgba(15,23,42,0.08)' }}>
            <form action={`/api/generate-label/${order.id}`} method="post">
              <strong>{order.orderNumber}</strong> – {order.shippingInfo.name}
              <button className="btn-primary" type="submit" style={{ marginLeft: '1rem' }}>
                Generate
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
