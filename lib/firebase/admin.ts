import "server-only";
import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

/**
 * `server-only` (Next.js's package) makes this file throw a build-time
 * error if anything in a Client Component's bundle ever imports it —
 * this is the safety net that turns "accidentally leaked the service
 * account key" into a build failure instead of a production incident.
 *
 * Used by:
 * - the admin dashboard's server actions/API routes (privileged writes,
 *   e.g. setting the custom `role: "admin"` claim)
 * - the /api/revalidate route (verifying the caller before revalidating)
 * - the seed script (scripts/seed.ts, run with `tsx`, never bundled)
 */
function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  // Private keys in .env files store literal "\n" — must be converted back
  // to real newlines or the PEM key fails to parse.
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin SDK env vars (FIREBASE_ADMIN_PROJECT_ID, " +
        "FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY). " +
        "These come from the service account JSON — see .env.example.",
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const adminApp = getAdminApp();

export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);
export const adminStorage = getStorage(adminApp);
