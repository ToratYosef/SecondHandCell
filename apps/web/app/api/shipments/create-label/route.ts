import { NextResponse } from "next/server";
import { adminDb } from "@web/lib/firebaseAdmin";
import { createLabel } from "@web/lib/shipments";
import { assertRole } from "@web/lib/rbac";

interface CreateLabelRequest {
  orderId: string;
  shipmentOptions: Record<string, unknown>;
}

export async function POST(request: Request) {
  try {
    await assertRole(request, "admin");
  } catch (error) {
    const status = (error as Error & { status?: number }).status ?? 403;
    return NextResponse.json({ error: (error as Error).message }, { status });
  }

  const body = (await request.json().catch(() => null)) as CreateLabelRequest | null;
  if (!body?.orderId) {
    return NextResponse.json({ error: "orderId is required" }, { status: 400 });
  }

  const orderSnap = await adminDb.collection("orders").doc(body.orderId).get();
  if (!orderSnap.exists) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const orderData = orderSnap.data() as { id: string; orderNumber: string; shipping?: Record<string, unknown> };
  orderData.id = body.orderId;

  const shippingInfo = {
    ...((orderData.shipping as Record<string, unknown>)?.address ?? {}),
    ...(body.shipmentOptions ?? {}),
  } as Record<string, unknown>;

  const label = await createLabel(orderData, {
    name: (shippingInfo.name as string) ?? "Recipient",
    address1: (shippingInfo.address1 as string) ?? (shippingInfo.line1 as string) ?? "TBD",
    city: (shippingInfo.city as string) ?? "City",
    state: (shippingInfo.state as string) ?? "State",
    postalCode: (shippingInfo.postalCode as string) ?? "00000",
    country: (shippingInfo.country as string) ?? "US",
    email: shippingInfo.email as string | undefined,
  });

  await adminDb.collection("orders").doc(body.orderId).set(
    {
      shipping: {
        ...(orderData.shipping ?? {}),
        latestLabelId: label.labelId,
        latestLabelUrl: label.signedUrl,
        labels: {
          [label.labelId]: {
            url: label.signedUrl,
            storagePath: label.storagePath,
            expiresAt: label.expiresAt.toISOString(),
          },
        },
      },
    },
    { merge: true }
  );

  return NextResponse.json(label);
}
