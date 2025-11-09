import Link from 'next/link';
import { listWholesaleInventory } from '@/services/wholesale';

export default async function BuyLanding() {
  const items = await listWholesaleInventory();
  return (
    <div className="grid" style={{ gap: '2rem' }}>
      <header>
        <h1 className="section-title">Wholesale buyers</h1>
        <p style={{ lineHeight: 1.6 }}>
          Browse inventory sourced from trusted partners. Sign in with your wholesale token to unlock
          checkout and analytics.
        </p>
      </header>
      <div className="inventory-grid">
        {items.slice(0, 6).map((item) => (
          <article key={item.id} className="card inventory-card">
            <span className="eyebrow">{item.stock} units</span>
            <h2 style={{ fontWeight: 600 }}>{item.title}</h2>
            <p>SKU · {item.sku}</p>
            <strong style={{ fontSize: '1.5rem' }}>${item.price.toFixed(2)}</strong>
            <Link className="ghost-button" href="/buy/cart.html">
              Add to cart
            </Link>
          </article>
        ))}
        {items.length === 0 && (
          <article className="card inventory-card">
            <h2 style={{ fontWeight: 600 }}>Connect wholesale inventory</h2>
            <p className="panel-description">
              No wholesale items loaded. Seed the Firestore <code>wholesaleInventory</code> collection or set
              <code>FIREBASE_PROJECT_ID</code> to view production data.
            </p>
          </article>
        )}
      </div>
    </div>
  );
}
