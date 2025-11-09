import type { DecodedIdToken } from "firebase-admin/auth";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { adminAuth } from "./firebaseAdmin";

const allowedAdminEmails = (process.env.ADMIN_ALLOWED_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

type Role = "user" | "admin";

export interface AuthContext {
  token: DecodedIdToken | null;
  uid: string | null;
  email: string | null;
  roles: Role[];
}

function parseCookieHeader(header: string | null): Record<string, string> {
  if (!header) return {};
  return header.split(/; */).reduce<Record<string, string>>((acc, chunk) => {
    const [name, ...rest] = chunk.split("=");
    if (!name) return acc;
    acc[name] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});
}

async function decodeIdToken(idToken: string): Promise<DecodedIdToken> {
  try {
    return await adminAuth.verifyIdToken(idToken, true);
  } catch (error) {
    const err = new Error("Invalid authentication token");
    (err as Error & { status?: number }).status = 401;
    throw err;
  }
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return allowedAdminEmails.includes(email.toLowerCase());
}

function computeRoles(decoded: DecodedIdToken | null): Role[] {
  if (!decoded) return [];
  const isAdminClaim = decoded.admin === true || (decoded as Record<string, unknown>).role === "admin";
  const email = decoded.email;
  const isAdmin = isAdminClaim || isAdminEmail(email);
  const roles: Role[] = [];
  if (decoded.uid) roles.push("user");
  if (isAdmin) roles.push("admin");
  return roles;
}

export async function getAuthContext(req: Request | NextRequest): Promise<AuthContext> {
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.toLowerCase().startsWith("bearer ")
    ? authHeader.substring(7).trim()
    : null;

  let tokenString = bearerToken;

  if (!tokenString) {
    const headerCookies = parseCookieHeader(req.headers.get("cookie"));
    tokenString = headerCookies.idToken || headerCookies.__session;
  }

  if (!tokenString && typeof cookies === "function") {
    const cookieStore = cookies();
    tokenString = cookieStore.get("idToken")?.value || cookieStore.get("__session")?.value || null;
  }

  if (!tokenString) {
    return { token: null, uid: null, email: null, roles: [] };
  }

  const decoded = await decodeIdToken(tokenString);
  const roles = computeRoles(decoded);
  return {
    token: decoded,
    uid: decoded.uid ?? null,
    email: decoded.email ?? null,
    roles,
  };
}

export async function assertRole(req: Request | NextRequest, role: Role): Promise<AuthContext> {
  const ctx = await getAuthContext(req);
  if (!ctx.token) {
    const err = new Error("Authentication required");
    (err as Error & { status?: number }).status = 401;
    throw err;
  }

  if (!ctx.roles.includes(role)) {
    const err = new Error("Forbidden");
    (err as Error & { status?: number }).status = 403;
    throw err;
  }

  return ctx;
}
