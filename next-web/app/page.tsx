'use client';

import React from 'react';
import Link from 'next/link';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import FeaturesSection from '@/components/FeaturesSection';

export default function Home() {
  useScrollAnimation();

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section py-16 md:py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="animate-on-scroll">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                Turn Your Old Phone Into <span className="text-green-400">Cash!</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                Get an instant quote, ship for free, and get paid within 24 hours. 
                No hassle. No hidden fees. Just fair prices.
              </p>
              <Link
                href="/sell"
                className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-all shadow-lg hover:shadow-xl"
              >
                Get My Instant Quote
              </Link>
            </div>
            <div className="animate-on-scroll hidden md:block">
              <div className="text-center">
                <div className="inline-block bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-2xl shadow-2xl">
                  <div className="text-6xl">📱</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ghost phones background */}
        <div className="absolute top-0 left-0 text-white opacity-5 text-9xl pointer-events-none">📱</div>
        <div className="absolute bottom-0 right-0 text-white opacity-5 text-9xl pointer-events-none">📱</div>
      </section>

      {/* Trust Metrics Section */}
      <section className="py-16 md:py-24 bg-white animate-on-scroll">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Trusted by Thousands
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-green-500 mb-2">100K+</div>
              <p className="text-gray-600">Devices Bought</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-green-500 mb-2">98%</div>
              <p className="text-gray-600">Customer Satisfaction</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-green-500 mb-2">$400+</div>
              <p className="text-gray-600">Average Payout</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-green-500 mb-2">24H</div>
              <p className="text-gray-600">Fast Payment</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Why Sell With Us */}
      <section className="py-16 md:py-24 bg-gray-50 animate-on-scroll">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Sell With Us?
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Free Shipping</h3>
              <p className="text-gray-600">
                We provide a prepaid shipping kit. Just pack and ship!
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Fast Payment</h3>
              <p className="text-gray-600">
                Get paid within 24 hours of inspection via Venmo, Zelle, or PayPal.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Data Protection</h3>
              <p className="text-gray-600">
                Your data is securely wiped and protected with industry standards.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Best Prices</h3>
              <p className="text-gray-600">
                Guaranteed fair pricing. Price-lock guarantee included.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Devices */}
      <section className="py-16 md:py-24 bg-white animate-on-scroll">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Popular Devices We Buy
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'iPhone 15 Pro Max', price: '$850-950' },
              { name: 'Samsung S24 Ultra', price: '$750-850' },
              { name: 'iPhone 14 Pro', price: '$600-750' },
            ].map((device, idx) => (
              <div key={idx} className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-lg shadow-md hover:shadow-xl transition">
                <div className="text-5xl mb-4 text-center">📱</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 text-center">{device.name}</h3>
                <p className="text-green-600 font-bold text-center mb-4">Up to {device.price}</p>
                <Link
                  href="/sell"
                  className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition"
                >
                  Get Offer
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-green-500 to-emerald-600 text-white animate-on-scroll">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Turn Your Phone Into Cash?</h2>
          <p className="text-xl mb-8 opacity-90">Get your instant quote today!</p>
          <Link
            href="/sell"
            className="inline-block bg-white text-green-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-lg transition-all shadow-lg"
          >
            Start Now
          </Link>
        </div>
      </section>
    </>
  );
}