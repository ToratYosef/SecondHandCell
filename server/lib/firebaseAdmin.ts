import admin from "firebase-admin";

const projectId = process.env.VITE_FIREBASE_PROJECT_ID || "secondhandwholecell";

if (!admin.apps.length) {
  // In development/testing, use application default credentials
  // In production, use service account key from environment
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: projectId,
      storageBucket: `${projectId}.appspot.com`,
    });
  } catch (error) {
    // Fallback for local development without credentials
    console.warn("Firebase Admin: Using default initialization");
    admin.initializeApp({
      projectId: projectId,
    });
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const adminStorage = admin.storage();

export default admin;
