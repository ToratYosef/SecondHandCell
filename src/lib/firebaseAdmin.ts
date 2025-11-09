import { getApps, initializeApp, applicationDefault, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';

let app: App | null = null;
let firestoreInstance: Firestore | null = null;
let authInstance: Auth | null = null;
let initializationAttempted = false;

function tryInitialize() {
  if (initializationAttempted) {
    return;
  }

  initializationAttempted = true;

  try {
    if (!getApps().length) {
      const credentialJson = process.env.FIREBASE_ADMIN_CREDENTIALS
        ? JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS)
        : undefined;

      app = initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || undefined,
        credential: credentialJson
          ? cert(credentialJson)
          : applicationDefault()
      });
    } else {
      app = getApps()[0]!;
    }
  } catch (error) {
    app = null;
    console.warn('Firebase admin SDK is not configured; falling back to demo data.', error);
  }
}

export function getServerFirestore(): Firestore | null {
  tryInitialize();
  if (!app) {
    return null;
  }

  if (!firestoreInstance) {
    firestoreInstance = getFirestore(app);
  }

  return firestoreInstance;
}

export function getServerAuth(): Auth | null {
  tryInitialize();
  if (!app) {
    return null;
  }

  if (!authInstance) {
    authInstance = getAuth(app);
  }

  return authInstance;
}

export function isFirebaseAdminAvailable(): boolean {
  tryInitialize();
  return Boolean(app);
}
