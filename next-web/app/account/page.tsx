'use client';

import React from 'react';
import Link from 'next/link';

const orders = [
  {
    device: 'iPhone 14 Pro',
    quoteId: '#Q123456',
    amount: '$650',
    status: 'In Progress',
    timeline: ['Quote', 'Shipped', 'Received', 'Paid'],
    activeIndex: 2,
    tracking: 'FDX123456789',
    expires: 'Dec 16, 2024',
  },
];

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-green-300/80">Account</p>
            <h1 className="text-3xl md:text-4xl font-black">Your SecondHandCell hub</h1>
            <p className="text-slate-200">Track orders, download labels, and start new quotes—all in one refreshed template.</p>
          </div>
          <Link href="/sell" className="hidden md:inline-block bg-white text-slate-900 px-5 py-3 rounded-xl font-semibold shadow-lg hover:bg-slate-100">
            Start a new quote
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-2">
              <h3 className="text-lg font-bold text-white mb-4">My Account</h3>
              <nav className="space-y-2">
                <Link href="#" className="block px-4 py-2 bg-white text-slate-900 rounded-lg font-semibold">Dashboard</Link>
                <Link href="#" className="block px-4 py-2 text-slate-200 hover:bg-white/10 rounded-lg">My Orders</Link>
                <Link href="#" className="block px-4 py-2 text-slate-200 hover:bg-white/10 rounded-lg">Profile</Link>
                <Link href="#" className="block px-4 py-2 text-slate-200 hover:bg-white/10 rounded-lg">Settings</Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            <div className="bg-white text-slate-900 rounded-3xl shadow-2xl border border-white/10 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-slate-900">Your trade-ins</h2>
                <span className="text-sm text-slate-500">Free shipping • Same-day pay</span>
              </div>

              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.quoteId} className="border border-slate-200 rounded-2xl p-6 bg-slate-50">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-bold text-slate-900">{order.device}</h3>
                        <p className="text-sm text-slate-600">Quote ID: {order.quoteId}</p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold w-max">{order.status}</span>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Quote Amount</p>
                        <p className="font-bold text-slate-900">{order.amount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Status</p>
                        <p className="font-bold text-slate-900">Quote Locked</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Shipping Tracking</p>
                        <p className="font-bold text-slate-900">{order.tracking}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Expires</p>
                        <p className="font-bold text-slate-900">{order.expires}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-600">Progress</p>
                      <div className="flex gap-2">
                        {order.timeline.map((label, idx) => (
                          <div key={label} className="flex-1">
                            <p className="text-xs text-center font-semibold mb-1">{idx < order.activeIndex ? '✓' : idx === order.activeIndex ? '→' : ''}</p>
                            <div className={`h-2 rounded ${idx < order.activeIndex ? 'bg-green-500' : idx === order.activeIndex ? 'bg-yellow-500' : 'bg-slate-200'}`} />
                            <p className="text-xs text-center mt-1 text-slate-700">{label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white text-slate-900 rounded-3xl shadow-2xl border border-white/10 p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black">Ready to sell another device?</h2>
                <p className="text-slate-600">Reuse this template to get your next quote in under two minutes.</p>
              </div>
              <Link
                href="/sell"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition"
              >
                Get Another Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
