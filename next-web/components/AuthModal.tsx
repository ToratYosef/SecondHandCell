// components/AuthModal.jsx
'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AuthModal() {
  const { isModalOpen, closeModal, signIn } = useAuth();
  
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={closeModal}>
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-2xl font-bold mb-4 text-gray-900">Sign In or Create Account</h3>
        <p className="text-gray-600 mb-6">Sign in to track your trade-in orders and manage your account.</p>
        
        {/* Placeholder for Firebase Sign In Form */}
        <div className="space-y-4">
            <button 
                onClick={() => {signIn(); alert('Sign In With Google logic goes here');}}
                className="w-full py-2 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition"
            >
                {/* Google Icon Placeholder */}
                Sign in with Google
            </button>
            <button 
                onClick={closeModal}
                className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
}