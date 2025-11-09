import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? 'AIzaSyAmUGWbpbJIWLrBMJpZb8iMpFt-uc24J0k',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'buyback-a0f05.firebaseapp.com',
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ?? 'https://buyback-a0f05-default-rtdb.firebaseio.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'buyback-a0f05',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? 'buyback-a0f05.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '876430429098',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '1:876430429098:web:f6dd64b1960d90461979d3',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? 'G-6WWQN44JHT'
};

function getClientApp() {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
  return getApp();
}

export function firebaseAuth() {
  return getAuth(getClientApp());
}

export function firebaseFirestore() {
  return getFirestore(getClientApp());
}

export function firebaseDatabase() {
  return getDatabase(getClientApp());
}
