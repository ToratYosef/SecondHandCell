'use client';

import React from 'react';
import Link from 'next/link';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import FeaturesSection from '@/components/FeaturesSection';

const stats = [
  { label: 'Devices Purchased', value: '120K+' },
  { label: 'Avg. Payout Speed', value: '24H' },
  { label: 'Customer Satisfaction', value: '98%' },
  { label: 'Paid Out to Sellers', value: '$55M+' },
];

const steps = [
  {
    title: 'Get a Locked-In Quote',
    description: 'Tell us about your device and lock in your guaranteed price for 30 days.',
    accent: 'bg-indigo-100 text-indigo-700',
  },
  {
    title: 'Ship Free & Insured',
    description: 'We send you a prepaid kit with full insurance and simple packing instructions.',
    accent: 'bg-green-100 text-green-700',
  },
  {
    title: 'Get Paid Fast',
    description: 'We inspect within hours of arrival and pay out the same day—no hidden fees.',
    accent: 'bg-orange-100 text-orange-700',
  },
];

const testimonials = [
  {
    quote: 'The quote matched the payout and shipping was effortless. Got paid in under a day!',
    name: 'Jasmine R.',
    detail: 'Sold an iPhone 15 Pro Max',
  },
  {
    quote: 'Best experience selling a phone. Transparent updates and great price.',
    name: 'Kevin L.',
    detail: 'Sold a Galaxy S24 Ultra',
  },
];

export default function Home() {
  useScrollAnimation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center animate-on-scroll">
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm font-semibold">
              Instant quotes • Free insured shipping • Same-day payouts
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight">
              Turn Your Phone Into Cash <span className="text-green-400">Without the Hassle</span>
            </h1>
            <p className="text-lg text-slate-200 max-w-xl">
              Lock in a guaranteed offer, ship it for free, and get paid in hours. No auctions, no mystery deductions—just a premium buyback experience.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/sell"
                className="bg-green-500 hover:bg-green-400 text-slate-900 font-semibold px-6 py-3 rounded-xl shadow-lg shadow-green-500/30 transition"
              >
                Get My Instant Quote
              </Link>
              <Link
                href="/how-it-works"
                className="border border-white/20 hover:border-white/50 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                See How It Works
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-slate-200/80">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                30-day price lock
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Secure data wiping
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Same-day payments
              </div>
            </div>
          </div>
          <div className="relative animate-on-scroll">
            <div className="absolute -inset-6 bg-gradient-to-tr from-indigo-500/30 via-purple-500/10 to-green-400/30 blur-3xl rounded-full" />
            <div className="relative bg-white text-slate-900 rounded-3xl p-8 shadow-2xl border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-slate-500">Today&apos;s top device</p>
                  <p className="text-xl font-semibold">iPhone 15 Pro Max</p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">Up to $950</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-500">Quote speed</p>
                  <p className="text-lg font-bold">90 seconds</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-500">Payment time</p>
                  <p className="text-lg font-bold">24 hours</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-500">Price lock</p>
                  <p className="text-lg font-bold">30 days</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-500">Shipping</p>
                  <p className="text-lg font-bold">Free & insured</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Secure payout options</p>
                  <p className="font-semibold">Zelle • PayPal • ACH</p>
                </div>
                <Link href="/sell" className="text-indigo-600 font-semibold hover:text-indigo-700">
                  Start Quote →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 animate-on-scroll">
          {stats.map(stat => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-2xl md:text-3xl font-extrabold text-white">{stat.value}</p>
              <p className="text-sm text-slate-200/80 mt-2">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Steps */}
        <section className="mb-16 animate-on-scroll">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black">Sell in Three Steps</h2>
            <Link href="/how-it-works" className="text-sm text-green-300 hover:text-green-200 font-semibold">
              View details
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-2xl bg-white text-slate-900 p-6 shadow-xl border border-slate-100">
                <div className={`${step.accent} inline-flex w-12 h-12 items-center justify-center rounded-full font-bold mb-4`}>
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mb-16 animate-on-scroll">
          <FeaturesSection />
        </section>

        {/* Testimonials */}
        <section className="mb-16 animate-on-scroll bg-white/5 border border-white/10 rounded-3xl p-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-green-300/80">Loved by sellers</p>
              <h2 className="text-3xl font-black">Real results, no surprises</h2>
            </div>
            <Link href="/sell" className="hidden md:inline-flex bg-white text-slate-900 px-5 py-2 rounded-full font-semibold hover:bg-slate-100">
              Lock My Price
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map(testimonial => (
              <div key={testimonial.name} className="bg-slate-900/60 border border-white/5 rounded-2xl p-6 shadow-inner">
                <p className="text-lg font-semibold text-white mb-4">“{testimonial.quote}”</p>
                <p className="text-sm text-slate-200">
                  {testimonial.name} • <span className="text-green-300">{testimonial.detail}</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-20 md:mb-28 animate-on-scroll">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-green-400 p-10 md:p-16 text-slate-900">
            <div className="absolute inset-0 bg-white/10" aria-hidden />
            <div className="relative max-w-2xl space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Start today</p>
              <h2 className="text-3xl md:text-4xl font-black text-white">Get your best offer in minutes</h2>
              <p className="text-lg text-white/90">
                Join thousands of smart sellers who trust SecondHandCell for secure, premium buybacks.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/sell"
                  className="bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-slate-100"
                >
                  Get My Quote
                </Link>
                <Link
                  href="/account"
                  className="text-white border border-white/50 px-6 py-3 rounded-xl font-semibold hover:bg-white/10"
                >
                  Track My Order
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
