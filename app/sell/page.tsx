import type { Metadata } from 'next';
import { DeviceSelector } from '@/components/DeviceSelector';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Get an instant device quote | SecondHandCell',
  description:
    'Select your device, storage, and carrier to launch a guided quote flow with personalized pricing in minutes.'
};

function SelectorFallback() {
  return (
    <section className="card elevated-panel" aria-busy="true">
      <header className="panel-header">
        <span className="eyebrow">Loading</span>
        <h1 className="section-title" style={{ marginBottom: '0.25rem' }}>Preparing catalog…</h1>
        <p className="panel-description">Fetching the latest device catalog.</p>
      </header>
      <div className="selector-grid skeleton" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="skeleton-tile" />
        ))}
      </div>
    </section>
  );
}

export default function SellLanding({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const modelSlug =
    typeof searchParams.modelSlug === 'string'
      ? searchParams.modelSlug
      : typeof searchParams.model === 'string'
        ? searchParams.model.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        : undefined;

  const initial = {
    brand: typeof searchParams.brand === 'string' ? searchParams.brand.toLowerCase() : undefined,
    model: modelSlug,
    storage: typeof searchParams.storage === 'string' ? searchParams.storage : undefined,
    carrier: typeof searchParams.carrier === 'string' ? searchParams.carrier : undefined
  };

  return (
    <div className="sell-layout">
      <section className="sell-hero">
        <span className="eyebrow">Trade-in portal</span>
        <h1 className="section-title">Unlock the highest buyback in minutes</h1>
        <p>
          Start with your device details and jump straight into a tailored condition wizard. Prefill the selectors with
          URL params like <code>?brand=apple&amp;model=iphone-16&amp;storage=256GB</code> to link directly from marketing
          campaigns.
        </p>
      </section>
      <Suspense fallback={<SelectorFallback />}>
        <DeviceSelector initial={initial} />
      </Suspense>
    </div>
  );
}
