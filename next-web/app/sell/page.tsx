'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Get Your Quote</h1>
            <p className="text-xl text-gray-600">Step {step} of 3</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 flex gap-2">
            {[1, 2, 3].map(s => (
              <div key={s} className={`flex-1 h-2 rounded-full transition ${s <= step ? 'bg-indigo-600' : 'bg-gray-300'}`} />
            ))}
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Step 1: Device Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Select Your Device</h2>
                
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-3">Brand</label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                  >
                    <option value="">Select Brand</option>
                    {brands.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {formData.brand && (
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">Model</label>
                    <select
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
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
                    <label className="block text-lg font-semibold text-gray-900 mb-3">Storage</label>
                    <select
                      name="storage"
                      value={formData.storage}
                      onChange={handleInputChange}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
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
                <h2 className="text-2xl font-bold text-gray-900">Device Condition</h2>
                
                <div className="grid gap-4">
                  {['Excellent', 'Good', 'Fair', 'Poor'].map(cond => (
                    <label key={cond} className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-indigo-600 transition">
                      <input
                        type="radio"
                        name="condition"
                        value={cond}
                        checked={formData.condition === cond}
                        onChange={handleInputChange}
                        className="w-5 h-5"
                      />
                      <span className="ml-3 font-semibold text-gray-900">{cond}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Quote */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Quote</h2>
                
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-xl">
                  <p className="text-gray-600 mb-2">{formData.brand} {formData.model}</p>
                  <p className="text-gray-600 mb-4">{formData.storage} • {formData.condition} Condition</p>
                  
                  <div className="border-t-2 pt-4 mt-4">
                    <p className="text-sm text-gray-600 mb-2">Your Offer</p>
                    <div className="text-5xl font-bold text-green-600 mb-4">${calculatePrice()}</div>
                    <p className="text-sm text-gray-600">Valid for 30 days</p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-900">
                    ✓ This price is guaranteed
                    <br />✓ Free shipping included
                    <br />✓ Fast payment within 24 hours
                  </p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition"
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
                  className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition text-center"
                >
                  Checkout
                </Link>
              )}
            </div>
          </div>

          {/* Trust Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🔒</div>
              <h3 className="font-semibold text-gray-900">Secure</h3>
              <p className="text-sm text-gray-600">Your data is protected</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">✓</div>
              <h3 className="font-semibold text-gray-900">Guaranteed</h3>
              <p className="text-sm text-gray-600">30-day price lock</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold text-gray-900">Fast</h3>
              <p className="text-sm text-gray-600">Payment in 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
