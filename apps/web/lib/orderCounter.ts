import type { Firestore } from "firebase-admin/firestore";
import { adminDb } from "./firebaseAdmin";

const COUNTER_PATH = "counters/orders";

function formatOrderNumber(value: number): string {
  return `ORD-${value.toString().padStart(7, "0")}`;
}

export async function allocateOrderNumber(db: Firestore = adminDb): Promise<string> {
  const counterRef = db.doc(COUNTER_PATH);
  let orderNumber = "";

  await db.runTransaction(async (tx) => {
    const snapshot = await tx.get(counterRef);
    const currentValue = snapshot.exists ? (snapshot.data()?.value as number) ?? 0 : 0;
    const nextValue = currentValue + 1;
    tx.set(counterRef, { value: nextValue }, { merge: true });
    orderNumber = formatOrderNumber(nextValue);
  });

  if (!orderNumber) {
    throw new Error("Failed to allocate order number");
  }

  return orderNumber;
}
