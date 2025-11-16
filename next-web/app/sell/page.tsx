'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const perks = [
  { icon: '🧾', title: 'Locked pricing', desc: 'Quotes are guaranteed for 30 days with no hidden deductions.' },
  { icon: '📦', title: 'Free, insured kit', desc: 'Prepaid label, insurance, and packing tips included with every quote.' },
  { icon: '⚡', title: 'Same-day pay', desc: 'Inspected and paid out within 24 hours of arrival.' },
];

export default function SellPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    storage: '',
    condition: '',
  });

  const brands = ['Apple', 'Samsung', 'Google', 'OnePlus', 'Motorola'];
  const models: { [key: string]: string[] } = {
    Apple: ['iPhone 15 Pro Max', 'iPhone 15', 'iPhone 14 Pro', 'iPhone 14'],
    Samsung: ['Galaxy S24 Ultra', 'Galaxy S23', 'Galaxy Z Fold 5', 'Galaxy A54'],
    Google: ['Pixel 8 Pro', 'Pixel 8', 'Pixel 7 Pro'],
    OnePlus: ['12 Pro', '11', '10 Pro'],
    Motorola: ['Edge 50 Pro', 'Razr 50', 'Edge 50'],
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.brand || !formData.model || !formData.storage)) {
      alert('Please fill in all device details');
      return;
    }
    if (step === 2 && !formData.condition) {
      alert('Please select device condition');
      return;
    }
    if (step < 3) setStep(step + 1);
  };

  const calculatePrice = () => {
    const basePrice: { [key: string]: number } = {
      'iPhone 15 Pro Max': 900,
      'iPhone 15': 700,
      'Galaxy S24 Ultra': 800,
      'Galaxy S23': 600,
    };

    const base = basePrice[formData.model] || 500;
    const conditions: { [key: string]: number } = {
      'Excellent': 1,
      'Good': 0.85,
      'Fair': 0.65,
      'Poor': 0.4,
    };

    const multiplier = conditions[formData.condition] || 0.7;
    return Math.round(base * multiplier);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mb-10 text-center max-w-3xl mx-auto space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-green-300/80">Premium template</p>
          <h1 className="text-4xl md:text-5xl font-black">Get your locked-in buyback price</h1>
          <p className="text-lg text-slate-200">
            Follow the guided steps to lock your quote, ship for free, and get paid within 24 hours of arrival.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <div className="bg-white text-slate-900 rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-green-400 text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-white/70">Instant quote</p>
                  <h2 className="text-2xl md:text-3xl font-black">Step {step} of 3</h2>
                  <p className="text-white/80">Complete the steps below to lock your guaranteed offer.</p>
                </div>
                <div className="flex gap-2 flex-1 md:flex-initial">
                  {[1, 2, 3].map(s => (
                    <div key={s} className={`flex-1 h-2 rounded-full transition ${s <= step ? 'bg-white' : 'bg-white/50'}`} />
                  ))}
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-8">
                {/* Step 1: Device Selection */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-slate-900">Select your device</h3>

                    <div>
                      <label className="block text-lg font-semibold text-slate-900 mb-3">Brand</label>
                      <select
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        className="w-full p-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                      >
                        <option value="">Select Brand</option>
                        {brands.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    {formData.brand && (
                      <div>
                        <label className="block text-lg font-semibold text-slate-900 mb-3">Model</label>
                        <select
                          name="model"
                          value={formData.model}
                          onChange={handleInputChange}
                          className="w-full p-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                        >
                          <option value="">Select Model</option>
                          {models[formData.brand]?.map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {formData.model && (
                      <div>
                        <label className="block text-lg font-semibold text-slate-900 mb-3">Storage</label>
                        <select
                          name="storage"
                          value={formData.storage}
                          onChange={handleInputChange}
                          className="w-full p-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                        >
                          <option value="">Select Storage</option>
                          <option value="64GB">64GB</option>
                          <option value="128GB">128GB</option>
                          <option value="256GB">256GB</option>
                          <option value="512GB">512GB</option>
                          <option value="1TB">1TB</option>
                        </select>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Condition Assessment */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-slate-900">Device condition</h3>

                    <div className="grid gap-4">
                      {['Excellent', 'Good', 'Fair', 'Poor'].map(cond => (
                        <label key={cond} className="flex items-center p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-indigo-600 transition">
                          <input
                            type="radio"
                            name="condition"
                            value={cond}
                            checked={formData.condition === cond}
                            onChange={handleInputChange}
                            className="w-5 h-5"
                          />
                          <span className="ml-3 font-semibold text-slate-900">{cond}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Quote */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-slate-900">Your quote</h3>

                    <div className="bg-gradient-to-br from-indigo-50 to-green-50 p-8 rounded-xl border border-slate-100">
                      <p className="text-slate-600 mb-2">{formData.brand} {formData.model}</p>
                      <p className="text-slate-600 mb-4">{formData.storage} • {formData.condition} Condition</p>

                      <div className="border-t-2 pt-4 mt-4">
                        <p className="text-sm text-slate-500 mb-2">Your Offer</p>
                        <div className="text-5xl font-black text-green-600 mb-4">${calculatePrice()}</div>
                        <p className="text-sm text-slate-600">Valid for 30 days</p>
                      </div>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg">
                      <p className="text-sm text-indigo-900">
                        ✓ Guaranteed pricing • ✓ Free insured shipping • ✓ Paid within 24 hours
                      </p>
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-4">
                  {step > 1 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-900 font-semibold rounded-lg hover:bg-slate-50 transition"
                    >
                      Back
                    </button>
                  )}

                  {step < 3 ? (
                    <button
                      onClick={handleNext}
                      className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                    >
                      Next
                    </button>
                  ) : (
                    <Link
                      href="/account"
                      className="flex-1 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition text-center"
                    >
                      Checkout
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
              <h3 className="text-xl font-bold mb-3">Why sellers love this template</h3>
              <p className="text-slate-200 mb-4 text-sm">Inspired by BuyBacking, refined for SecondHandCell.</p>
              <ul className="space-y-3 text-slate-200">
                {perks.map(perk => (
                  <li key={perk.title} className="flex gap-3">
                    <span className="text-2xl leading-none">{perk.icon}</span>
                    <div>
                      <p className="font-semibold text-white">{perk.title}</p>
                      <p className="text-sm text-slate-300">{perk.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
              <h3 className="text-xl font-bold mb-3">Need help?</h3>
              <p className="text-slate-200 text-sm mb-4">Chat with our team before you ship—we respond within minutes.</p>
              <button
                onClick={() => router.push('/about')}
                className="w-full bg-white text-slate-900 py-3 rounded-xl font-semibold hover:bg-slate-100"
              >
                Meet the team
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
