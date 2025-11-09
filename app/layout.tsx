import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'SecondHandCell Platform',
  description: 'Trade-in and wholesale operations hub powered by Next.js and Firestore.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 10% 20%, rgba(66,134,244,0.18), transparent 55%), radial-gradient(circle at 90% 10%, rgba(0,78,146,0.22), transparent 60%)',
            pointerEvents: 'none',
            zIndex: 0
          }}
          aria-hidden
        />
        <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', zIndex: 1 }}>
          <header
            style={{
              padding: '1.25rem 0',
              borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
              backdropFilter: 'blur(18px)',
              position: 'sticky',
              top: 0,
              background: 'rgba(247, 249, 252, 0.82)',
              zIndex: 10
            }}
          >
            <div
              className="container"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}
            >
              <Link href="/" style={{ fontWeight: 700, fontSize: '1.35rem', letterSpacing: '-0.03em' }}>
                SecondHandCell
              </Link>
              <nav style={{ display: 'flex', gap: '1.5rem', fontWeight: 500, alignItems: 'center' }}>
                <Link href="/sell">Get a quote</Link>
                <Link href="/my-account">My account</Link>
              </nav>
            </div>
          </header>
          <main className="container" style={{ padding: '3.5rem 0', flex: '1 0 auto' }}>
            {children}
          </main>
          <footer
            style={{
              padding: '2.5rem 0',
              borderTop: '1px solid rgba(15, 23, 42, 0.08)',
              marginTop: '4rem',
              background: 'rgba(247,249,252,0.92)'
            }}
          >
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <span style={{ fontWeight: 500 }}>&copy; {new Date().getFullYear()} SecondHandCell Ops</span>
              <div style={{ display: 'flex', gap: '1.25rem', fontWeight: 500 }}>
                <Link href="/docs/runbook">Runbook</Link>
                <Link href="/docs/security">Security</Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
