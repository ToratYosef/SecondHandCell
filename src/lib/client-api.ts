import type { SubmitOrderRequest } from '@/types/orders';

export async function submitOrder(payload: SubmitOrderRequest): Promise<{ orderId: string; orderNumber: string }> {
  const response = await fetch('/api/submit-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    throw new Error(detail.message ?? 'Failed to submit order');
  }

  return response.json();
}
