'use client';

import { useEffect, useMemo, useState } from 'react';
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

  return (
    <section className="card elevated-panel">
      <header className="panel-header">
        <span className="eyebrow">Step 1</span>
        <h1 className="section-title" style={{ marginBottom: '0.25rem' }}>Build your quote</h1>
        <p className="panel-description">
          Choose your device, storage, and carrier to jump directly into the condition questions.
          {loadingCatalog && ' Loading live catalog…'}
        </p>
      </header>
      <div className="selector-grid">
        <label className="field">
          <span>Device brand</span>
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
            {(activeModel?.storageOptions ?? []).map((option) => (
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
            searchParams.set('brand', activeFamily?.brand ?? '');
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
