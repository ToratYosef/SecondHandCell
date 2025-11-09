import type { NextPage } from 'next';

const CheckoutPage: NextPage = () => (
  <div className="card" style={{ maxWidth: '640px', margin: '0 auto' }}>
    <h1 className="section-title" style={{ fontSize: '2rem' }}>Checkout</h1>
    <p>
      Stripe payment intents are created via <code>/api/wholesale/orders/checkout</code>. Provide your
      Firebase ID token to authenticate requests.
    </p>
  </div>
);

export default CheckoutPage;
