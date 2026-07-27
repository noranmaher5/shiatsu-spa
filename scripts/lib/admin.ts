/**
 * Firebase Admin SDK bootstrap for standalone scripts (e.g.
 * `scripts/seed.ts`), run with `tsx` outside of Next.js.
 *
 * This intentionally does NOT import `lib/firebase/admin.ts`: that
 * file imports the `server-only` marker package, which is a no-op
 * under webpack/Next's "react-server" export condition but
 * unconditionally throws under plain Node (which is what `tsx` uses)
 * — see node_modules/server-only/index.js. Rather than weaken that
 * safety net for the actual app code, this script gets its own
 * minimal Admin SDK init that mirrors the same env vars and `cert()`
 * pattern as lib/firebase/admin.ts, so the two stay in sync in spirit
 * without either depending on the other.
 */
import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  // Private keys in .env files store literal "\n" — must be converted
  // back to real newlines or the PEM key fails to parse.
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin SDK env vars (FIREBASE_ADMIN_PROJECT_ID, " +
        "FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY). " +
        "These come from the service account JSON — see .env.example. " +
        "Make sure .env.local exists and is filled in before running `npm run seed`.",
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

export const adminDb = getFirestore(getAdminApp());
export const adminAuth = getAuth(getAdminApp());
