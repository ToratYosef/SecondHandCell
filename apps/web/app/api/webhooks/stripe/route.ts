import Stripe from "stripe";
import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { adminDb } from "@web/lib/firebaseAdmin";

export async function POST(request: Request) {
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe configuration missing" }, { status: 500 });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    // Cast apiVersion to satisfy @types/stripe's stricter definition.
    apiVersion: ("2023-10-16" as unknown) as any,
  });
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const rawBody = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error("Stripe webhook signature verification failed", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const existing = await adminDb.collection("webhookEvents").doc(event.id).get();
  if (existing.exists) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const intent = event.data.object as Stripe.PaymentIntent;
      const orderId = intent.metadata?.orderId;
      if (orderId) {
        await adminDb.collection("orders").doc(orderId).set(
          {
            payment: {
              provider: "stripe",
              status: "paid",
              intentId: intent.id,
              receiptEmail: intent.receipt_email ?? null,
            },
            logs: FieldValue.arrayUnion({
              at: new Date().toISOString(),
              level: "info",
              message: "Stripe payment succeeded",
            }),
          },
          { merge: true }
        );

        await adminDb.collection("adminAuditLogs").add({
          createdAt: FieldValue.serverTimestamp(),
          actor: "stripe",
          action: "payment.succeeded",
          orderId,
          details: {
            paymentIntentId: intent.id,
            amountReceived: intent.amount_received,
          },
        });
      }
      break;
    }
    default:
      break;
  }

  await adminDb.collection("webhookEvents").doc(event.id).set({
    receivedAt: FieldValue.serverTimestamp(),
    type: event.type,
  });

  return NextResponse.json({ received: true });
}
