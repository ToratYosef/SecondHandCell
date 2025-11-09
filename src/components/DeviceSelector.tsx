'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { deviceCatalog } from '@/data/deviceCatalog';

export interface DeviceSelectorInitialState {
  brand?: string;
  model?: string;
  storage?: string;
  carrier?: string;
}

export function DeviceSelector({ initial }: { initial?: DeviceSelectorInitialState }) {
  const router = useRouter();
  const params = useSearchParams();
  const paramsBrand = params.get('brand');
  const initialBrand = initial?.brand ?? (paramsBrand ? paramsBrand.toLowerCase() : deviceCatalog[0]?.brand ?? '');
  const modelsForBrand = useMemo(() => {
    const active = deviceCatalog.find((family) => family.brand === initialBrand) ?? deviceCatalog[0];
    return active;
  }, [initialBrand]);

  const [brand, setBrand] = useState(initialBrand);
  const paramsModel = params.get('model');
  const normalizedModel = paramsModel
    ? paramsModel.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    : undefined;
  const [modelSlug, setModelSlug] = useState(
    initial?.model ?? normalizedModel ?? modelsForBrand?.models[0]?.slug ?? ''
  );
  const paramsStorage = params.get('storage');
  const [storage, setStorage] = useState(
    initial?.storage ?? paramsStorage ?? modelsForBrand?.models[0]?.storageOptions[0] ?? ''
  );
  const paramsCarrier = params.get('carrier');
  const [carrier, setCarrier] = useState(
    initial?.carrier ?? paramsCarrier ?? modelsForBrand?.models[0]?.carriers[0] ?? 'Unlocked'
  );

  const activeFamily = useMemo(() => deviceCatalog.find((family) => family.brand === brand) ?? deviceCatalog[0], [brand]);
  const activeModel = useMemo(
    () => activeFamily?.models.find((entry) => entry.slug === modelSlug) ?? activeFamily?.models[0],
    [activeFamily, modelSlug]
  );

  const storageOptions = activeModel?.storageOptions ?? [];

  useEffect(() => {
    if (activeModel && !storageOptions.includes(storage)) {
      setStorage(activeModel.storageOptions[0] ?? '');
    }
  }, [activeModel, storage, storageOptions]);

  useEffect(() => {
    if (activeModel && !(activeModel.carriers ?? []).includes(carrier)) {
      setCarrier(activeModel.carriers[0] ?? 'Unlocked');
    }
  }, [activeModel, carrier]);

  return (
    <section className="card elevated-panel">
      <header className="panel-header">
        <span className="eyebrow">Step 1</span>
        <h1 className="section-title" style={{ marginBottom: '0.25rem' }}>Build your quote</h1>
        <p className="panel-description">
          Choose your device, storage, and carrier to jump directly into the condition questions.
        </p>
      </header>
      <div className="selector-grid">
        <label className="field">
          <span>Device brand</span>
          <select
            value={brand}
            onChange={(event) => {
              const nextBrand = event.target.value;
              const nextFamily = deviceCatalog.find((family) => family.brand === nextBrand) ?? deviceCatalog[0];
              setBrand(nextBrand);
              const nextModel = nextFamily.models[0];
              setModelSlug(nextModel.slug);
              setStorage(nextModel.storageOptions[0]);
              setCarrier(nextModel.carriers[0] ?? 'Unlocked');
            }}
          >
            {deviceCatalog.map((family) => (
              <option key={family.brand} value={family.brand}>
                {family.displayName}
              </option>
            ))}
          </select>
        </label>
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
        <label className="field">
          <span>Storage</span>
          <select value={storage} onChange={(event) => setStorage(event.target.value)}>
            {storageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Primary carrier</span>
          <select value={carrier} onChange={(event) => setCarrier(event.target.value)}>
            {(activeModel?.carriers ?? ['Unlocked']).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
      <footer className="panel-footer">
        <button
          className="btn-primary"
          type="button"
          onClick={() => {
            if (!activeModel) {
              return;
            }
            const searchParams = new URLSearchParams();
            searchParams.set('brand', activeFamily?.displayName ?? '');
            searchParams.set('model', activeModel.name);
            searchParams.set('storage', storage);
            searchParams.set('carrier', carrier ?? activeModel.carriers[0] ?? 'Unlocked');
            router.push(`/sell/${activeModel.slug}?${searchParams.toString()}`);
          }}
        >
          Continue to questions
        </button>
      </footer>
    </section>
  );
}
