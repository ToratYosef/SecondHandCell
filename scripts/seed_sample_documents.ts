import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "../apps/web/lib/firebaseAdmin";

async function seedDevices() {
  const deviceRef = adminDb.collection("devices").doc("iphone-14-pro");
  await deviceRef.set(
    {
      title: "iPhone 14 Pro",
      slug: "iphone-14-pro",
      specs: {
        manufacturer: "Apple",
        model: "A2650",
      },
      capacities: ["128GB", "256GB", "512GB"],
      networks: ["Unlocked", "AT&T", "T-Mobile"],
      conditions: ["Flawless", "Good", "Fair"],
      images: [],
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}

async function seedMerchants() {
  const merchantRef = adminDb.collection("merchants").doc("example-buyer");
  await merchantRef.set(
    {
      displayName: "Example Buyer LLC",
      payoutEmail: "ops@examplebuyer.test",
      status: "active",
      createdAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}

async function seedPricing() {
  const snapshotRef = adminDb.collection("pricingSnapshots").doc();
  await snapshotRef.set({
    deviceSlug: "iphone-14-pro",
    offers: [
      {
        merchantId: "example-buyer",
        displayName: "Example Buyer LLC",
        payout: 720,
      },
    ],
    constraints: {
      "example-buyer": {
        capacity: ["128GB", "256GB"],
        condition: ["Flawless", "Good"],
      },
    },
    capturedAt: FieldValue.serverTimestamp(),
  });
}

async function seedOrders() {
  const orderRef = adminDb.collection("orders").doc("seed-order");
  await orderRef.set(
    {
      id: "seed-order",
      orderNumber: "ORD-0000001",
      status: "created",
      priceOffered: 700,
      device: {
        deviceSlug: "iphone-14-pro",
        capacity: "256GB",
        network: "Unlocked",
        condition: "Good",
      },
      shipping: {
        method: "kit",
      },
      payment: {
        provider: "stripe",
        status: "pending",
      },
      logs: [],
      createdAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}

export async function main() {
  await seedDevices();
  await seedMerchants();
  await seedPricing();
  await seedOrders();
  console.log("Seeded sample Firestore documents.");
}

const executedDirectly = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;

if (executedDirectly) {
  main().catch((error) => {
    console.error("Failed to seed sample documents", error);
    process.exit(1);
  });
}
