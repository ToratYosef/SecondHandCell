import {
  getApps,
  initializeApp,
  applicationDefault,
  cert,
  type App,
  type ServiceAccount
} from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';

let app: App | null = null;
let firestoreInstance: Firestore | null = null;
let authInstance: Auth | null = null;
let initializationAttempted = false;

type CredentialJson = ServiceAccount & { project_id?: string };

function resolveProjectId(credentialJson?: CredentialJson) {
  return (
    process.env.FIREBASE_PROJECT_ID ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCLOUD_PROJECT ||
    credentialJson?.projectId ||
    credentialJson?.project_id ||
    undefined
  );
}

function tryInitialize() {
  if (initializationAttempted) {
    return;
  }

  initializationAttempted = true;

  try {
    if (getApps().length) {
      app = getApps()[0]!;
      return;
    }

    const credentialJson: CredentialJson | undefined = process.env.FIREBASE_ADMIN_CREDENTIALS
      ? JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS)
      : undefined;

    const projectId = resolveProjectId(credentialJson);

    if (!projectId) {
      console.warn('Firebase admin project ID is missing; admin features will use demo fallbacks.');
      return;
    }

    let credential;

    if (credentialJson) {
      credential = cert(credentialJson);
    } else {
      try {
        credential = applicationDefault();
      } catch (error) {
        console.warn('Application default credentials unavailable; skipping admin initialization.', error);
        return;
      }
    }

    app = initializeApp({
      projectId,
      credential
    });
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
    try {
      firestoreInstance = getFirestore(app);
    } catch (error) {
      firestoreInstance = null;
      console.warn('Unable to initialize Firestore admin client; using demo data.', error);
      return null;
    }
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
