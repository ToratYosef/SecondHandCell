'use client';

import { useState } from 'react';
import { QuoteForm } from '@/components/QuoteForm';
import { QuoteSummary } from '@/components/QuoteSummary';
import { submitOrder } from '@/lib/client-api';
import type { SubmitOrderRequest } from '@/types/orders';

export default function SellPage() {
  const [result, setResult] = useState<{ orderNumber: string; orderId: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<SubmitOrderRequest | null>(null);

  async function handleSubmit(data: SubmitOrderRequest) {
    setLoading(true);
    setError(null);
    try {
      const response = await submitOrder(data);
      setResult(response);
      setPayload(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid" style={{ gap: '2rem' }}>
      <div className="card">
        <h1 className="section-title">Sell your device</h1>
        <p style={{ lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Sign in for the fastest experience, or continue as a guest. Your quote and order will be saved
          automatically, and we&apos;ll email you a prepaid shipping kit.
        </p>
        <QuoteForm onSubmit={handleSubmit} loading={loading} />
        {error && <p style={{ color: '#b91c1c', marginTop: '1rem' }}>{error}</p>}
      </div>
      {result && payload && (
        <QuoteSummary order={payload} confirmation={result} />
      )}
    </div>
  );
}
