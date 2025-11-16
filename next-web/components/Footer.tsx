'use client';
import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

/**
 * Footer Component
 * Placeholder for the site footer with links and social media.
 */
const Footer: React.FC<{}> = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 border-t-4 border-green-500">
      <div className="container mx-auto px-4">
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-gray-700 pb-8">
          
          {/* Company Info */}
          <div className="col-span-2 md:col-span-2">
            <h3 className="text-2xl font-bold text-green-400 mb-4 font-display">SecondHandCell</h3>
            <p className="text-gray-400 text-sm mb-4">
              Your trusted partner for selling used electronics. Fast quotes, free shipping, and quick payouts.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-500 transition text-2xl">f</a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition text-2xl">𝕏</a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition text-2xl">📷</a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-indigo-300">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/sell-device" className="text-gray-400 hover:text-white transition">Sell Your Device</Link></li>
              <li><Link href="/quote-status" className="text-gray-400 hover:text-white transition">Track Quote</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition">FAQ</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition">Blog</Link></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-indigo-300">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
              <li><Link href="/reviews" className="text-gray-400 hover:text-white transition">Reviews</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-indigo-300">Support</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-green-500" />
                <a href="mailto:support@secondhandcell.com" className="text-gray-400 hover:text-white transition">Email Us</a>
              </li>
              <li className="text-gray-400">Hours: M-F, 9am-5pm EST</li>
            </ul>
          </div>
          
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} SecondHandCell. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;