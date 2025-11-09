import { listWholesaleInventory } from '@/services/wholesale';
import { getAuthContext } from '@/lib/auth';

export default async function WholesalePage() {
  const context = await getAuthContext();
  if (!context) {
    throw Object.assign(new Error('Unauthorized'), { status: 401 });
  }
  if (!context.roles.includes('partner') && !context.roles.includes('admin')) {
    throw Object.assign(new Error('Forbidden'), { status: 403 });
  }
  const items = await listWholesaleInventory();
  return (
    <div className="grid" style={{ gap: '2rem' }}>
      <header>
        <h1 className="section-title">Wholesale catalog</h1>
        <p style={{ lineHeight: 1.6 }}>Sync this view with your partners or export to CSV via admin tools.</p>
      </header>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {items.map((item) => (
          <article key={item.id} className="card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{item.title}</h2>
            <p>SKU: {item.sku}</p>
            <p>${item.price.toFixed(2)}</p>
            <p>{item.stock} in stock</p>
          </article>
        ))}
      </div>
    </div>
  );
}
