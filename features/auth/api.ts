import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

/**
 * Signs in with Firebase Auth on the client, then exchanges the
 * resulting ID token for an httpOnly session cookie via our own API
 * route. Both steps must succeed — the API route re-verifies the
 * `role: "admin"` claim server-side, so a non-admin Firebase account
 * (if one ever exists) still can't get past this even though the
 * client-side sign-in itself succeeded.
 */
export async function signInAdmin(email: string, password: string): Promise<void> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await credential.user.getIdToken();

  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    // The Firebase sign-in itself succeeded but this account isn't an
    // admin (or the session route failed) — sign back out client-side
    // so the browser doesn't hold a "signed in" Firebase session that
    // has no matching server session.
    await firebaseSignOut(auth).catch(() => {});
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Unable to sign in.");
  }
}

/** Clears both the client-side Firebase session and the server session cookie. */
export async function signOutAdmin(): Promise<void> {
  await Promise.allSettled([
    firebaseSignOut(auth),
    fetch("/api/auth/session", { method: "DELETE" }),
  ]);
}
