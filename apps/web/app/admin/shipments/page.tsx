export default function AdminShipmentsPage() {
  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <header>
        <h1>Shipments</h1>
        <p style={{ color: "#666" }}>
          Track outbound device kits and inbound returns. Hook this view into the shipment API endpoints to surface
          statuses in real time.
        </p>
      </header>
      <section style={{ border: "1px dashed #d1d5db", padding: "2rem", borderRadius: "0.75rem", background: "#f9fafb" }}>
        <p style={{ margin: 0 }}>
          TODO: Display active shipments and integrate carrier-specific tracking information.
        </p>
      </section>
    </div>
  );
}
