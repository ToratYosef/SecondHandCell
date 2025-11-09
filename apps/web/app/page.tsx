import Link from "next/link";

export default function HomePage() {
  return (
    <section style={{ padding: "3rem", display: "grid", gap: "1.5rem" }}>
      <header>
        <h1>SecondHandCell Operations</h1>
        <p>Welcome to the combined seller and admin experience skeleton.</p>
      </header>
      <div>
        <Link href="/admin/orders" style={{ fontWeight: 600 }}>
          Go to Admin Console
        </Link>
      </div>
      <p style={{ maxWidth: 640 }}>
        This Next.js app shares Firebase resources with the existing Express server so
        teams can iterate incrementally. Replace this message with marketing content
        or seller flow components.
      </p>
    </section>
  );
}
