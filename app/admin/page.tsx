import { listOrders } from '@/services/orders';
import { getAuthContext, assertRole } from '@/lib/auth';
import Link from 'next/link';

export default async function AdminDashboard() {
  const context = await getAuthContext();
  assertRole(context, 'admin');
  const orders = await listOrders();

  return (
    <div className="grid" style={{ gap: '2rem' }}>
      <header>
        <h1 className="section-title">Admin dashboard</h1>
        <p style={{ lineHeight: 1.6 }}>
          Search and manage orders, generate labels, and review audit logs. Use the API routes for
          deeper integrations or connect the GitHub Action deployment pipeline to Vercel.
        </p>
      </header>
      <section className="card">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Recent orders</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Order</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Customer</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Device</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{ borderTop: '1px solid rgba(15,23,42,0.08)' }}>
                <td style={{ padding: '0.5rem' }}>
                  <strong>{order.orderNumber}</strong>
                  <div style={{ fontSize: '0.9rem', color: '#475569' }}>{new Date(order.createdAt).toLocaleString()}</div>
                </td>
                <td style={{ padding: '0.5rem' }}>{order.shippingInfo.name}</td>
                <td style={{ padding: '0.5rem' }}>
                  {order.device.brand} {order.device.model}
                </td>
                <td style={{ padding: '0.5rem' }}>{order.statusTimeline.at(-1)?.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="card" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem' }}>Bulk operations</h2>
          <p>Access quick tools for kit printing and CSV export.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link className="btn-primary" href="/admin/print-label">Print labels</Link>
          <Link className="btn-primary" href="/api/print-bundle/bulk">Bulk PDF</Link>
        </div>
      </section>
    </div>
  );
}
