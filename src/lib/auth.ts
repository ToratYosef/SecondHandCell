import { cookies, headers } from 'next/headers';
import { getServerAuth, getServerFirestore } from '@/lib/firebaseAdmin';

export interface AuthContext {
  uid: string;
  email?: string;
  roles: string[];
}

async function resolveUserFromToken(idToken: string): Promise<AuthContext | null> {
  const adminAuth = getServerAuth();
  if (!adminAuth) {
    return null;
  }
  try {
    const decoded = await adminAuth.verifyIdToken(idToken, true);
    const roles = Array.isArray(decoded.roles)
      ? (decoded.roles as string[])
      : typeof decoded.role === 'string'
        ? [decoded.role]
        : [];

    if (decoded.admin === true && !roles.includes('admin')) {
      roles.push('admin');
    }

    if (decoded.partner === true && !roles.includes('partner')) {
      roles.push('partner');
    }

    return {
      uid: decoded.uid,
      email: decoded.email ?? undefined,
      roles
    };
  } catch (error) {
    console.warn('Failed to verify Firebase ID token', error);
    return null;
  }
}

export async function getAuthContext(): Promise<AuthContext | null> {
  const headerToken = headers().get('authorization')?.replace('Bearer ', '');
  const cookieStore = cookies();
  const cookieToken = cookieStore.get('session')?.value;

  if (!headerToken && !cookieToken) {
    return null;
  }

  const token = headerToken ?? cookieToken!;
  return resolveUserFromToken(token);
}

export function assertRole(context: AuthContext | null, role: 'admin' | 'partner' | 'user'): asserts context is AuthContext {
  if (!context || !context.roles.includes(role)) {
    throw Object.assign(new Error('Forbidden'), { status: 403 });
  }
}

export async function isAdmin(uid: string): Promise<boolean> {
  const firestore = getServerFirestore();
  if (!firestore) {
    return false;
  }

  const doc = await firestore.collection('admins').doc(uid).get();
  return doc.exists;
}
