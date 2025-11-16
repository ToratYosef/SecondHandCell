'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SellPage() {
  const [step, setStep] = useState(1);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [deviceCondition, setDeviceCondition] = useState('');
  const [quote, setQuote] = useState(null);

  const devices = [
    { name: 'iPhone 15 Pro Max', value: 'iphone-15-pro-max', price: 900, emoji: '📱' },
    { name: 'iPhone 15 Pro', value: 'iphone-15-pro', price: 800, emoji: '📱' },
    { name: 'iPhone 14 Pro', value: 'iphone-14-pro', price: 650, emoji: '📱' },
    { name: 'Samsung Galaxy S24 Ultra', value: 'galaxy-s24-ultra', price: 800, emoji: '📱' },
    { name: 'Samsung Galaxy S23', value: 'galaxy-s23', price: 550, emoji: '📱' },
    { name: 'Google Pixel 8 Pro', value: 'pixel-8-pro', price: 700, emoji: '📱' },
  ];

  const conditions = [
    { name: 'Excellent', value: 'excellent', multiplier: 1.0, desc: 'No cracks, scratches, or damage' },
    { name: 'Good', value: 'good', multiplier: 0.85, desc: 'Minor cosmetic damage' },
    { name: 'Fair', value: 'fair', multiplier: 0.65, desc: 'Visible wear and tear' },
    { name: 'Poor', value: 'poor', multiplier: 0.4, desc: 'Significant damage' },
  ];

  const handleGetQuote = async () => {
    if (!selectedDevice || !deviceCondition) {
      alert('Please select both device and condition');
      return;
    }

    try {
      const device = devices.find(d => d.value === selectedDevice);
      const condition = conditions.find(c => c.value === deviceCondition);

      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: selectedDevice,
          deviceName: device.name,
          condition: deviceCondition,
          conditionName: condition.name,
        }),
      });

      const data = await response.json();
      setQuote(data);
      setStep(3);
    } catch (error) {
      console.error('Error fetching quote:', error);
      alert('Error getting quote. Please try again.');
    }
  };

  return (
    <>
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-3">Get Your Instant Quote</h1>
          <p className="text-xl text-indigo-100">It only takes 60 seconds. Your quote is guaranteed for 30 days.</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Progress Bar */}
          <div className="flex justify-between items-center mb-16">
            {[
              { num: 1, label: 'Device' },
              { num: 2, label: 'Condition' },
              { num: 3, label: 'Quote' }
            ].map((item, idx) => (
              <div key={item.num} className="flex items-center flex-1">
                <div className="flex items-center flex-1">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                      step >= item.num
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step > item.num ? <i className="fa-solid fa-check"></i> : item.num}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-gray-600">{item.label}</p>
                  </div>
                </div>
                {idx < 2 && (
                  <div
                    className={`h-1 flex-1 mx-4 rounded-full transition-all ${
                      step > item.num ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Select Device */}
          {step === 1 && (
            <div className="animate-fade-in-up">
              <h2 className="text-3xl font-bold mb-2 text-slate-900">What device are you selling?</h2>
              <p className="text-gray-600 mb-8">Select your device model to get started.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {devices.map((device) => (
                  <button
                    key={device.value}
                    onClick={() => setSelectedDevice(device.value)}
                    className={`p-5 border-2 rounded-xl text-left transition-all transform hover:scale-102 ${
                      selectedDevice === device.value
                        ? 'border-green-500 bg-green-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-slate-900">{device.name}</p>
                        <p className="text-sm text-green-600 font-semibold mt-1">Up to ${device.price}</p>
                      </div>
                      <span className="text-2xl">{device.emoji}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setStep(2)}
                disabled={!selectedDevice}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-102 text-lg"
              >
                Continue <i className="fa-solid fa-arrow-right ml-2"></i>
              </button>
            </div>
          )}

          {/* Step 2: Select Condition */}
          {step === 2 && (
            <div className="animate-fade-in-up">
              <h2 className="text-3xl font-bold mb-2 text-slate-900">What's the condition?</h2>
              <p className="text-gray-600 mb-8">Select the condition that best describes your device.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {conditions.map((condition) => (
                  <button
                    key={condition.value}
                    onClick={() => setDeviceCondition(condition.value)}
                    className={`p-6 border-2 rounded-xl text-left transition-all transform hover:scale-102 ${
                      deviceCondition === condition.value
                        ? 'border-green-500 bg-green-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <p className="font-bold text-slate-900">{condition.name}</p>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        deviceCondition === condition.value
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {Math.round(condition.multiplier * 100)}%
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{condition.desc}</p>
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border-2 border-slate-300 text-slate-700 font-bold py-4 px-6 rounded-xl hover:bg-slate-50 transition-all"
                >
                  <i className="fa-solid fa-arrow-left mr-2"></i> Back
                </button>
                <button
                  onClick={handleGetQuote}
                  disabled={!deviceCondition}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-102"
                >
                  Get My Quote <i className="fa-solid fa-arrow-right ml-2"></i>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Quote Result */}
          {step === 3 && quote && (
            <div className="animate-fade-in-up">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border-2 border-green-200 shadow-lg mb-8">
                <div className="text-center mb-8">
                  <div className="inline-block bg-green-500 text-white rounded-full p-4 mb-4">
                    <i className="fa-solid fa-check text-2xl"></i>
                  </div>
                  <h2 className="text-4xl font-extrabold text-green-600 mb-2">Your Quote is Ready!</h2>
                  <p className="text-gray-700">Price guarantee valid for 30 days</p>
                </div>

                <div className="bg-white p-8 rounded-xl mb-6 border-2 border-green-200 shadow-md">
                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div>
                      <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Device</p>
                      <p className="text-2xl font-bold text-slate-900 mt-2">{quote.deviceName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Condition</p>
                      <p className="text-2xl font-bold text-slate-900 mt-2">{quote.conditionName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Quote ID</p>
                      <p className="text-xl font-bold text-slate-900 mt-2 font-mono">{quote.quoteId}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-xl mb-6 text-center border-4 border-green-400 shadow-md">
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-3">Your Quote</p>
                  <div className="text-6xl font-extrabold text-green-600">
                    ${quote.quote}
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl mb-8 border border-blue-200">
                  <div className="flex gap-4">
                    <i className="fa-solid fa-circle-info text-blue-600 text-xl flex-shrink-0 mt-1"></i>
                    <div>
                      <p className="font-semibold text-blue-900 mb-2">How it works:</p>
                      <p className="text-sm text-blue-800">
                        1) Ship your device using our prepaid label. 2) We inspect it within 1-2 business days. 3) Get paid via Venmo, Zelle, or PayPal within 24 hours of inspection. Your quote is locked for 30 days.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => {
                      setStep(1);
                      setSelectedDevice('');
                      setDeviceCondition('');
                      setQuote(null);
                    }}
                    className="flex-1 border-2 border-slate-300 text-slate-700 font-bold py-4 px-6 rounded-xl hover:bg-slate-50 transition-all"
                  >
                    <i className="fa-solid fa-rotate-left mr-2"></i> Get Another Quote
                  </button>
                  <Link
                    href="/account"
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-102 text-center inline-block"
                  >
                    Next: Shipping Details <i className="fa-solid fa-arrow-right ml-2"></i>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'How long is my quote valid?', a: 'Your quote is guaranteed for 30 days from the date you receive it.' },
              { q: 'Do you offer free shipping?', a: 'Yes! We provide a prepaid shipping kit with every quote.' },
              { q: 'How long does inspection take?', a: 'We typically inspect devices within 1-2 business days of receiving them.' },
              { q: 'What payment methods do you accept?', a: 'We offer Venmo, Zelle, PayPal, and direct bank transfer.' },
            ].map((faq, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                <p className="font-semibold text-slate-900 mb-2">{faq.q}</p>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
