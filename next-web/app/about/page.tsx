import React from 'react';
import Link from 'next/link';

const pillars = [
  {
    title: 'Customer-First',
    description: 'Transparent quotes, proactive updates, and a support team that answers fast.',
    icon: '💬',
  },
  {
    title: 'Secure & Responsible',
    description: 'Every device is wiped to NIST standards and refurbished or recycled sustainably.',
    icon: '🛡️',
  },
  {
    title: 'Premium Payouts',
    description: 'We shop market rates daily so you get a premium offer without haggling.',
    icon: '💸',
  },
];

const milestones = [
  { year: '2018', title: 'Founded SecondHandCell', detail: 'Started with a mission to make buybacks fair and simple.' },
  { year: '2020', title: '50K+ Devices', detail: 'Scaled nationwide with free insured shipping kits and faster payouts.' },
  { year: '2023', title: 'Sustainability First', detail: 'Expanded device lifecycle program and added eco-certified recycling partners.' },
  { year: '2024', title: 'Premium Template Refresh', detail: 'Introduced a unified experience inspired by the BuyBacking design language.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl text-center space-y-6">
          <p className="uppercase tracking-[0.2em] text-white/70 text-sm">About SecondHandCell</p>
          <h1 className="text-4xl md:text-5xl font-black leading-tight">Premium buybacks with heart, security, and speed.</h1>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            We built SecondHandCell to make selling devices feel effortless. From transparent quotes to insured shipping and
            lightning-fast payments, our team is obsessed with giving you total peace of mind.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/sell" className="bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-slate-100">
              Start a Quote
            </Link>
            <Link href="/how-it-works" className="border border-white/40 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10">
              See the Process
            </Link>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black">What we stand for</h2>
            <p className="text-sm text-slate-500">Guiding principles for every trade-in</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map(pillar => (
              <div key={pillar.title} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                <div className="text-4xl mb-4">{pillar.icon}</div>
                <h3 className="text-xl font-bold mb-2">{pillar.title}</h3>
                <p className="text-slate-600">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats + Story */}
      <section className="bg-white py-16 md:py-20 border-y border-slate-100">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10 max-w-5xl">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.2em] text-indigo-500">Our story</p>
            <h2 className="text-3xl font-black">Built by refurbishment experts</h2>
            <p className="text-lg text-slate-600">
              Our founders come from the wireless, logistics, and sustainability worlds. That means you get industry-leading pricing,
              meticulous device handling, and real humans ready to help. We constantly monitor market demand to keep offers fair and fast.
            </p>
            <p className="text-lg text-slate-600">
              SecondHandCell has paid out millions to sellers nationwide and diverted thousands of devices from landfills—extending their
              lifecycle through refurbishment and responsible recycling.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[{ label: 'Devices Purchased', value: '120K+' }, { label: 'Average Payout Time', value: '24H' }, { label: 'Reused or Recycled', value: '99%' }, { label: 'Support Satisfaction', value: '4.9/5' }].map(item => (
              <div key={item.label} className="rounded-2xl bg-slate-50 border border-slate-100 p-6 text-center">
                <p className="text-2xl font-extrabold text-indigo-600">{item.value}</p>
                <p className="text-sm text-slate-600 mt-2">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
        <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-10">
          <h2 className="text-3xl font-black mb-8">Milestones</h2>
          <div className="space-y-6">
            {milestones.map(milestone => (
              <div key={milestone.year} className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-28 text-lg font-extrabold text-indigo-600">{milestone.year}</div>
                <div className="flex-1 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <p className="text-xl font-bold mb-1">{milestone.title}</p>
                  <p className="text-slate-600">{milestone.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-indigo-600 to-green-500 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-black">Ready to meet the team that buys better?</h2>
          <p className="text-lg text-white/80">Lock in your quote now and experience the refreshed SecondHandCell template.</p>
          <div className="flex justify-center gap-4">
            <Link href="/sell" className="bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-slate-100">
              Get My Quote
            </Link>
            <Link href="/account" className="border border-white/40 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10">
              Track My Order
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
