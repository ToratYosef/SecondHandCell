"use client";

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import {
  deviceCatalog as fallbackCatalog,
  type DeviceFamily,
  deriveBasePriceFromMatrix
} from '@/data/deviceCatalog';
import { firebaseFirestore } from '@/lib/firebaseClient';

export interface DeviceSelectorInitialState {
  brand?: string;
  model?: string;
  storage?: string;
  carrier?: string;
}

function mapCarrierKeyToLabel(carrierKey: string): string {
  if (!carrierKey) return 'Unlocked';
  const normalized = carrierKey.toLowerCase();
  if (normalized.includes('unlock')) return 'Unlocked';
  if (normalized.includes('lock')) return 'Carrier locked';
  return carrierKey;
}

export function DeviceSelector({ initial }: { initial?: DeviceSelectorInitialState }) {
  const router = useRouter();
  const params = useSearchParams();
  const [catalog, setCatalog] = useState<DeviceFamily[]>(fallbackCatalog);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [isNavigating, startTransition] = useTransition();

  useEffect(() => {
    let active = true;
    async function hydrateFromFirestore() {
      try {
        setLoadingCatalog(true);
        const db = firebaseFirestore();
        const snapshot = await getDocs(collection(db, 'devices'));
        const families: DeviceFamily[] = [];
        for (const brandDoc of snapshot.docs) {
          const brandData = brandDoc.data() as { name?: string; displayName?: string };
          const modelsSnapshot = await getDocs(collection(brandDoc.ref, 'models'));
          const models = modelsSnapshot.docs.map((modelDoc) => {
            const data = modelDoc.data() as any;
            const prices = data.prices ?? {};
            const storageKeys = Object.keys(prices);
            const pricingMatrix = storageKeys.reduce<Record<string, Record<string, Record<string, number>>>>(
              (acc, storageKey) => {
                const carrierMap = prices[storageKey] ?? {};
                const carrierEntries = Object.entries(carrierMap).reduce<Record<string, Record<string, number>>>(
                  (carrierAcc, [key, value]) => {
                    carrierAcc[key] = value ?? {};
                    return carrierAcc;
                  },
                  {}
                );
                acc[storageKey] = carrierEntries;
                return acc;
              },
              {}
            );

            const carriers = new Set<string>();
            Object.keys(pricingMatrix).forEach((storageKey) => {
              Object.keys(pricingMatrix[storageKey] ?? {}).forEach((carrierKey) => carriers.add(carrierKey));
            });

            return {
              name: data.name ?? data.model ?? modelDoc.id,
              slug: data.slug ?? modelDoc.id,
              storageOptions: storageKeys.length ? storageKeys : data.storageOptions ?? ['128GB'],
              carriers: carriers.size
                ? Array.from(carriers).map(mapCarrierKeyToLabel)
                : data.carriers ?? ['Unlocked', 'Carrier locked'],
              basePrice: deriveBasePriceFromMatrix(pricingMatrix) ?? data.basePrice ?? 120,
              heroImage: data.imageUrl ?? data.heroImage,
              pricingMatrix
            };
          });

          families.push({
            brand: brandDoc.id,
            displayName: brandData?.displayName ?? brandData?.name ?? brandDoc.id,
            models
          });
        }

        if (active && families.length) {
          setCatalog(families);
        }
      } catch (error) {
        console.warn('Using fallback catalog data', error);
      } finally {
        if (active) {
          setLoadingCatalog(false);
        }
      }
    }

    void hydrateFromFirestore();
    return () => {
      active = false;
    };
  }, []);

  const paramsBrand = params.get('brand');
  const initialBrand = initial?.brand ?? (paramsBrand ? paramsBrand.toLowerCase() : catalog[0]?.brand ?? '');
  const [brand, setBrand] = useState(initialBrand);

  useEffect(() => {
    if (!catalog.find((family) => family.brand === brand)) {
      setBrand(catalog[0]?.brand ?? initialBrand);
    }
  }, [catalog, brand, initialBrand]);

  const activeFamily = useMemo(
    () => catalog.find((family) => family.brand === brand) ?? catalog[0],
    [brand, catalog]
  );

  const paramsModel = params.get('model');
  const normalizedModel = paramsModel
    ? paramsModel.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    : undefined;
  const [modelSlug, setModelSlug] = useState(
    initial?.model ?? normalizedModel ?? activeFamily?.models[0]?.slug ?? ''
  );

  useEffect(() => {
    if (!activeFamily?.models.find((model) => model.slug === modelSlug)) {
      setModelSlug(activeFamily?.models[0]?.slug ?? modelSlug);
    }
  }, [activeFamily, modelSlug]);

  const paramsStorage = params.get('storage');
  const activeModel = useMemo(
    () => activeFamily?.models.find((entry) => entry.slug === modelSlug) ?? activeFamily?.models[0],
    [activeFamily, modelSlug]
  );

  const [storage, setStorage] = useState(
    initial?.storage ?? paramsStorage ?? activeModel?.storageOptions[0] ?? ''
  );

  useEffect(() => {
    if (activeModel && !activeModel.storageOptions.includes(storage)) {
      setStorage(activeModel.storageOptions[0] ?? storage);
    }
  }, [activeModel, storage]);

  const paramsCarrier = params.get('carrier');
  const [carrier, setCarrier] = useState(
    initial?.carrier ?? paramsCarrier ?? activeModel?.carriers[0] ?? 'Unlocked'
  );

  useEffect(() => {
    if (activeModel && !activeModel.carriers.includes(carrier)) {
      setCarrier(activeModel.carriers[0] ?? carrier);
    }
  }, [activeModel, carrier]);

  useEffect(() => {
    if (!activeModel) {
      return;
    }
    router.prefetch(`/sell/${activeModel.slug}`);
  }, [activeModel?.slug, router]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const nextParams = new URLSearchParams(window.location.search);
    if (brand) nextParams.set('brand', brand);
    if (modelSlug) nextParams.set('model', modelSlug);
    if (storage) nextParams.set('storage', storage);
    if (carrier) nextParams.set('carrier', carrier);
    window.history.replaceState({}, '', `${window.location.pathname}?${nextParams.toString()}`);
  }, [brand, carrier, modelSlug, storage]);

  const previewQuote = useMemo(() => {
    if (!activeModel) {
      return null;
    }
    const matrix = activeModel.pricingMatrix;
    const normalizedCarrier = carrier
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .replace('carrierlocked', 'locked')
      .replace('carrierunlocked', 'unlocked');
    const carrierMatrix = matrix?.[storage]?.[normalizedCarrier] ?? matrix?.[storage]?.unlocked ?? matrix?.[storage]?.locked;
    const amount = carrierMatrix?.flawless ?? deriveBasePriceFromMatrix(matrix) ?? activeModel.basePrice;
    return typeof amount === 'number' ? Math.max(45, Math.round(amount)) : null;
  }, [activeModel, carrier, storage]);

  const stepItems = useMemo(
    () => [
      { step: 1, label: 'Choose device', active: true },
      { step: 2, label: 'Answer questions', active: false },
      { step: 3, label: 'Secure payout', active: false }
    ],
    []
  );

  return (
    <section className="card elevated-panel selector-shell">
      <header className="selector-head panel-header">
        <span className="eyebrow">Quote builder</span>
        <h1 className="section-title" style={{ marginBottom: '0.25rem' }}>Dial in your device</h1>
        <p className="panel-description">
          Stack your preferred brand, model, storage, and carrier. We&apos;ll carry these details into the condition
          wizard and prefill deep links like <code>?quality=flawless&amp;power=yes</code> for campaigns.
          {loadingCatalog && ' Loading live catalog…'}
        </p>
      </header>
      <ol className="selector-progress" aria-label="Quote steps">
        {stepItems.map((item) => (
          <li key={item.step} className={item.active ? 'active' : undefined}>
            <span>{item.step}</span>
            {item.label}
          </li>
        ))}
      </ol>
      <div className="selector-body">
        <div className="selector-fields">
          <div className="selector-field">
            <label className="field">
              <span>Brand</span>
              <select
                value={brand}
                onChange={(event) => {
                  const nextBrand = event.target.value;
                  const nextFamily = catalog.find((family) => family.brand === nextBrand) ?? catalog[0];
                  setBrand(nextBrand);
                  const nextModel = nextFamily?.models[0];
                  if (nextModel) {
                    setModelSlug(nextModel.slug);
                    setStorage(nextModel.storageOptions[0]);
                    setCarrier(nextModel.carriers[0] ?? 'Unlocked');
                  }
                }}
              >
                {catalog.map((family) => (
                  <option key={family.brand} value={family.brand}>
                    {family.displayName}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="selector-field">
            <label className="field">
              <span>Model</span>
              <select
                value={modelSlug}
                onChange={(event) => {
                  const nextSlug = event.target.value;
                  setModelSlug(nextSlug);
                  const nextModel = activeFamily?.models.find((model) => model.slug === nextSlug);
                  if (nextModel) {
                    setStorage(nextModel.storageOptions[0]);
                    setCarrier(nextModel.carriers[0] ?? 'Unlocked');
                  }
                }}
              >
                {activeFamily?.models.map((model) => (
                  <option key={model.slug} value={model.slug}>
                    {model.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="selector-field">
            <label className="field">
              <span>Storage tier</span>
              <select value={storage} onChange={(event) => setStorage(event.target.value)}>
                {(activeModel?.storageOptions ?? []).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="selector-field">
            <label className="field">
              <span>Carrier status</span>
              <select value={carrier} onChange={(event) => setCarrier(event.target.value)}>
                {(activeModel?.carriers ?? ['Unlocked']).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="selector-meta">
            <strong>Deep link tips</strong>
            <p>
              Append <code>power=no</code>, <code>functionality=cracked</code>, or <code>quality=good</code> to lock in
              defaults for the condition wizard and share targeted campaigns.
            </p>
          </div>
        </div>
        <aside className="selector-preview" aria-live="polite">
          <div className="selector-preview-image" aria-hidden>
            {activeModel?.heroImage ? (
              <img src={activeModel.heroImage} alt="" loading="lazy" />
            ) : (
              <div className="selector-preview-placeholder">{activeModel?.name ?? 'Select a device'}</div>
            )}
          </div>
          <div className="selector-preview-body">
            <span className="eyebrow">Selection summary</span>
            <h2>{activeModel?.name ?? 'Choose a model'}</h2>
            <dl>
              <div>
                <dt>Brand</dt>
                <dd>{activeFamily?.displayName ?? '—'}</dd>
              </div>
              <div>
                <dt>Storage</dt>
                <dd>{storage}</dd>
              </div>
              <div>
                <dt>Carrier</dt>
                <dd>{carrier}</dd>
              </div>
            </dl>
            <div className="selector-preview-quote">
              <span>Top expected payout</span>
              <strong>{previewQuote ? `$${previewQuote}` : '—'}</strong>
              <p>This is the flawless payout for the selected configuration.</p>
            </div>
          </div>
        </aside>
      </div>
      <footer className="panel-footer selector-actions">
        <button
          className="btn-primary"
          type="button"
          disabled={!activeModel || isNavigating}
          onClick={() => {
            if (!activeModel) {
              return;
            }
            const searchParams = new URLSearchParams(params.toString());
            searchParams.set('brand', activeFamily?.brand ?? '');
            searchParams.set('model', activeModel.slug);
            searchParams.set('storage', storage);
            searchParams.set('carrier', carrier ?? activeModel.carriers[0] ?? 'Unlocked');
            startTransition(() => {
              router.push(`/sell/${activeModel.slug}?${searchParams.toString()}`);
            });
          }}
        >
          {isNavigating ? 'Loading…' : 'Continue to questions'}
        </button>
      </footer>
    </section>
  );
}
