import { Request } from "express";
import { adminAuth, adminDb } from "./firebaseAdmin";

export type UserRole = "customer" | "wholesale" | "admin" | "fulfillment";

export interface AuthContext {
  uid: string;
  email: string | null;
  role: UserRole;
}

export async function getAuthContext(req: Request): Promise<AuthContext | null> {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      return null;
    }

    const userData = userDoc.data();
    
    return {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      role: userData?.role || "customer",
    };
  } catch (error) {
    console.error("Auth verification failed:", error);
    return null;
  }
}

export function assertRole(context: AuthContext | null, allowedRoles: UserRole[]): void {
  if (!context) {
    throw new Error("Authentication required");
  }

  if (!allowedRoles.includes(context.role)) {
    throw new Error(`Insufficient permissions. Required roles: ${allowedRoles.join(", ")}`);
  }
}

export function assertAuth(context: AuthContext | null): asserts context is AuthContext {
  if (!context) {
    throw new Error("Authentication required");
  }
}
