import Link from "next/link";
import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@web/lib/firebaseAdmin";
import { isAdminEmail } from "@web/lib/rbac";

type AdminSession = { email: string; uid: string };

async function ensureAdmin(): Promise<AdminSession> {
  const cookieStore = cookies();
  const token = cookieStore.get("idToken")?.value || cookieStore.get("__session")?.value;
  if (!token) {
    redirect("/");
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token, true);
    if (!decoded.admin && !isAdminEmail(decoded.email)) {
      redirect("/");
    }
    return { email: decoded.email ?? "admin", uid: decoded.uid };
  } catch (error) {
    console.error("Failed to verify admin token", error);
    redirect("/");
    throw error;
  }
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await ensureAdmin();
  return (
    <section style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "100vh" }}>
      <aside
        style={{
          borderRight: "1px solid #ddd",
          padding: "2rem 1.5rem",
          background: "#fafafa",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Admin Console</h2>
        <p style={{ fontSize: "0.85rem", color: "#555" }}>Signed in as {admin.email}</p>
        <nav style={{ display: "grid", gap: "0.75rem", marginTop: "2rem" }}>
          <Link href="/admin/orders">Orders</Link>
          <Link href="/admin/shipments">Shipments</Link>
          <Link href="/admin/settings">Settings</Link>
        </nav>
      </aside>
      <div style={{ padding: "2.5rem", background: "#fff" }}>{children}</div>
    </section>
  );
}
