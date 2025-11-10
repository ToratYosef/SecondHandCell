import Link from "next/link";
import { adminDb } from "@web/lib/firebaseAdmin";

type AdminLog = { id?: string; action?: string; actor?: string; details?: unknown; timestamp?: string };
type OrderType = {
  id?: string;
  orderNumber?: string | number;
  device?: Record<string, unknown>;
  status?: string;
  priceOffered?: number;
  data?: Record<string, unknown>;
  logs?: AdminLog[];
};

async function fetchOrders() {
  const snapshot = await adminDb
    .collection("orders")
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() as Record<string, unknown> }));
}

export default async function AdminOrdersPage() {
  const ordersRaw = await fetchOrders();
  const rows = (ordersRaw as any[]).map((order) =>
    order?.data
      ? ({ id: order.id, ...(order.data as Record<string, unknown>), data: order.data } as OrderType)
      : ((order ?? {}) as OrderType)
  );

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <header>
        <h1>Orders</h1>
        <p style={{ color: "#666" }}>
          Monitor and manage incoming devices. Use the quick actions to create labels or mark inspection status.
        </p>
      </header>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "0.75rem", borderBottom: "1px solid #ddd" }}>Order</th>
              <th style={{ textAlign: "left", padding: "0.75rem", borderBottom: "1px solid #ddd" }}>Status</th>
              <th style={{ textAlign: "left", padding: "0.75rem", borderBottom: "1px solid #ddd" }}>Price</th>
              <th style={{ textAlign: "left", padding: "0.75rem", borderBottom: "1px solid #ddd" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((order) => (
              <tr key={order?.id ?? String(order?.orderNumber)} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "0.75rem" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Link href={`/admin/orders/${order?.id}`} style={{ fontWeight: 600 }}>
                      {String(order?.data?.orderNumber ?? order?.orderNumber ?? order?.id)}
                    </Link>
                    <small style={{ color: "#666" }}>
                      {((order?.device ?? order?.data?.device) as Record<string, unknown>)?.deviceSlug as string}
                    </small>
                  </div>
                </td>
                <td style={{ padding: "0.75rem" }}>{(order?.status ?? order?.data?.status ?? "created") as string}</td>
                <td style={{ padding: "0.75rem" }}>${Number(order?.priceOffered ?? order?.data?.priceOffered ?? 0).toFixed(2)}</td>
                <td style={{ padding: "0.75rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button type="button" data-order={order?.id} title="Generate label (calls /api/shipments/create-label)">
                      Create Label
                    </button>
                    <button type="button" data-order={order?.id} title="Mark device inspected">
                      Mark Inspected
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: "2rem", textAlign: "center", color: "#777" }}>
                  No orders yet. Seed sample data or complete a checkout flow.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: "0.85rem", color: "#999" }}>
        TODO: Replace buttons with real client components that call the shipment and auditing APIs.
      </p>
    </div>
  );
}
