// components/FeaturesSection.jsx
import React from 'react';

// Converted from the 'features-section' in index (1).html
export default function FeaturesSection() {
  return (
    // 'animate-on-scroll' is the key class for the hook to observe
    <section className="features-section text-center py-20 bg-white animate-on-scroll">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">Easy. Fast. Secure.</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-16">
          Trade in your used device in three simple steps and get paid fast.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Feature 1: Quote */}
          <div className="feature-card p-6 rounded-lg shadow-xl border-t-4 border-indigo-500">
            <div className="icon-circle bg-indigo-100 text-indigo-600 mx-auto mb-6">1</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Get Your Quote</h3>
            <p className="text-gray-600">Answer a few questions about your device to receive an instant, transparent quote. No hidden fees, guaranteed.</p>
          </div>
          
          {/* Feature 2: Ship */}
          <div className="feature-card p-6 rounded-lg shadow-xl border-t-4 border-green-500">
            <div className="icon-circle bg-green-100 text-green-600 mx-auto mb-6">2</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Ship It Free</h3>
            <p className="text-gray-600">We send you a free, pre-paid shipping kit with tracking and insurance. Just pack your device and send it back to us.</p>
          </div>
          
          {/* Feature 3: Get Paid */}
          <div className="feature-card p-6 rounded-lg shadow-xl border-t-4 border-orange-500">
            <div className="icon-circle bg-orange-100 text-orange-600 mx-auto mb-6">3</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Get Paid Fast</h3>
            <p className="text-gray-600">Once we receive and inspect your device (usually within 24 hours), payment is issued instantly via PayPal, Zelle, or Check.</p>
          </div>
        </div>
      </div>
    </section>
  );
}