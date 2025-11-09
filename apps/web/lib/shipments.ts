import crypto from "node:crypto";
import { adminDb, adminStorage } from "./firebaseAdmin";

type OrderRecord = {
  id: string;
  orderNumber: string;
  shipping?: Record<string, unknown>;
};

type ShippingDetails = {
  name: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  email?: string;
};

export interface LabelResult {
  labelId: string;
  storagePath: string;
  signedUrl: string;
  expiresAt: Date;
}

function getSigningSecret(headers: Headers): string {
  const providerHeader = headers.get("x-shipengine-webhook-signature") || headers.get("shipengine-signature");
  if (providerHeader) {
    const secret = process.env.SHIPENGINE_WEBHOOK_SECRET;
    if (!secret) {
      throw new Error("SHIPENGINE_WEBHOOK_SECRET env var missing");
    }
    return secret;
  }
  const secret = process.env.SHIPSTATION_API_SECRET || process.env.SHIPSTATION_API_KEY;
  if (!secret) {
    throw new Error("SHIPSTATION_API_SECRET or SHIPSTATION_API_KEY env var missing");
  }
  return secret;
}

export async function createLabel(order: OrderRecord, shippingDetails: ShippingDetails): Promise<LabelResult> {
  // TODO: Integrate ShipEngine/ShipStation label creation once API keys are provisioned.
  const labelId = crypto.randomUUID();
  const pdfBuffer = Buffer.from(
    `Placeholder label for order ${order.orderNumber} to ${shippingDetails.name}\nThis should be replaced with the carrier-provided PDF.`,
    "utf8"
  );

  const storagePath = `labels/${order.id}/${labelId}.pdf`;
  const bucket = adminStorage.bucket();
  const file = bucket.file(storagePath);
  await file.save(pdfBuffer, {
    contentType: "application/pdf",
    resumable: false,
  });

  const [signedUrl] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + 1000 * 60 * 60, // 1 hour
  });

  await adminDb.collection("orders").doc(order.id).set(
    {
      shipping: {
        ...order.shipping,
        lastLabelGeneratedAt: new Date().toISOString(),
        latestLabelId: labelId,
      },
    },
    { merge: true }
  );

  return {
    labelId,
    storagePath,
    signedUrl,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60),
  };
}

export async function voidLabel(labelId: string): Promise<void> {
  // TODO: Void label with carrier API
  const [files] = await adminStorage.bucket().getFiles({ prefix: `labels/` });
  const target = files.find((file) => file.name.endsWith(`${labelId}.pdf`));
  if (target) {
    await target.delete({ ignoreNotFound: true } as { ignoreNotFound: boolean });
  }
}

export function verifyWebhookSignature(rawBody: string, headers: Headers): void {
  const signatureHeader =
    headers.get("x-shipengine-webhook-signature") || headers.get("shipengine-signature") || headers.get("x-hub-signature");

  if (!signatureHeader) {
    const err = new Error("Missing webhook signature header");
    (err as Error & { status?: number }).status = 400;
    throw err;
  }

  const secret = getSigningSecret(headers);
  const expected = crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");

  const provided = signatureHeader.replace(/^sha256=/, "");
  if (expected.length !== provided.length) {
    const err = new Error("Invalid webhook signature");
    (err as Error & { status?: number }).status = 401;
    throw err;
  }

  const isValid = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
  if (!isValid) {
    const err = new Error("Invalid webhook signature");
    (err as Error & { status?: number }).status = 401;
    throw err;
  }
}
