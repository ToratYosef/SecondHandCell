'use client';

import React from 'react';
import Link from 'next/link';

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">My Account</h3>
              <nav className="space-y-2">
                <Link href="#" className="block px-4 py-2 bg-indigo-600 text-white rounded">Dashboard</Link>
                <Link href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">My Orders</Link>
                <Link href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Profile</Link>
                <Link href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Settings</Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Orders Section */}
            <div className="bg-white rounded-lg shadow p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Trade-Ins</h2>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">iPhone 14 Pro</h3>
                      <p className="text-sm text-gray-600">Quote ID: #Q123456</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">In Progress</span>
                  </div>
                  
                  <div className="grid md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Quote Amount</p>
                      <p className="font-bold text-gray-900">$650</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Status</p>
                      <p className="font-bold text-gray-900">Quote Locked</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Shipping Tracking</p>
                      <p className="font-bold text-gray-900">FDX123456789</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Expires</p>
                      <p className="font-bold text-gray-900">Dec 16, 2024</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-600">Progress</p>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <p className="text-xs text-center font-semibold mb-1">✓</p>
                        <div className="h-2 bg-green-500 rounded"></div>
                        <p className="text-xs text-center mt-1">Quote</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-center font-semibold mb-1">✓</p>
                        <div className="h-2 bg-green-500 rounded"></div>
                        <p className="text-xs text-center mt-1">Shipped</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-center font-semibold mb-1">→</p>
                        <div className="h-2 bg-yellow-500 rounded"></div>
                        <p className="text-xs text-center mt-1">Received</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-center font-semibold mb-1"></p>
                        <div className="h-2 bg-gray-300 rounded"></div>
                        <p className="text-xs text-center mt-1">Paid</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ready to Sell Another Device?</h2>
              <Link
                href="/sell"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition"
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
