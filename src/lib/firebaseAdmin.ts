import { getApps, initializeApp, applicationDefault, cert, type App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let app: App;

if (!getApps().length) {
  const credentialJson = process.env.FIREBASE_ADMIN_CREDENTIALS
    ? JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS)
    : undefined;

  app = initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID,
    credential: credentialJson ? cert(credentialJson) : applicationDefault()
  });
} else {
  app = getApps()[0]!;
}

export const firestore = getFirestore(app);
export const adminAuth = getAuth(app);
