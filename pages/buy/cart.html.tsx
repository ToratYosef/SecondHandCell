import type { NextPage } from 'next';

const CartPage: NextPage = () => (
  <div className="card" style={{ maxWidth: '640px', margin: '0 auto' }}>
    <h1 className="section-title" style={{ fontSize: '2rem' }}>Wholesale cart</h1>
    <p>Cart management is implemented client-side using local storage synced with Firestore.</p>
  </div>
);

export default CartPage;
