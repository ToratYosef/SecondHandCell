'use client';

import { useState } from 'react';
import type { SubmitOrderRequest } from '@/types/orders';
import { DeviceCondition, PaymentMethod } from '@/types/orders';

const defaultForm: SubmitOrderRequest = {
  userToken: null,
  shippingInfo: {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US'
  },
  device: {
    brand: '',
    model: '',
    storage: '',
    condition: DeviceCondition.Good,
    imei: ''
  },
  payment: {
    method: PaymentMethod.PayPal,
    email: '',
    venmoHandle: '',
    mailingAddress: ''
  },
  shippingPreference: 'kit',
  quotedAmount: 0,
  notes: ''
};

export function QuoteForm({ onSubmit, loading }: { onSubmit: (payload: SubmitOrderRequest) => Promise<void>; loading?: boolean }) {
  const [form, setForm] = useState<SubmitOrderRequest>(defaultForm);

  function update<K extends keyof SubmitOrderRequest>(key: K, value: SubmitOrderRequest[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit(form);
      }}
      style={{ display: 'grid', gap: '1.25rem' }}
    >
      <fieldset style={{ display: 'grid', gap: '0.75rem' }}>
        <legend style={{ fontWeight: 600 }}>Device details</legend>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <label style={{ flex: '1 1 220px' }}>
            <span>Brand</span>
            <input
              required
              value={form.device.brand}
              onChange={(event) => update('device', { ...form.device, brand: event.target.value })}
            />
          </label>
          <label style={{ flex: '1 1 220px' }}>
            <span>Model</span>
            <input
              required
              value={form.device.model}
              onChange={(event) => update('device', { ...form.device, model: event.target.value })}
            />
          </label>
          <label style={{ flex: '1 1 220px' }}>
            <span>Storage</span>
            <input
              required
              value={form.device.storage}
              onChange={(event) => update('device', { ...form.device, storage: event.target.value })}
            />
          </label>
        </div>
        <label>
          <span>Condition</span>
          <select
            value={form.device.condition}
            onChange={(event) => update('device', { ...form.device, condition: event.target.value as DeviceCondition })}
          >
            {Object.values(DeviceCondition).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </fieldset>

      <fieldset style={{ display: 'grid', gap: '0.75rem' }}>
        <legend style={{ fontWeight: 600 }}>Shipping information</legend>
        <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {[
            ['name', 'Full name'],
            ['email', 'Email'],
            ['phone', 'Phone number'],
            ['address', 'Street address'],
            ['city', 'City'],
            ['state', 'State / Province'],
            ['postalCode', 'Postal / ZIP'],
            ['country', 'Country']
          ].map(([field, label]) => (
            <label key={field} style={{ display: 'flex', flexDirection: 'column' }}>
              <span>{label}</span>
              <input
                required
                value={form.shippingInfo[field as keyof SubmitOrderRequest['shippingInfo']] ?? ''}
                onChange={(event) =>
                  update('shippingInfo', {
                    ...form.shippingInfo,
                    [field]: event.target.value
                  })
                }
              />
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset style={{ display: 'grid', gap: '0.75rem' }}>
        <legend style={{ fontWeight: 600 }}>Payout preference</legend>
        <label>
          <span>Method</span>
          <select
            value={form.payment.method}
            onChange={(event) => update('payment', { ...form.payment, method: event.target.value as PaymentMethod })}
          >
            {Object.values(PaymentMethod).map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Payout email</span>
          <input
            value={form.payment.email}
            onChange={(event) => update('payment', { ...form.payment, email: event.target.value })}
          />
        </label>
        <label>
          <span>Venmo handle</span>
          <input
            value={form.payment.venmoHandle ?? ''}
            onChange={(event) => update('payment', { ...form.payment, venmoHandle: event.target.value })}
            placeholder="@username"
          />
        </label>
      </fieldset>

      <label>
        <span>Notes for our team</span>
        <textarea
          rows={4}
          value={form.notes ?? ''}
          onChange={(event) => update('notes', event.target.value)}
        />
      </label>

      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit quote'}
      </button>
    </form>
  );
}
