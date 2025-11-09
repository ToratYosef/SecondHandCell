import type { NextPage } from 'next';

const OrderSubmittedPage: NextPage = () => (
  <div className="card" style={{ maxWidth: '640px', margin: '0 auto' }}>
    <h1 className="section-title" style={{ fontSize: '2rem' }}>Order submitted</h1>
    <p>Your wholesale order is confirmed. Track status inside the admin or wholesale portals.</p>
  </div>
);

export default OrderSubmittedPage;
