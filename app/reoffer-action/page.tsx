'use client';

import { useState } from 'react';

export default function ReofferActionPage() {
  const [status, setStatus] = useState<string | null>(null);

  async function handle(action: 'accept' | 'return') {
    const endpoint = action === 'accept' ? '/api/accept-offer-action' : '/api/return-phone-action';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: 'demo-order' })
    });
    setStatus(response.ok ? `Offer ${action}ed` : 'Request failed');
  }

  return (
    <div className="card" style={{ maxWidth: '520px', margin: '0 auto' }}>
      <h1 className="section-title" style={{ fontSize: '2rem' }}>Updated offer</h1>
      <p style={{ lineHeight: 1.6 }}>
        A specialist reviewed your device and proposed a revised amount. Accept to continue or request
        a return label immediately.
      </p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button className="btn-primary" onClick={() => void handle('accept')}>
          Accept offer
        </button>
        <button className="btn-primary" onClick={() => void handle('return')} style={{ background: '#fff', color: '#004e92' }}>
          Return device
        </button>
      </div>
      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
    </div>
  );
}
