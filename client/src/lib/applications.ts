import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { WholesaleApplication } from "@shared/schema";

export type WholesaleApplicationPayload = Omit<
  WholesaleApplication,
  "id" | "createdAt" | "updatedAt" | "status"
> & {
  status?: WholesaleApplication["status"];
};

export async function submitWholesaleApplication(payload: WholesaleApplicationPayload) {
  const docRef = await addDoc(collection(db, "applications"), {
    ...payload,
    status: payload.status ?? "submitted",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}
