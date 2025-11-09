import { getAuthContext } from '@/lib/auth';
import { firestore } from '@/lib/firebaseAdmin';

export default async function MyAccountPage() {
  const context = await getAuthContext();
  if (!context) {
    return <p>Please log in to view your account history.</p>;
  }

  const ordersSnapshot = await firestore.collection('users').doc(context.uid).collection('orders').get();
  const orders = ordersSnapshot.docs.map((doc) => doc.data());

  return (
    <div className="grid" style={{ gap: '2rem' }}>
      <header>
        <h1 className="section-title">My account</h1>
        <p>Welcome back, {context.email ?? context.uid}.</p>
      </header>
      <section className="card">
        <h2 style={{ fontSize: '1.5rem' }}>Orders</h2>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {orders.map((order: any) => (
              <li key={order.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid rgba(15,23,42,0.08)' }}>
                <strong>{order.orderNumber}</strong> – {order.device?.model}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
