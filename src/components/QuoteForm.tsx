'use client';

import { useMemo, useState, type FormEvent } from 'react';
import type { SubmitOrderRequest } from '@/types/orders';
import { DeviceCondition, PaymentMethod } from '@/types/orders';
import type { DeviceModel } from '@/data/deviceCatalog';

interface QuoteFormProps {
  devicePreset: { brand: string; model: DeviceModel };
  initialValues?: Record<string, string | undefined>;
  onSubmit: (payload: SubmitOrderRequest) => Promise<void>;
  loading?: boolean;
}

export function QuoteForm({ devicePreset, initialValues, onSubmit, loading }: QuoteFormProps) {
  const [storage, setStorage] = useState(
    initialValues?.storage ?? devicePreset.model.storageOptions[0]
  );
  const [carrier, setCarrier] = useState(
    initialValues?.carrier ?? devicePreset.model.carriers[0]
  );
  const [screenFunctional, setScreenFunctional] = useState(true);
  const [hasCracks, setHasCracks] = useState(false);
  const [cosmetic, setCosmetic] = useState<DeviceCondition>(DeviceCondition.Flawless);
  const [imei, setImei] = useState('');
  const [shippingPreference, setShippingPreference] = useState<'kit' | 'self-ship'>(
    (initialValues?.shippingPreference as 'kit' | 'self-ship' | undefined) ?? 'kit'
  );
  const [shippingInfo, setShippingInfo] = useState<SubmitOrderRequest['shippingInfo']>({
    name: initialValues?.name ?? '',
    email: initialValues?.email ?? '',
    phone: initialValues?.phone ?? '',
    address: initialValues?.address ?? '',
    city: initialValues?.city ?? '',
    state: initialValues?.state ?? '',
    postalCode: initialValues?.postalCode ?? '',
    country: initialValues?.country ?? 'US'
  });
  const [payment, setPayment] = useState<SubmitOrderRequest['payment']>({
    method: PaymentMethod.PayPal,
    email: initialValues?.payoutEmail ?? '',
    venmoHandle: initialValues?.venmoHandle ?? '',
    mailingAddress: initialValues?.mailingAddress ?? ''
  });
  const [notes, setNotes] = useState(initialValues?.notes ?? '');

  const computedQuote = useMemo(() => {
    const matrix = devicePreset.model.pricingMatrix;
    const carrierKey = (() => {
      const normalized = carrier.toLowerCase();
      if (normalized.includes('unlock')) {
        return 'unlocked';
      }
      if (normalized.includes('lock')) {
        return 'locked';
      }
      return normalized.replace(/[^a-z0-9]/g, '');
    })();

    const conditionKey = (() => {
      if (!screenFunctional) {
        return 'noPower';
      }
      if (hasCracks) {
        return 'broken';
      }
      switch (cosmetic) {
        case DeviceCondition.Flawless:
          return 'flawless';
        case DeviceCondition.Good:
          return 'good';
        case DeviceCondition.Fair:
          return 'fair';
        case DeviceCondition.Poor:
          return 'damaged';
        default:
          return 'good';
      }
    })();

    if (matrix) {
      const carrierMatrix = matrix[storage]?.[carrierKey] ?? matrix[storage]?.unlocked ?? matrix[storage]?.locked;
      const amount = carrierMatrix?.[conditionKey];
      if (typeof amount === 'number' && !Number.isNaN(amount)) {
        return Math.max(35, Math.round(amount));
      }
    }

    let amount = devicePreset.model.basePrice;
    if (!screenFunctional) {
      amount -= devicePreset.model.basePrice * 0.25;
    }
    if (hasCracks) {
      amount -= devicePreset.model.basePrice * 0.2;
    }

    switch (cosmetic) {
      case DeviceCondition.Good:
        amount -= 40;
        break;
      case DeviceCondition.Fair:
        amount -= 90;
        break;
      case DeviceCondition.Poor:
        amount -= 160;
        break;
      default:
        break;
    }

    return Math.max(55, Math.round(amount));
  }, [carrier, cosmetic, devicePreset.model.basePrice, devicePreset.model.pricingMatrix, hasCracks, screenFunctional, storage]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const conditionNotes = `Carrier: ${carrier}\nScreen functional: ${screenFunctional ? 'yes' : 'no'}\nCracks: ${hasCracks ? 'yes' : 'no'}`;
    const payload: SubmitOrderRequest = {
      userToken: null,
      shippingInfo,
      device: {
        brand: devicePreset.brand,
        model: devicePreset.model.name,
        storage,
        condition: cosmetic,
        imei,
        carrier
      },
      payment,
      shippingPreference,
      quotedAmount: computedQuote,
      notes: notes ? `${notes}\n${conditionNotes}` : conditionNotes
    };
    void onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="quote-form">
      <section className="card question-card">
        <header className="panel-header">
          <span className="eyebrow">Device configuration</span>
          <h2>Confirm core details</h2>
        </header>
        <div className="selector-grid">
          <label className="field">
            <span>Storage</span>
            <select value={storage} onChange={(event) => setStorage(event.target.value)}>
              {devicePreset.model.storageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Carrier</span>
            <select value={carrier} onChange={(event) => setCarrier(event.target.value)}>
              {devicePreset.model.carriers.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>IMEI (optional)</span>
            <input value={imei} onChange={(event) => setImei(event.target.value)} placeholder="3567 89…" />
          </label>
        </div>
      </section>

      <section className="card question-card">
        <header className="panel-header">
          <span className="eyebrow">Condition wizard</span>
          <h2>Tell us about the device</h2>
        </header>
        <div className="question-grid">
          <div className="question-block">
            <h3>Is the screen fully functional and free of defects?</h3>
            <div className="pill-group">
              <button
                type="button"
                className={screenFunctional ? 'pill active' : 'pill'}
                onClick={() => setScreenFunctional(true)}
              >
                Yes
              </button>
              <button
                type="button"
                className={!screenFunctional ? 'pill active' : 'pill'}
                onClick={() => setScreenFunctional(false)}
              >
                No
              </button>
            </div>
          </div>
          <div className="question-block">
            <h3>Are there front or back cracks?</h3>
            <div className="pill-group">
              <button type="button" className={!hasCracks ? 'pill active' : 'pill'} onClick={() => setHasCracks(false)}>
                No
              </button>
              <button type="button" className={hasCracks ? 'pill active' : 'pill'} onClick={() => setHasCracks(true)}>
                Yes
              </button>
            </div>
          </div>
          <div className="question-block">
            <h3>Overall cosmetic condition</h3>
            <div className="pill-group wrap">
              {Object.values(DeviceCondition).map((option) => (
                <button
                  key={option}
                  type="button"
                  className={cosmetic === option ? 'pill active' : 'pill'}
                  onClick={() => setCosmetic(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="quote-preview">
          <span className="eyebrow">Instant quote</span>
          <strong>${computedQuote}</strong>
          <p>This is your guaranteed starting price once your device passes inspection.</p>
        </div>
      </section>

      <section className="card question-card">
        <header className="panel-header">
          <span className="eyebrow">Contact & payout</span>
          <h2>Where should we ship your kit?</h2>
        </header>
        <div className="shipping-grid">
          {(
            [
              ['name', 'Full name'],
              ['email', 'Email'],
              ['phone', 'Phone number'],
              ['address', 'Street address'],
              ['city', 'City'],
              ['state', 'State / Province'],
              ['postalCode', 'Postal / ZIP'],
              ['country', 'Country']
            ] as Array<[keyof SubmitOrderRequest['shippingInfo'], string]>
          ).map(([field, label]) => (
            <label key={field} className="field">
              <span>{label}</span>
              <input
                required
                value={shippingInfo[field] ?? ''}
                onChange={(event) =>
                  setShippingInfo((prev) => ({
                    ...prev,
                    [field]: event.target.value
                  }))
                }
              />
            </label>
          ))}
        </div>
        <div className="selector-grid">
          <label className="field">
            <span>Kit or self-shipping?</span>
            <select value={shippingPreference} onChange={(event) => setShippingPreference(event.target.value as 'kit' | 'self-ship')}>
              <option value="kit">Send me a prepaid kit</option>
              <option value="self-ship">I&apos;ll ship it myself</option>
            </select>
          </label>
          <label className="field">
            <span>Payout method</span>
            <select
              value={payment.method}
              onChange={(event) => {
                const nextMethod = event.target.value as PaymentMethod;
                setPayment((prev) => ({
                  ...prev,
                  method: nextMethod,
                  venmoHandle: nextMethod === PaymentMethod.Venmo ? prev.venmoHandle ?? prev.email ?? '' : prev.venmoHandle
                }));
              }}
            >
              {Object.values(PaymentMethod).map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Payout email or handle</span>
            <input
              value={payment.method === PaymentMethod.Venmo ? payment.venmoHandle ?? '' : payment.email ?? ''}
              onChange={(event) => {
                const value = event.target.value;
                setPayment((prev) => ({
                  ...prev,
                  email: prev.method === PaymentMethod.Venmo ? prev.email : value,
                  venmoHandle: prev.method === PaymentMethod.Venmo ? value : prev.venmoHandle,
                  mailingAddress: prev.mailingAddress
                }));
              }}
              placeholder="you@example.com"
            />
          </label>
          <label className="field">
            <span>Mailing address (for checks)</span>
            <input
              value={payment.mailingAddress ?? ''}
              onChange={(event) => setPayment((prev) => ({ ...prev, mailingAddress: event.target.value }))}
              placeholder="Optional"
            />
          </label>
        </div>
        <label className="field">
          <span>Notes</span>
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} />
        </label>
      </section>

      <footer className="form-actions">
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'Submitting…' : 'Get my kit'}
        </button>
      </footer>
    </form>
  );
}
