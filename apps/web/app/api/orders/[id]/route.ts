import { NextResponse } from "next/server";
import { adminDb } from "@web/lib/firebaseAdmin";
import { assertRole, getAuthContext } from "@web/lib/rbac";

interface Params {
  params: { id: string };
}

export async function GET(request: Request, { params }: Params) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "Missing order id" }, { status: 400 });
  }

  const authContext = await getAuthContext(request);
  if (!authContext.token) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const orderSnap = await adminDb.collection("orders").doc(id).get();
  if (!orderSnap.exists) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const orderData = orderSnap.data();
  const isOwner = authContext.uid && orderData?.userId === authContext.uid;
  const isAdmin = authContext.roles.includes("admin");

  if (!isOwner && !isAdmin) {
    await assertRole(request, "admin");
  }

  return NextResponse.json(orderData);
}
