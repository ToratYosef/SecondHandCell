// lib/firebase.js
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuration from your firebase-app.js
// **NOTE: In a real project, use environment variables (process.env.NEXT_PUBLIC_...)**
export const firebaseConfig = {
  apiKey: "AIzaSyAmUGWbpbJIWLrBMJpZb8iMpFt-uc24J0k",
  authDomain: "auth.secondhandcell.com",
  projectId: "buyback-a0f05",
  storageBucket: "buyback-a0f05.firebasestorage.app",
  messagingSenderId: "876430429098",
  appId: "1:876430429098:web:f6dd64b1960d90461979d3",
  measurementId: "G-6WWQN44JHT"
};

const apps = getApps();
export const firebaseApp = apps.length ? apps[0] : initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);