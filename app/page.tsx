import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="grid" style={{ gap: '2.5rem' }}>
      <section className="hero-banner">
        <div className="hero-copy">
          <span className="eyebrow">Next.js + Firebase</span>
          <h1 className="section-title">Your full-stack buyback command center</h1>
          <p>
            SecondHandCell unifies marketing, instant quotes, logistics, and wholesale operations into a secure Next.js
            platform backed by Firestore. Chat with customers in real time, generate sequential order numbers, trigger
            ShipEngine labels, and keep your admin team informed via audit logs and push notifications.
          </p>
          <div className="hero-actions">
            <Link className="btn-primary" href="/sell">
              Launch quote builder
            </Link>
            <a className="ghost-button" href="#flows">See platform map</a>
          </div>
        </div>
        <div className="hero-preview">
          <span>Guided flow preview</span>
          <div className="preview-card">
            <strong>Step 1</strong>
            <p>Select device · Carrier · Storage</p>
            <strong>Step 2</strong>
            <p>Condition questions with instant quote</p>
            <strong>Step 3</strong>
            <p>Shipping kit + payout preference</p>
          </div>
        </div>
      </section>

      <section id="flows">
        <h2 className="section-title">What&apos;s inside</h2>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          {[
            {
              title: 'Sell experience',
              description: 'Responsive quote builder, guest checkout with encouragement to sign in, and live order status tracking.'
            },
            {
              title: 'Admin dashboard',
              description: 'Role-secured queue, analytics widgets, audit log viewer, and bulk logistics controls.'
            },
            {
              title: 'Wholesale suite',
              description: 'Inventory sync, pricing tiers, and checkout flows that create Stripe payment intents.'
            },
            {
              title: 'Background jobs',
              description: 'Cloud Function examples for tracking refresh, expired label voids, auto accept/decline flows, and more.'
            }
          ].map((item) => (
            <article key={item.title} className="card">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>{item.title}</h3>
              <p style={{ lineHeight: 1.6 }}>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Live chat support</h2>
        <p style={{ lineHeight: 1.6 }}>
          Every marketing and account page embeds a Firestore-powered chat widget so customers can
          reach an agent instantly. Messages stream into the admin console and send FCM alerts to the
          on-call team. The widget is ready to connect to Zendesk or other support tooling through
          adapters in <code>src/integrations</code>.
        </p>
      </section>
    </div>
  );
}
