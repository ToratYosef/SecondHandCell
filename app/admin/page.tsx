import { listOrders } from '@/services/orders';
import { getAuthContext } from '@/lib/auth';
import Link from 'next/link';
import { demoOrders } from '@/data/sampleData';

export default async function AdminDashboard() {
  const context = await getAuthContext();
  if (!context || !context.roles.includes('admin')) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h1 className="section-title">Admin access required</h1>
        <p style={{ lineHeight: 1.6 }}>
          Sign in with an admin-enabled Firebase account or attach an <code>Authorization</code> header with the proper
          token to view operational data.
        </p>
      </div>
    );
  }

  let orders = demoOrders;
  let usingDemoData = true;
  try {
    const liveOrders = await listOrders();
    orders = liveOrders;
    usingDemoData = false;
  } catch (error) {
    console.warn('Falling back to demo orders for admin dashboard', error);
  }

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
        {usingDemoData && (
          <p className="panel-description">Sample data shown—connect Firebase Admin credentials to view live orders.</p>
        )}
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
