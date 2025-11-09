import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findDeviceBySlug, deviceCatalog } from '@/data/deviceCatalog';
import { SellExperience } from '@/components/SellExperience';

interface PageProps {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const result = findDeviceBySlug(params.slug);
  if (!result) {
    return {
      title: 'Device not found | SecondHandCell'
    };
  }

  const title = `Sell your ${result.brand} ${result.model.name} | SecondHandCell`;
  return {
    title,
    description: `Answer a few questions about your ${result.model.name} to lock in a guaranteed quote.`
  };
}

export function generateStaticParams() {
  return deviceCatalog.flatMap((family) => family.models.map((model) => ({ slug: model.slug })));
}

export default function SellDevicePage({ params, searchParams }: PageProps) {
  const result = findDeviceBySlug(params.slug);
  if (!result) {
    notFound();
  }

  const storageParam = typeof searchParams.storage === 'string' ? searchParams.storage : undefined;
  const carrierParam = typeof searchParams.carrier === 'string' ? searchParams.carrier : undefined;

  const storage = storageParam && result.model.storageOptions.includes(storageParam)
    ? storageParam
    : result.model.storageOptions[0];

  const carrier = carrierParam && result.model.carriers.includes(carrierParam)
    ? carrierParam
    : result.model.carriers[0];

  const prefill = {
    storage,
    carrier,
    brand: typeof searchParams.brand === 'string' ? searchParams.brand : result.brand,
    model: typeof searchParams.model === 'string' ? searchParams.model : result.model.name
  };

  return (
    <div className="sell-device-shell">
      <section className="device-hero">
        <span className="eyebrow">Step 2</span>
        <h1 className="section-title">Sell your {result.model.name}</h1>
        <p>
          Ready to lock in your {result.model.name}? Answer a few condition questions and see your guaranteed payout update
          in real time. Update query params or the controls above to change storage, carrier, or condition presets.
        </p>
      </section>
      <SellExperience device={result} prefill={prefill} />
    </div>
  );
}
