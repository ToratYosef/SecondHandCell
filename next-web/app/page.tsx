'use client';

import React from 'react';
import Link from 'next/link';
import useScrollAnimation from '@/hooks/useScrollAnimation';

export default function Home() {
  useScrollAnimation();

  return (
    <>
      {/* Hero Section - Enhanced from BuyBacking */}
      <section className="hero-section relative py-20 md:py-32 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Badge */}
          <div className="bg-indigo-600/20 text-indigo-200 border border-indigo-500/50 mx-auto mb-6 px-4 py-2 rounded-full text-sm md:text-base tracking-widest inline-flex items-center gap-2 w-fit">
            <i className="fa-solid fa-bolt text-lg"></i>
            <span>Best Price Guarantee</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-center mb-6 leading-tight">
            <span className="block">Turn Yesterday's Phone Into</span>
            <span className="text-green-400">Maximum Cash Fast!</span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg md:text-xl text-orange-100/90 mb-8 text-center">
            Get a lightning-fast quote for your iPhone, Samsung, and more. Enjoy easy shipping options, speedy inspections, and payouts that hit your account quickly.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center mb-12">
            <Link
              href="/sell"
              className="bg-green-500 hover:bg-green-600 text-white px-10 py-5 rounded-full font-bold text-lg shadow-lg transition-all transform hover:scale-105 hover:shadow-xl inline-block action-button"
            >
              Get My Instant Quote
            </Link>
          </div>

          {/* Trust Metrics */}
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-12 mt-12 text-center text-white">
            <div>
              <p className="text-4xl font-extrabold">100K+</p>
              <p className="text-sm uppercase tracking-wide">Devices Bought</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold">98%</p>
              <p className="text-sm uppercase tracking-wide">Customer Satisfaction</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold">$400+</p>
              <p className="text-sm uppercase tracking-wide">Avg. Payout</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold">24H</p>
              <p className="text-sm uppercase tracking-wide">Fast Payment</p>
            </div>
          </div>

          <p className="mt-8 text-sm md:text-base uppercase tracking-widest text-orange-100/80 text-center">Shipping kit available with every trade-in.</p>
        </div>
      </section>

      {/* Why Sell With Us - Features */}
      <section id="features" className="bg-slate-50 container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Why Sell With Us?</h2>
          <p className="mt-3 text-lg text-slate-600">Our process is simple, safe, and gets you the most for your device.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="animate-on-scroll bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:-translate-y-2 text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl">📦</div>
            <h3 className="text-xl font-semibold mb-2 text-slate-800">Shipping Kit Available</h3>
            <p className="text-slate-600">We send you a prepaid box. Just pack your device and drop it in the mail.</p>
          </div>
          <div className="animate-on-scroll bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:-translate-y-2 text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl">💸</div>
            <h3 className="text-xl font-semibold mb-2 text-slate-800">Fast Payment</h3>
            <p className="text-slate-600">Get paid quickly via Venmo, Zelle, or PayPal as soon as we inspect your device.</p>
          </div>
          <div className="animate-on-scroll bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:-translate-y-2 text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl">🛡️</div>
            <h3 className="text-xl font-semibold mb-2 text-slate-800">Data Protection</h3>
            <p className="text-slate-600">We professionally wipe all personal data from every device we receive.</p>
          </div>
          <div className="animate-on-scroll bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:-translate-y-2 text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center text-3xl">🔒</div>
            <h3 className="text-xl font-semibold mb-2 text-slate-800">Highest Payouts</h3>
            <p className="text-slate-600">Our price-lock guarantee ensures you get the quote you were offered.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs md:text-sm font-semibold uppercase tracking-widest text-sky-600">500+ 3–5 Star Reviews</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">What Our Customers Say</h2>
            <div className="mt-5 flex flex-col items-center gap-3">
              <div className="flex gap-1 text-2xl">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fa-solid fa-star text-yellow-400"></i>
                ))}
              </div>
              <p className="text-slate-600">4.8 out of 5 based on 2,341 reviews</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                stars: 5,
                text: "SecondHandCell handled my iPhone trade-in in days. The shipping kit arrived quickly, inspection was honest, and the payout hit my account the same afternoon.",
                name: "Jennifer Martinez",
                role: "iPhone 15 Pro Max Seller"
              },
              {
                stars: 4,
                text: "The $10 shipping kit deduction was worth it—everything I needed was in the box. Their portal kept me updated until the payout cleared the next morning.",
                name: "Robert Johnson",
                role: "Galaxy S23 Ultra Seller"
              },
              {
                stars: 5,
                text: "As a teacher with zero free time, I loved how transparent the process was. I chose an email label, shipped the same day, and had my Zelle transfer within 24 hours.",
                name: "Lisa Thompson",
                role: "Teacher • Chicago, IL"
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="animate-on-scroll bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all border border-blue-100">
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <i key={i} className="fa-solid fa-star text-yellow-400"></i>
                  ))}
                </div>
                <p className="text-slate-600 mb-4">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center gap-3 pt-4 border-t">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-slate-800">{testimonial.name}</p>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Devices */}
      <section id="popular" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Popular Devices We Buy</h2>
            <p className="mt-3 text-lg text-slate-600">From the latest models to older favorites, we buy them all.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[
              { name: 'iPhone 15 Pro Max', price: '$700', emoji: '📱' },
              { name: 'Samsung Galaxy S24 Ultra', price: '$600', emoji: '📱' },
              { name: 'iPhone 16', price: '$532', emoji: '📱' },
              { name: 'Samsung Galaxy S22', price: '$250', emoji: '📱' }
            ].map((device, idx) => (
              <Link key={idx} href="/sell" className="animate-on-scroll group">
                <div className="bg-gradient-to-br from-slate-50 to-gray-100 p-8 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:-translate-y-2 text-center h-full flex flex-col">
                  <div className="text-5xl mb-4 text-center">{device.emoji}</div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-800">{device.name}</h3>
                  <p className="text-green-600 font-bold mb-4">Up to {device.price}</p>
                  <span className="mt-auto bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-medium group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">Get Offer</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* External Reviews Section */}
      <section id="external-reviews" className="bg-slate-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Trusted By Thousands</h2>
            <p className="mt-3 text-lg text-slate-600">See our latest reviews and ratings on external, independent platforms.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="animate-on-scroll bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition border-t-4 border-blue-600 text-center">
              <div className="text-4xl mb-3 flex justify-center">
                <i className="fa-brands fa-google text-blue-600"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">Google Reviews</h3>
              <p className="text-sm text-slate-500 mb-4">Read our public customer reviews.</p>
              <a href="#" className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition">See Reviews</a>
            </div>

            <div className="animate-on-scroll bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition border-t-4 border-green-600 text-center">
              <div className="text-4xl mb-3 flex justify-center">
                <i className="fa-solid fa-star text-green-500"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">Trustpilot</h3>
              <p className="text-sm text-slate-500 mb-4">Check our verified customer rating.</p>
              <a href="#" className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition">View Rating</a>
            </div>

            <div className="animate-on-scroll bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition border-t-4 border-red-600 text-center">
              <div className="text-4xl mb-3 flex justify-center">
                <i className="fa-solid fa-bullhorn text-red-500"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">Yelp Reviews</h3>
              <p className="text-sm text-slate-500 mb-4">See what local customers are saying.</p>
              <a href="#" className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition">Read Reviews</a>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="cta" className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Ready to Turn Your Device Into Cash?</h2>
          <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">Get your instant quote now—it only takes 60 seconds. Our quotes are guaranteed for 30 days.</p>
          <Link
            href="/sell"
            className="bg-white text-indigo-700 px-12 py-4 rounded-full font-bold text-xl shadow-2xl hover:bg-indigo-50 hover:scale-105 transition-all transform inline-block"
          >
            Sell Device Now!
            <i className="fa-solid fa-arrow-right-long ml-2"></i>
          </Link>
        </div>
      </section>
    </>
  );
}