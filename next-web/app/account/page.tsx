'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <>
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 py-16 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-extrabold mb-2">My Account</h1>
          <p className="text-xl text-indigo-100">Track your trade-ins, manage your quotes, and more</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Navigation</h3>
                <nav className="space-y-2">
                  {[
                    { id: 'dashboard', label: 'Dashboard', icon: 'fa-home' },
                    { id: 'orders', label: 'My Orders', icon: 'fa-box' },
                    { id: 'profile', label: 'Profile', icon: 'fa-user' },
                    { id: 'settings', label: 'Settings', icon: 'fa-gear' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-2 font-semibold ${
                        activeTab === item.id
                          ? 'bg-green-500 text-white shadow-md'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <i className={`fa-solid ${item.icon}`}></i>
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="md:col-span-3">
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  {/* Statistics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { label: 'Devices Sold', value: '3', icon: 'fa-mobile', color: 'blue' },
                      { label: 'Total Earned', value: '$1,850', icon: 'fa-dollar-sign', color: 'green' },
                      { label: 'Pending Payouts', value: '$0', icon: 'fa-hourglass-end', color: 'orange' }
                    ].map((stat, idx) => (
                      <div key={idx} className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 p-6 rounded-lg shadow-md border-l-4 border-${stat.color}-500`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">{stat.label}</p>
                            <p className="text-3xl font-extrabold text-slate-900 mt-2">{stat.value}</p>
                          </div>
                          <div className={`text-${stat.color}-600 text-2xl`}>
                            <i className={`fa-solid ${stat.icon}`}></i>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Active Orders */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-6">
                      <h2 className="text-2xl font-bold text-white">Active Trade-Ins</h2>
                      <p className="text-slate-300 text-sm mt-1">Current status of your submitted devices</p>
                    </div>

                    <div className="p-8">
                      <div className="space-y-6">
                        {/* Order Item 1 */}
                        <div className="border border-slate-200 rounded-lg p-6 hover:shadow-lg transition">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-slate-900">iPhone 14 Pro</h3>
                              <p className="text-sm text-slate-600 mt-1">Quote ID: <span className="font-mono font-semibold">#Q123456</span></p>
                            </div>
                            <div className="text-right">
                              <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-bold">In Transit</div>
                              <p className="text-xs text-slate-600 mt-2">Expires: Dec 16, 2024</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 py-4 border-y border-slate-200">
                            <div>
                              <p className="text-xs uppercase tracking-wide text-slate-600 font-semibold">Quote Amount</p>
                              <p className="text-lg font-bold text-green-600 mt-1">$650</p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wide text-slate-600 font-semibold">Condition</p>
                              <p className="text-lg font-bold text-slate-900 mt-1">Good</p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wide text-slate-600 font-semibold">Tracking</p>
                              <p className="text-sm font-mono font-bold text-slate-900 mt-1">FDX123456789</p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wide text-slate-600 font-semibold">Submitted</p>
                              <p className="text-lg font-bold text-slate-900 mt-1">Nov 16</p>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-3">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Progress</p>
                            <div className="flex gap-3">
                              {[
                                { label: 'Quote', status: 'complete' },
                                { label: 'Shipped', status: 'complete' },
                                { label: 'Received', status: 'in-progress' },
                                { label: 'Paid', status: 'pending' }
                              ].map((step, idx) => (
                                <div key={idx} className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                      step.status === 'complete' ? 'bg-green-500' :
                                      step.status === 'in-progress' ? 'bg-blue-500' :
                                      'bg-gray-300'
                                    }`}>
                                      {step.status === 'complete' ? '✓' : (step.status === 'in-progress' ? '→' : '')}
                                    </div>
                                  </div>
                                  <p className="text-xs font-semibold text-slate-700">{step.label}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Order Item 2 */}
                        <div className="border border-green-200 bg-green-50 rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-slate-900">Samsung Galaxy S23</h3>
                              <p className="text-sm text-slate-600 mt-1">Quote ID: <span className="font-mono font-semibold">#Q123455</span></p>
                            </div>
                            <div className="text-right">
                              <div className="bg-green-200 text-green-800 px-4 py-2 rounded-full text-sm font-bold">Paid</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 py-4 border-y border-green-200">
                            <div>
                              <p className="text-xs uppercase tracking-wide text-slate-600 font-semibold">Quote Amount</p>
                              <p className="text-lg font-bold text-green-600 mt-1">$480</p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wide text-slate-600 font-semibold">Payment Method</p>
                              <p className="text-sm font-bold text-slate-900 mt-1">Venmo</p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wide text-slate-600 font-semibold">Paid Date</p>
                              <p className="text-sm font-bold text-slate-900 mt-1">Nov 8</p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wide text-slate-600 font-semibold">Transaction</p>
                              <p className="text-xs font-mono font-bold text-slate-600 mt-1">TXN#789012</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-200 mt-8 pt-8 flex flex-col sm:flex-row gap-4">
                        <Link
                          href="/sell"
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg text-center"
                        >
                          <i className="fa-solid fa-plus mr-2"></i> Sell Another Device
                        </Link>
                        <button className="flex-1 border-2 border-slate-300 text-slate-700 font-bold py-3 px-6 rounded-lg hover:bg-slate-50 transition-all">
                          <i className="fa-solid fa-download mr-2"></i> Download Invoice
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Other Tabs - Placeholder */}
              {(activeTab === 'orders' || activeTab === 'profile' || activeTab === 'settings') && (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <i className="fa-solid fa-cog text-4xl text-slate-400 mb-4"></i>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Coming Soon</h3>
                  <p className="text-slate-600">This section is being updated. Check back soon!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold mb-4">Have Questions?</h2>
          <p className="text-lg text-indigo-100 mb-8">Our support team is here to help</p>
          <button className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-xl">
            <i className="fa-solid fa-envelope mr-2"></i> Contact Support
          </button>
        </div>
      </section>
    </>
  );
}
