const envKeys = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "FIREBASE_PROJECT_ID",
  "STRIPE_SECRET_KEY",
  "SHIPENGINE_API_KEY",
  "SHIPSTATION_API_KEY",
  "ADMIN_ALLOWED_EMAILS",
];

export default function AdminSettingsPage() {
  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <header>
        <h1>Settings</h1>
        <p style={{ color: "#666" }}>
          Centralise operational toggles, RBAC configuration, and integration keys. Mirror these settings to Firebase
          Remote Config or Firestore for runtime edits if desired.
        </p>
      </header>
      <section>
        <h2>Environment snapshot</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.5rem" }}>
          {envKeys.map((key) => (
            <li
              key={key}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
                padding: "0.75rem 1rem",
                background: "#f9fafb",
              }}
            >
              <strong>{key}</strong>
              <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                {process.env[key] ? "Configured" : "Not configured"}
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section style={{ border: "1px dashed #d1d5db", padding: "2rem", borderRadius: "0.75rem", background: "#f9fafb" }}>
        <p style={{ margin: 0 }}>
          TODO: Build forms for editing payout thresholds, notification templates, and admin user access.
        </p>
      </section>
    </div>
  );
}
