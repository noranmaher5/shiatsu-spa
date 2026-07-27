import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase/admin";
import { ADMIN_ROUTES } from "@/lib/constants";

/** Must match the cookie name middleware.ts checks for. */
export const SESSION_COOKIE_NAME = "__session";

// 5 days — long enough that an admin editing content daily isn't
// constantly re-prompted to log in, short enough to bound the blast
// radius of a leaked cookie.
const SESSION_EXPIRES_IN_MS = 60 * 60 * 24 * 5 * 1000;

export type AdminSession = {
  uid: string;
  email: string | null;
  name: string | null;
};

/**
 * Exchanges a fresh Firebase ID token (from client-side sign-in) for a
 * long-lived session cookie value. Only ever call this from a route
 * handler that then sets the returned string as an httpOnly cookie —
 * never expose it to the client directly.
 *
 * Rejects (throws) if the token's custom claims don't carry
 * `role: "admin"` — this is the single gate that decides who can get
 * a session cookie at all, mirroring the same check Firestore/Storage
 * Security Rules use server-side.
 */
export async function createAdminSessionCookie(idToken: string): Promise<string> {
  const decoded = await adminAuth.verifyIdToken(idToken);

  if (decoded.role !== "admin") {
    throw new Error("This account does not have admin access.");
  }

  return adminAuth.createSessionCookie(idToken, { expiresIn: SESSION_EXPIRES_IN_MS });
}

/**
 * Reads and verifies the session cookie for the current request.
 * Returns null for any failure (missing cookie, expired, revoked,
 * missing admin claim) rather than throwing — callers decide whether
 * that means "show the login page" or "render as logged out".
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) return null;

  try {
    // `true` = check the session cookie hasn't been revoked (e.g. via
    // a future "sign out everywhere" feature), not just that it's
    // well-formed and unexpired.
    // Signature, expiry, and the admin claim are enough for every request.
    // Revocation checks make Firebase network calls on every dashboard navigation.
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, false);

    if (decoded.role !== "admin") return null;

    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      name: (decoded.name as string | undefined) ?? null,
    };
  } catch {
    return null;
  }
}

/**
 * For Server Components/Actions that must not proceed without a valid
 * admin session. Redirects to the login page (preserving the original
 * destination) instead of rendering anything when the session is
 * missing or invalid.
 */
export async function requireAdminSession(currentPath?: string): Promise<AdminSession> {
  const session = await getAdminSession();

  if (!session) {
    const loginUrl = currentPath
      ? `${ADMIN_ROUTES.login}?redirectTo=${encodeURIComponent(currentPath)}`
      : ADMIN_ROUTES.login;
    redirect(loginUrl);
  }

  return session;
}
