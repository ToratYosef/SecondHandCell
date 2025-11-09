import crypto from "node:crypto";
import Stripe from "stripe";
import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { adminDb } from "@web/lib/firebaseAdmin";
import { allocateOrderNumber } from "@web/lib/orderCounter";
import { getAuthContext } from "@web/lib/rbac";

interface OrderRequestBody {
  priceOffered: number;
  deviceSlug: string;
  capacity: string;
  network: string;
  condition: string;
  shipping: {
    method: string;
    address?: Record<string, unknown>;
  };
  payment?: {
    provider: string;
  };
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as OrderRequestBody | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { priceOffered, shipping, payment, deviceSlug, capacity, network, condition } = body;
  if (typeof priceOffered !== "number" || !shipping?.method) {
    return NextResponse.json({ error: "Missing order fields" }, { status: 400 });
  }

  const authContext = await getAuthContext(request);

  const orderId = crypto.randomUUID();
  const orderNumber = await allocateOrderNumber(adminDb);
  const now = FieldValue.serverTimestamp();

  const orderDoc = {
    id: orderId,
    orderNumber,
    createdAt: now,
    updatedAt: now,
    status: "created",
    priceOffered,
    device: { deviceSlug, capacity, network, condition },
    shipping: {
      method: shipping.method,
      address: shipping.address ?? null,
    },
    payment: {
      provider: payment?.provider ?? "manual",
      status: "pending",
    },
    logs: [],
    userId: authContext.uid ?? null,
  };

  await adminDb.collection("orders").doc(orderId).set(orderDoc, { merge: true });

  if (authContext.uid) {
    await adminDb
      .collection("users")
      .doc(authContext.uid)
      .collection("orders")
      .doc(orderId)
      .set(
        {
          orderNumber,
          createdAt: now,
          status: "created",
          priceOffered,
        },
        { merge: true }
      );
  }

  const actor = authContext.uid || authContext.email || "guest";
  await adminDb.collection("adminAuditLogs").add({
    createdAt: now,
    actor,
    action: "order.created",
    orderId,
    orderNumber,
    details: {
      userId: authContext.uid ?? null,
      device: { deviceSlug, capacity, network, condition },
    },
  });

  let clientSecret: string | undefined;
  if (payment?.provider === "stripe" && process.env.STRIPE_SECRET_KEY) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(priceOffered * 100),
      currency: "usd",
      metadata: { orderId, orderNumber },
      description: `SecondHandCell order ${orderNumber}`,
      automatic_payment_methods: { enabled: true },
    });
    clientSecret = intent.client_secret ?? undefined;

    await adminDb.collection("orders").doc(orderId).set(
      {
        payment: {
          provider: "stripe",
          status: intent.status,
          intentId: intent.id,
        },
      },
      { merge: true }
    );
  }

  return NextResponse.json({ orderId, orderNumber, clientSecret });
}
