'use client';

import { useState } from 'react';
import type { SubmitOrderRequest } from '@/types/orders';
import { QuoteForm } from '@/components/QuoteForm';
import { QuoteSummary } from '@/components/QuoteSummary';
import { submitOrder } from '@/lib/client-api';
import type { DeviceModel } from '@/data/deviceCatalog';

interface SellExperienceProps {
  device: { brand: string; model: DeviceModel };
  prefill: Record<string, string | undefined>;
}

export function SellExperience({ device, prefill }: SellExperienceProps) {
  const [result, setResult] = useState<{ orderNumber: string; orderId: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedPayload, setSubmittedPayload] = useState<SubmitOrderRequest | null>(null);

  async function handleSubmit(data: SubmitOrderRequest) {
    setLoading(true);
    setError(null);
    try {
      const response = await submitOrder(data);
      setResult(response);
      setSubmittedPayload(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sell-flow">
      <div className="sell-flow-form">
        <QuoteForm
          devicePreset={device}
          initialValues={prefill}
          onSubmit={handleSubmit}
          loading={loading}
        />
        {error && <p className="form-error">{error}</p>}
      </div>
      {result && submittedPayload && (
        <QuoteSummary order={submittedPayload} confirmation={result} />
      )}
    </div>
  );
}
