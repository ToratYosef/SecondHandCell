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
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        {items.slice(0, 6).map((item) => (
          <article key={item.id} className="card">
            <h2 style={{ fontWeight: 600 }}>{item.title}</h2>
            <p>SKU: {item.sku}</p>
            <p>${item.price.toFixed(2)}</p>
            <Link href="/buy/cart.html" style={{ color: '#004e92', fontWeight: 600 }}>
              Add to cart
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
