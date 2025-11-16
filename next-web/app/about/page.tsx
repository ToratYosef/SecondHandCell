import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About SecondHandCell</h1>
          <p className="text-xl opacity-90">Making it easy to sell your used electronics</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto space-y-16">
          {/* Mission */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-4">
              At SecondHandCell, we believe everyone deserves a fair, hassle-free way to turn their used phones into cash. 
              We've built a service that's transparent, quick, and customer-centric.
            </p>
            <p className="text-lg text-gray-600">
              Since our founding, we've helped over 100,000 customers get top dollar for their devices, while promoting 
              a more sustainable tech ecosystem by extending device lifecycles.
            </p>
          </section>

          {/* Values */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">💯</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Transparency</h3>
                <p className="text-gray-600">No hidden fees, no surprises. What you see is what you get.</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Speed</h3>
                <p className="text-gray-600">Fast quotes, free shipping, and quick payouts. Your time matters.</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🌱</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Sustainability</h3>
                <p className="text-gray-600">Refurbishing devices reduces e-waste and environmental impact.</p>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="bg-gradient-to-br from-indigo-50 to-purple-50 p-12 rounded-xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">By The Numbers</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-indigo-600 mb-2">100K+</p>
                <p className="text-gray-600">Devices Purchased</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-indigo-600 mb-2">98%</p>
                <p className="text-gray-600">Customer Satisfaction</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-indigo-600 mb-2">50M+</p>
                <p className="text-gray-600">Paid to Customers</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-indigo-600 mb-2">24H</p>
                <p className="text-gray-600">Average Payment Time</p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Sell?</h2>
            <Link
              href="/sell"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition"
            >
              Get Your Quote
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
