import crypto from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { adminDb } from "@web/lib/firebaseAdmin";
import { verifyWebhookSignature } from "@web/lib/shipments";

export async function POST(request: Request) {
  const rawBody = await request.text();

  try {
    verifyWebhookSignature(rawBody, request.headers);
  } catch (error) {
    const status = (error as Error & { status?: number }).status ?? 400;
    return NextResponse.json({ error: (error as Error).message }, { status });
  }

  const payload = JSON.parse(rawBody);
  const eventId = payload?.event_id || payload?.eventId || payload?.id || crypto.randomUUID();

  const existing = await adminDb.collection("webhookEvents").doc(eventId).get();
  if (existing.exists) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  const orderId: string | undefined = payload?.resource?.order_id || payload?.data?.orderId;
  const shippingStatus: string | undefined = payload?.data?.status || payload?.event;

  if (orderId && shippingStatus) {
    await adminDb.collection("orders").doc(orderId).set(
      {
        shipping: {
          status: shippingStatus,
          events: FieldValue.arrayUnion({
            at: new Date().toISOString(),
            status: shippingStatus,
            payload,
          }),
        },
      },
      { merge: true }
    );

    await adminDb.collection("adminAuditLogs").add({
      createdAt: FieldValue.serverTimestamp(),
      actor: "shipengine",
      action: "shipping.update",
      orderId,
      details: { status: shippingStatus },
    });
  }

  await adminDb.collection("webhookEvents").doc(eventId).set({
    receivedAt: FieldValue.serverTimestamp(),
    type: payload?.event || "shipengine",
  });

  return NextResponse.json({ received: true });
}
