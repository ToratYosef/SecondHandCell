import React from 'react';
import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 text-white py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">How It Works</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">Three simple steps to turn your old phone into cash in under a week</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          {/* Process Steps */}
          <div className="space-y-16 mb-20">
            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-3xl font-bold shadow-lg">1</div>
                  <h2 className="text-4xl font-bold text-slate-900">Get Your Instant Quote</h2>
                </div>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  Select your device brand, model, and storage capacity. Then answer a few quick questions about its condition. No credit card required!
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Takes just 2-3 minutes',
                    'Completely free, no obligation',
                    'Guaranteed price for 30 days',
                    'No personal information needed'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-slate-700">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">✓</div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/sell" className="inline-block bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-md hover:shadow-lg transform hover:scale-105">
                  Start Getting a Quote <i className="fa-solid fa-arrow-right ml-2"></i>
                </Link>
              </div>
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-12 rounded-2xl flex items-center justify-center h-96">
                <div className="text-8xl">💬</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
              <div className="md:order-2">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white text-3xl font-bold shadow-lg">2</div>
                  <h2 className="text-4xl font-bold text-slate-900">Ship Your Device</h2>
                </div>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  Once you accept the quote, we'll send you a free shipping kit with a prepaid label and full insurance. Just pack it and drop it off!
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Free shipping kit and prepaid label',
                    'Full insurance coverage included',
                    'Tracking number provided',
                    'No cost to you whatsoever'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-slate-700">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">✓</div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-12 rounded-2xl flex items-center justify-center h-96 md:order-1">
                <div className="text-8xl">📦</div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 text-white text-3xl font-bold shadow-lg">3</div>
                  <h2 className="text-4xl font-bold text-slate-900">Get Paid Fast</h2>
                </div>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  Once we receive your device, we'll inspect it carefully and send your payment within 24 hours. Choose your preferred payment method.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Paid within 24 hours of inspection',
                    'Choose: Venmo, Zelle, PayPal, or Bank Transfer',
                    'Secure data wiping (NIST certified)',
                    'No hidden fees or deductions'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-slate-700">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">✓</div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-12 rounded-2xl flex items-center justify-center h-96">
                <div className="text-8xl">💰</div>
              </div>
            </div>
          </div>

          {/* Timeline Visual */}
          <div className="bg-slate-50 p-12 rounded-2xl mb-20">
            <h3 className="text-3xl font-bold text-slate-900 mb-12 text-center">Timeline</h3>
            <div className="relative">
              <div className="hidden md:block absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-green-500 to-orange-500"></div>
              <div className="grid md:grid-cols-4 gap-8 relative">
                {[
                  { time: 'Day 1', label: 'Get Quote', icon: '💬' },
                  { time: 'Day 2-3', label: 'Ship Device', icon: '📦' },
                  { time: 'Day 4-5', label: 'Inspection', icon: '🔍' },
                  { time: 'Day 5-6', label: 'Get Paid', icon: '✓' }
                ].map((step, idx) => (
                  <div key={idx} className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-slate-900 mb-4 relative z-10 text-2xl">
                      {step.icon}
                    </div>
                    <p className="font-bold text-slate-900 text-lg">{step.time}</p>
                    <p className="text-slate-600 font-semibold">{step.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-12 rounded-2xl mb-20">
            <h3 className="text-3xl font-bold text-slate-900 mb-12 text-center">Frequently Asked Questions</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  q: 'Is there any cost to me?',
                  a: 'No! We cover all shipping costs and provide free insurance. You only benefit. There are zero hidden fees.'
                },
                {
                  q: 'What if my device doesn\'t match the quote?',
                  a: 'If there\'s a discrepancy, we\'ll contact you with a revised offer. You can still decline and we\'ll return your device.'
                },
                {
                  q: 'How is my data handled?',
                  a: 'All devices are wiped using industry-standard methods that exceed NIST guidelines. Your data is completely secure.'
                },
                {
                  q: 'Can I track my device?',
                  a: 'Yes! You\'ll get a tracking number and can monitor its journey. Check your account for real-time status updates.'
                },
                {
                  q: 'How long is my quote valid?',
                  a: 'Your quote is guaranteed for 30 days. That gives you plenty of time to decide if you want to sell.'
                },
                {
                  q: 'What devices do you buy?',
                  a: 'We buy iPhones, Samsung Galaxies, Google Pixels, OnePlus, Motorola, and many others - new or used!'
                }
              ].map((faq, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <i className="fa-solid fa-circle-question text-blue-600"></i>
                    {faq.q}
                  </h4>
                  <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-16 rounded-2xl text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Ready to Get Started?</h2>
              <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">It's fast, easy, and secure. Get your quote in under 3 minutes.</p>
              <Link
                href="/sell"
                className="inline-block bg-white text-indigo-700 hover:bg-indigo-50 font-bold py-4 px-12 rounded-full text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Your Quote Now <i className="fa-solid fa-lightning-bolt ml-2"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
