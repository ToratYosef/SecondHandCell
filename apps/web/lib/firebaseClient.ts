import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

let clientApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;
let cachedDb: Firestore | null = null;
let cachedStorage: FirebaseStorage | null = null;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function ensureClientApp(): FirebaseApp {
  if (typeof window === "undefined") {
    throw new Error("Firebase client initialiser must be invoked in the browser");
  }

  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error("Missing NEXT_PUBLIC_FIREBASE_* environment variables");
  }

  if (clientApp) {
    return clientApp;
  }

  const apps = getApps();
  clientApp = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
  return clientApp;
}

export function auth(): Auth {
  if (!cachedAuth) {
    cachedAuth = getAuth(ensureClientApp());
  }
  return cachedAuth;
}

export function db(): Firestore {
  if (!cachedDb) {
    cachedDb = getFirestore(ensureClientApp());
  }
  return cachedDb;
}

export function storage(): FirebaseStorage {
  if (!cachedStorage) {
    cachedStorage = getStorage(ensureClientApp());
  }
  return cachedStorage;
}
