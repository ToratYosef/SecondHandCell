// components/Header.jsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Header() {
  const { user, signIn, signOut, openModal } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const userInitials = user 
    ? user.email.substring(0, 1).toUpperCase() 
    : 'U';

  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center md:py-5 justify-between">
        
        {/* Logo Left */}
        <div className="flex-1 flex justify-start items-center">
          <Link href="/" className="h-12 md:h-20 w-auto">
            <Image 
              src="https://raw.githubusercontent.com/ToratYosef/BuyBacking/refs/heads/main/assets/logo.png"
              alt="SecondHandCell Logo" 
              width={200}
              height={64}
              className="h-full w-auto"
            />
          </Link>
        </div>

        {/* Logo Text Center (Desktop Only) */}
        <div className="flex-none flex-col items-center hidden md:flex">
          <div className="text-xl md:text-2xl font-extrabold whitespace-nowrap">
            <span className="text-black">Second</span><span className="text-green-500">HandCell</span>
          </div>
          <p className="text-[0.6rem] md:text-sm -mt-1 whitespace-nowrap text-green-500">
            Turn Your Old<span className="text-black"> Phone Into Cash!</span>
          </p>
        </div>

        {/* Navigation & Auth */}
        <nav className="flex-1 flex justify-end items-center space-x-4">
          <div className="relative inline-block">
            {!user ? (
              // Login/Sign Up Button
              <button 
                onClick={openModal}
                className="bg-indigo-600 text-white px-2.5 py-1.5 md:px-4 md:py-2 rounded-full font-semibold hover:bg-indigo-700 transition-colors duration-300 shadow-sm text-xs md:text-base"
              >
                Login/Sign Up
              </button>
            ) : (
              // User Monogram/Dropdown
              <div className="relative">
                <div 
                  className="user-monogram w-10 h-10 bg-green-500 text-white flex items-center justify-center rounded-full font-bold cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {userInitials}
                </div>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-100">
                    <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Account</Link>
                    <button 
                      onClick={signOut} 
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}