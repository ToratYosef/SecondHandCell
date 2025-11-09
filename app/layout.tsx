import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'SecondHandCell Platform',
  description: 'Trade-in and wholesale operations hub powered by Next.js and Firestore.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{ padding: '1.5rem 0', borderBottom: '1px solid rgba(15, 23, 42, 0.08)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, background: 'rgba(247, 249, 252, 0.85)', zIndex: 10 }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <a href="/" style={{ fontWeight: 700, fontSize: '1.25rem' }}>SecondHandCell</a>
            <nav style={{ display: 'flex', gap: '1rem', fontWeight: 500 }}>
              <a href="/sell">Get a quote</a>
              <a href="/my-account">My account</a>
            </nav>
          </div>
        </header>
        <main className="container" style={{ padding: '3rem 0' }}>{children}</main>
        <footer style={{ padding: '2rem 0', borderTop: '1px solid rgba(15, 23, 42, 0.1)', marginTop: '4rem' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <span>&copy; {new Date().getFullYear()} SecondHandCell Ops</span>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="/docs/runbook">Runbook</a>
              <a href="/docs/security">Security</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
