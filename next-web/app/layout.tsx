import type { ReactNode } from 'react';
import { Inter, Dancing_Script } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import ChatWidget from '@/components/ChatWidget';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const dancingScript = Dancing_Script({ subsets: ['latin'], variable: '--font-dancing-script' });

export const metadata = {
  title: 'SecondHandCell - Sell Your Used Phone for Cash',
  description: 'Get instant quotes for your used phone and get paid within 24 hours. Fast, secure, and fair pricing.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${dancingScript.variable}`}>
      <body>
        <AuthProvider>
          <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>

          {/* Global Modals and Widgets */}
          <AuthModal />
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}