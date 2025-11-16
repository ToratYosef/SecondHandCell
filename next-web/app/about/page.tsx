import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">About SecondHandCell</h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">We're on a mission to make it simple, safe, and rewarding to sell your used electronics</p>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto space-y-24">
          {/* Mission Section */}
          <section className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-lg text-slate-600 mb-4 leading-relaxed">
                At SecondHandCell, we believe everyone deserves a fair, hassle-free way to turn their used phones into cash. 
                We've built a service that's transparent, quick, and customer-centric.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Since our founding, we've helped over 100,000 customers get top dollar for their devices, while promoting 
                a more sustainable tech ecosystem by extending device lifecycles.
              </p>
            </div>
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-8 rounded-2xl flex items-center justify-center">
              <div className="text-6xl">🎯</div>
            </div>
          </section>

          {/* Values */}
          <section>
            <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: '💯', title: 'Transparency', desc: 'No hidden fees, no surprises. What you see is what you get. We believe in honest pricing.' },
                { icon: '⚡', title: 'Speed', desc: 'Fast quotes, free shipping, and quick payouts. Your time is valuable, and we respect it.' },
                { icon: '🌱', title: 'Sustainability', desc: 'Refurbishing devices reduces e-waste and environmental impact. We care about our planet.' }
              ].map((value, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 text-center border-t-4 border-indigo-500">
                  <div className="text-6xl mb-4">{value.icon}</div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{value.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* By The Numbers */}
          <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 md:p-16 rounded-2xl text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
            </div>
            <h2 className="text-4xl font-bold text-center mb-12 relative z-10">By The Numbers</h2>
            <div className="grid md:grid-cols-4 gap-8 relative z-10">
              {[
                { num: '100K+', label: 'Devices Purchased' },
                { num: '98%', label: 'Customer Satisfaction' },
                { num: '$50M+', label: 'Paid to Customers' },
                { num: '24H', label: 'Average Payment Time' }
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-5xl font-extrabold mb-2 text-green-400">{stat.num}</p>
                  <p className="text-indigo-100 font-semibold">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Why Choose Us */}
          <section>
            <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Why Choose SecondHandCell?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { icon: 'fa-lock', title: 'Secure & Trusted', desc: 'Your data is encrypted and your devices are professionally wiped.' },
                { icon: 'fa-star', title: '4.8/5 Star Rating', desc: 'Thousands of satisfied customers. Read our reviews on Google, Trustpilot, and Yelp.' },
                { icon: 'fa-shipping-fast', title: 'Free Shipping', desc: 'We provide prepaid labels. No need to buy anything or leave your house.' },
                { icon: 'fa-hand-holding-dollar', title: 'Best Prices', desc: 'Our price-lock guarantee ensures you never get less than your quoted amount.' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6 p-6 bg-slate-50 rounded-xl hover:shadow-md transition">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">
                      <i className={`fa-solid ${item.icon}`}></i>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-green-500 to-emerald-600 p-12 md:p-16 rounded-2xl text-white text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Sell Your Device?</h2>
            <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">Get your instant quote in 60 seconds. No credit card required.</p>
            <Link
              href="/sell"
              className="inline-block bg-white text-green-600 hover:bg-green-50 font-bold py-4 px-12 rounded-full text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get My Quote Now <i className="fa-solid fa-arrow-right ml-2"></i>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
