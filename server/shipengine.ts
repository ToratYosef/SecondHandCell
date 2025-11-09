import { Quote, ShippingInfo, WorkflowLabel } from "@shared/schema";
import { env, requireEnv } from "./env";

export type LabelKind = "email_label" | "kit_outbound" | "kit_inbound" | "return_label";

interface ShipEngineAddress {
  name?: string;
  company_name?: string;
  phone?: string;
  address_line1: string;
  address_line2?: string;
  city_locality: string;
  state_province: string;
  postal_code: string;
  country_code: string;
}

interface CreateLabelResult {
  labelId: string;
  trackingNumber?: string;
  labelUrl?: string;
  carrierCode?: string;
}

function toShipEngineAddress(info: ShippingInfo): ShipEngineAddress {
  return {
    name: info.name,
    phone: info.phone,
    address_line1: info.address1,
    address_line2: info.address2,
    city_locality: info.city,
    state_province: info.state,
    postal_code: info.postalCode,
    country_code: "US",
  };
}

function buildWarehouseAddress(): ShipEngineAddress {
  return {
    name: env.SHIPENGINE_FROM_NAME,
    company_name: env.SHIPENGINE_FROM_COMPANY,
    phone: env.SHIPENGINE_FROM_PHONE,
    address_line1: env.SHIPENGINE_FROM_ADDRESS1 ?? "",
    address_line2: env.SHIPENGINE_FROM_ADDRESS2 || undefined,
    city_locality: env.SHIPENGINE_FROM_CITY ?? "",
    state_province: env.SHIPENGINE_FROM_STATE ?? "",
    postal_code: env.SHIPENGINE_FROM_POSTAL ?? "",
    country_code: "US",
  };
}

function buildLabelMessages(quote: Quote) {
  const storage = quote.storage >= 1000 ? `${quote.storage / 1000}TB` : `${quote.storage}GB`;
  return {
    reference1: quote.orderNumber,
    reference2: `${quote.modelName} ${storage}`,
    reference3: `${quote.condition} / ${quote.workflow.lockStatus}`,
  };
}

export async function createShippingLabel(quote: Quote, kind: LabelKind): Promise<CreateLabelResult> {
  const apiKey = requireEnv("SHIPENGINE_KEY");
  const shippingInfo = quote.workflow.shippingInfo;
  const warehouse = buildWarehouseAddress();

  let shipTo: ShipEngineAddress;
  let shipFrom: ShipEngineAddress;

  switch (kind) {
    case "kit_outbound":
    case "return_label":
      shipFrom = warehouse;
      shipTo = toShipEngineAddress(shippingInfo);
      break;
    case "kit_inbound":
    case "email_label":
      shipFrom = toShipEngineAddress(shippingInfo);
      shipTo = warehouse;
      break;
    default:
      shipFrom = warehouse;
      shipTo = toShipEngineAddress(shippingInfo);
  }

  const isReturnLabel = kind === "return_label";

  const body = {
    shipment: {
      service_code: "usps_priority_mail",
      ship_from: shipFrom,
      ship_to: shipTo,
      packages: [
        {
          weight: { value: 16, unit: "ounce" },
          dimensions: { length: 8, width: 6, height: 4, unit: "inch" },
          label_messages: buildLabelMessages(quote),
        },
      ],
      validate_address: "no_validation",
      is_return_label: isReturnLabel,
    },
    label_format: "pdf",
    label_layout: "4x6",
  };

  const response = await fetch("https://api.shipengine.com/v1/labels", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "API-Key": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`ShipEngine label creation failed: ${response.status} ${detail}`);
  }

  const payload = await response.json();

  return {
    labelId: payload.label_id,
    trackingNumber: payload.tracking_number,
    labelUrl: payload.label_download?.href,
    carrierCode: payload.carrier_code,
  };
}

export function labelToWorkflow(label: CreateLabelResult, note?: string): WorkflowLabel {
  return {
    provider: "ShipEngine",
    labelId: label.labelId,
    trackingNumber: label.trackingNumber,
    url: label.labelUrl,
    sentAt: new Date().toISOString(),
    notes: note,
  };
}
