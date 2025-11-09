import Link from "next/link";
import { notFound } from "next/navigation";
import { adminDb } from "@web/lib/firebaseAdmin";

interface Params {
  params: { id: string };
}

async function fetchOrder(orderId: string) {
  const [orderSnap, auditSnap] = await Promise.all([
    adminDb.collection("orders").doc(orderId).get(),
    adminDb
      .collection("adminAuditLogs")
      .where("orderId", "==", orderId)
      .orderBy("createdAt", "desc")
      .limit(25)
      .get(),
  ]);

  if (!orderSnap.exists) {
    return null;
  }

  return {
    id: orderSnap.id,
    data: orderSnap.data() as Record<string, unknown>,
    logs: auditSnap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Record<string, unknown>) })),
  };
}

export default async function AdminOrderDetail({ params }: Params) {
  const order = await fetchOrder(params.id);
  if (!order) {
    notFound();
  }

  const shipping = order.data.shipping as Record<string, unknown> | undefined;
  const latestLabelId = shipping?.latestLabelId as string | undefined;
  const labelUrl = shipping?.latestLabelUrl as string | undefined;

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Link href="/admin/orders" style={{ color: "#3b82f6" }}>
            ← Back to orders
          </Link>
          <h1 style={{ marginBottom: 0 }}>Order {order.data.orderNumber ?? order.id}</h1>
          <p style={{ color: "#666" }}>Status: {order.data.status as string}</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button type="button" title="Trigger label regeneration">
            Rebuild Label
          </button>
          <button type="button" title="Void shipping label">
            Void Label
          </button>
        </div>
      </header>

      <section style={{ display: "grid", gap: "0.75rem" }}>
        <h2>Device & Pricing</h2>
        <pre style={{ background: "#f7f7f7", padding: "1rem", borderRadius: "0.5rem" }}>
          {JSON.stringify(order.data.device, null, 2)}
        </pre>
        <div style={{ display: "flex", gap: "2rem" }}>
          <div>
            <h3>Offered Price</h3>
            <p style={{ fontSize: "1.5rem" }}>${Number(order.data.priceOffered ?? 0).toFixed(2)}</p>
          </div>
          <div>
            <h3>Payment</h3>
            <p>Provider: {(order.data.payment as Record<string, unknown>)?.provider as string}</p>
            <p>Status: {(order.data.payment as Record<string, unknown>)?.status as string}</p>
          </div>
        </div>
      </section>

      <section style={{ display: "grid", gap: "0.75rem" }}>
        <h2>Shipping</h2>
        {latestLabelId && labelUrl ? (
          <div>
            <p>
              Latest label <strong>{latestLabelId}</strong>
            </p>
            <a href={labelUrl} target="_blank" rel="noreferrer">
              Download Label PDF
            </a>
          </div>
        ) : (
          <p>No label generated yet.</p>
        )}
      </section>

      <section style={{ display: "grid", gap: "0.75rem" }}>
        <h2>Audit trail</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.5rem" }}>
          {order.logs.map((log) => (
            <li
              key={log.id}
              style={{
                border: "1px solid #eee",
                borderRadius: "0.5rem",
                padding: "0.75rem 1rem",
                background: "#fafafa",
              }}
            >
              <strong>{log.action as string}</strong>
              <div style={{ fontSize: "0.85rem", color: "#666" }}>
                Actor: {(log.actor as string) ?? "unknown"}
              </div>
              <pre style={{ marginTop: "0.5rem", fontSize: "0.8rem" }}>{JSON.stringify(log.details, null, 2)}</pre>
            </li>
          ))}
          {order.logs.length === 0 && <li>No audit entries yet.</li>}
        </ul>
      </section>
    </div>
  );
}
