import React from 'react';
import Link from 'next/link';

const steps = [
  {
    title: 'Tell us about your device',
    description: 'Select your brand, model, storage, and condition. Lock in your quote for 30 days.',
    accent: 'bg-indigo-100 text-indigo-700',
    badge: 'Step 1',
  },
  {
    title: 'Ship with full protection',
    description: 'We send a prepaid kit with insurance and packing tips. Drop it off at any carrier location.',
    accent: 'bg-green-100 text-green-700',
    badge: 'Step 2',
  },
  {
    title: 'Get paid the same day',
    description: 'We inspect within hours of arrival and send your payout via Zelle, PayPal, or ACH—no surprises.',
    accent: 'bg-orange-100 text-orange-700',
    badge: 'Step 3',
  },
];

const faqs = [
  {
    q: 'Is shipping really free?',
    a: 'Yes. Every quote includes a prepaid label and insurance so you never pay out of pocket.',
  },
  {
    q: 'What if the condition is different?',
    a: 'We send a revised offer and you choose to accept or have the device returned at no cost.',
  },
  {
    q: 'How do you handle my data?',
    a: 'Devices are wiped to NIST standards and verified before refurbishing or recycling.',
  },
  {
    q: 'How fast do I get paid?',
    a: 'Most payouts are completed the same day your device arrives at our facility.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl text-center space-y-4">
          <p className="uppercase tracking-[0.2em] text-white/70 text-sm">How it works</p>
          <h1 className="text-4xl md:text-5xl font-black">A premium template for a smoother sale</h1>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            We refreshed every step using the BuyBacking-inspired template—so you always know what happens next.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/sell" className="bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-slate-100">
              Start a Quote
            </Link>
            <Link href="/account" className="border border-white/40 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10">
              Track Your Order
            </Link>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black">Three steps, crystal clear</h2>
            <p className="text-sm text-slate-500">Free shipping • 30-day lock • Same-day pay</p>
          </div>
          <div className="space-y-6">
            {steps.map(step => (
              <div key={step.title} className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 flex flex-col md:flex-row md:items-center gap-6">
                <div className={`${step.accent} px-4 py-2 rounded-full text-sm font-semibold w-max`}>{step.badge}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                  <p className="text-lg text-slate-600">{step.description}</p>
                </div>
                <div className="hidden md:block w-px h-16 bg-slate-200" aria-hidden />
                <div className="text-sm text-slate-500 space-y-2">
                  <p>Includes free insurance</p>
                  <p>Live status updates</p>
                  <p>Transparent pricing</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extras */}
      <section className="bg-white border-y border-slate-100 py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl grid md:grid-cols-3 gap-8">
          {[{ title: 'Status you can see', desc: 'Email + account updates at every checkpoint.' }, { title: 'Protection built in', desc: 'Prepaid labels, tracking, and insurance included.' }, { title: 'Friendly support', desc: 'Real humans to answer payout or shipping questions.' }].map(item => (
            <div key={item.title} className="rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.2em] text-indigo-500">FAQs</p>
            <h2 className="text-3xl font-black">Everything you might ask</h2>
          </div>
          <div className="space-y-4">
            {faqs.map(faq => (
              <div key={faq.q} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <p className="text-lg font-semibold mb-2">{faq.q}</p>
                <p className="text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-indigo-600 to-green-500 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-black">Ready to lock your price?</h2>
          <p className="text-lg text-white/80">Start with an instant quote, ship for free, and get paid within a day.</p>
          <div className="flex justify-center gap-4">
            <Link href="/sell" className="bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-slate-100">
              Get My Quote
            </Link>
            <Link href="/about" className="border border-white/40 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10">
              Learn About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
