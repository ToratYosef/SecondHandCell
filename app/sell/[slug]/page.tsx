import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findDeviceBySlug, deviceCatalog } from '@/data/deviceCatalog';
import { SellExperience } from '@/components/SellExperience';
import type { QuoteFormInitialValues } from '@/components/QuoteForm';
import { DeviceCondition, PaymentMethod } from '@/types/orders';

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

  const toOptionalString = (value: string | string[] | undefined) =>
    typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;

  const parseBoolean = (value: string | undefined) => {
    if (!value) return undefined;
    const normalized = value.toLowerCase();
    if (['yes', 'true', '1', 'on'].includes(normalized)) return true;
    if (['no', 'false', '0', 'off'].includes(normalized)) return false;
    return undefined;
  };

  const functionalityParam = toOptionalString(searchParams.functionality);
  const powerParam = toOptionalString(searchParams.power);
  const qualityParam = toOptionalString(searchParams.quality);

  const screenFunctionalPrefill = (() => {
    const fromPower = parseBoolean(powerParam ?? undefined);
    if (fromPower !== undefined) {
      return fromPower;
    }
    if (!functionalityParam) {
      return undefined;
    }
    if (/no[-\s]?power|dead|won't\s*turn\s*on|wont\s*turn\s*on/i.test(functionalityParam)) {
      return false;
    }
    return undefined;
  })();

  const hasCracksPrefill = (() => {
    if (!functionalityParam) {
      return undefined;
    }
    return /crack|shatter|broken\s*glass/i.test(functionalityParam) ? true : undefined;
  })();

  const cosmeticPrefill = (() => {
    if (!qualityParam) {
      return undefined;
    }
    const normalized = qualityParam.toLowerCase();
    if (['flawless', 'mint', 'new'].some((token) => normalized.includes(token))) {
      return DeviceCondition.Flawless;
    }
    if (['good', 'great', 'excellent'].some((token) => normalized.includes(token))) {
      return DeviceCondition.Good;
    }
    if (['fair', 'used', 'ok'].some((token) => normalized.includes(token))) {
      return DeviceCondition.Fair;
    }
    if (['poor', 'bad', 'damaged', 'broken'].some((token) => normalized.includes(token))) {
      return DeviceCondition.Poor;
    }
    return undefined;
  })();

  const shippingPreferenceParam = toOptionalString(searchParams.shippingPreference ?? searchParams.ship);
  const shippingPreference = shippingPreferenceParam
    ? shippingPreferenceParam.toLowerCase().startsWith('self')
      ? 'self-ship'
      : 'kit'
    : undefined;

  const shippingInfoPrefill: NonNullable<QuoteFormInitialValues['shippingInfo']> = {};
  const shippingKeys: Record<string, keyof NonNullable<QuoteFormInitialValues['shippingInfo']>> = {
    name: 'name',
    fullName: 'name',
    email: 'email',
    phone: 'phone',
    address: 'address',
    line1: 'address',
    city: 'city',
    state: 'state',
    province: 'state',
    postalCode: 'postalCode',
    zip: 'postalCode',
    country: 'country'
  };

  for (const [paramKey, targetKey] of Object.entries(shippingKeys)) {
    const value = toOptionalString(searchParams[paramKey]);
    if (value) {
      shippingInfoPrefill[targetKey] = value;
    }
  }

  const paymentMethodParam = toOptionalString(
    searchParams.payment ?? searchParams.payoutMethod ?? searchParams.method
  );

  const paymentMethod = (() => {
    if (!paymentMethodParam) return undefined;
    const normalized = paymentMethodParam.toLowerCase();
    if (normalized.includes('venmo')) return PaymentMethod.Venmo;
    if (normalized.includes('check')) return PaymentMethod.Check;
    if (normalized.includes('zelle')) return PaymentMethod.Zelle;
    return PaymentMethod.PayPal;
  })();

  const paymentPrefill: QuoteFormInitialValues['payment'] = {
    method: paymentMethod,
    email: toOptionalString(searchParams.payoutEmail ?? searchParams.paypal ?? searchParams.paymentEmail),
    venmoHandle: toOptionalString(searchParams.venmo ?? searchParams.venmoHandle),
    mailingAddress: toOptionalString(searchParams.mailingAddress)
  };

  if (!paymentPrefill.email && shippingInfoPrefill.email) {
    paymentPrefill.email = shippingInfoPrefill.email;
  }

  const hasPaymentPrefill = Object.values(paymentPrefill ?? {}).some(
    (value) => value !== undefined && value !== ''
  );

  const prefill: QuoteFormInitialValues = {
    storage,
    carrier,
    screenFunctional: screenFunctionalPrefill,
    hasCracks: hasCracksPrefill,
    cosmetic: cosmeticPrefill,
    imei: toOptionalString(searchParams.imei),
    shippingPreference,
    shippingInfo: Object.keys(shippingInfoPrefill).length ? shippingInfoPrefill : undefined,
    payment: hasPaymentPrefill ? paymentPrefill : undefined,
    notes: toOptionalString(searchParams.notes)
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
