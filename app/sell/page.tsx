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
    <section className="card elevated-panel selector-shell" aria-busy="true">
      <header className="selector-head panel-header">
        <span className="eyebrow">Loading</span>
        <h1 className="section-title" style={{ marginBottom: '0.25rem' }}>Preparing catalog…</h1>
        <p className="panel-description">Fetching the latest device catalog.</p>
      </header>
      <ol className="selector-progress" aria-hidden="true">
        {Array.from({ length: 3 }).map((_, index) => (
          <li key={index} className={index === 0 ? 'active skeleton' : 'skeleton'}>
            <span>{index + 1}</span>
            Step {index + 1}
          </li>
        ))}
      </ol>
      <div className="selector-body skeleton" aria-hidden="true">
        <div className="selector-fields">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="skeleton-tile" />
          ))}
          <div className="skeleton-tile" style={{ minHeight: '92px' }} />
        </div>
        <aside className="selector-preview">
          <div className="selector-preview-placeholder" />
        </aside>
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
          Start by locking in the combo of brand, model, storage, and carrier from the stacked dropdown list. Shareable
          deep links such as <code>?brand=apple&amp;model=iphone-12-pro-max&amp;quality=good</code> keep marketing promos
          and CRM follow-ups perfectly in sync.
        </p>
      </section>
      <Suspense fallback={<SelectorFallback />}>
        <DeviceSelector initial={initial} />
      </Suspense>
    </div>
  );
}
