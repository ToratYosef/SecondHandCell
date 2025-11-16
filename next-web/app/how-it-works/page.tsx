import React from 'react';
import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h1>
          <p className="text-xl opacity-90">Three simple steps to turn your old phone into cash</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Step 1 */}
          <div className="mb-16 flex gap-8 items-center">
            <div className="hidden md:block flex-shrink-0">
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-indigo-600 text-white text-3xl font-bold">1</div>
            </div>
            <div className="flex-grow">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Your Instant Quote</h2>
              <p className="text-lg text-gray-600 mb-4">
                Select your device brand, model, and storage capacity. Then answer a few quick questions about its condition.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Takes just 2-3 minutes</li>
                <li>✓ Completely free, no obligation</li>
                <li>✓ Guaranteed price for 30 days</li>
              </ul>
              <Link href="/sell" className="inline-block mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded transition">
                Get Quote
              </Link>
            </div>
          </div>

          {/* Step 2 */}
          <div className="mb-16 flex gap-8 items-center flex-row-reverse">
            <div className="hidden md:block flex-shrink-0">
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-green-600 text-white text-3xl font-bold">2</div>
            </div>
            <div className="flex-grow">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ship Your Device</h2>
              <p className="text-lg text-gray-600 mb-4">
                Once you accept the quote, we'll send you a free shipping kit with a prepaid label and insurance.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Free shipping kit and label</li>
                <li>✓ Full insurance coverage</li>
                <li>✓ Tracking number provided</li>
                <li>✓ No cost to you whatsoever</li>
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div className="mb-16 flex gap-8 items-center">
            <div className="hidden md:block flex-shrink-0">
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-orange-600 text-white text-3xl font-bold">3</div>
            </div>
            <div className="flex-grow">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Paid</h2>
              <p className="text-lg text-gray-600 mb-4">
                Once we receive your device, we'll inspect it carefully and send your payment within 24 hours.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Paid within 24 hours of inspection</li>
                <li>✓ Multiple payment options (Venmo, Zelle, PayPal)</li>
                <li>✓ Secure data wiping</li>
                <li>✓ No hidden fees or deductions</li>
              </ul>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-12 rounded-xl my-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Is there any cost to me?</h4>
                <p className="text-gray-600">No! We cover all shipping costs and provide free insurance. You only benefit.</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">What if my device doesn't match the quote?</h4>
                <p className="text-gray-600">If there's a discrepancy, we'll contact you with a revised offer. You can still decline and we'll return your device.</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">How is my data handled?</h4>
                <p className="text-gray-600">All devices are wiped using industry-standard methods that exceed NIST guidelines for data destruction.</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">Can I track my device?</h4>
                <p className="text-gray-600">Yes! You'll get a tracking number and can monitor its journey. You can also check your account for status updates.</p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
            <Link
              href="/sell"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition text-lg"
            >
              Get Your Quote Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
