import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

/**
 * Firebase's client config (apiKey, authDomain, etc.) is NOT a secret —
 * it identifies the project, and access is enforced by Firestore/Storage
 * Security Rules, not by hiding this object. That's why these are
 * NEXT_PUBLIC_* — they're meant to ship to the browser.
 *
 * The Firebase ADMIN SDK (service account credentials) is a completely
 * separate, server-only file: lib/firebase/admin.ts. Never import that
 * file from a Client Component.
 */
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function assertFirebaseConfig(config: FirebaseOptions): void {
  const missing = Object.entries(config).filter(([, value]) => !value);
  if (missing.length > 0) {
    throw new Error(
      `Missing Firebase client env vars: ${missing.map(([key]) => key).join(", ")}. ` +
        "Check .env.local against .env.example.",
    );
  }
}

assertFirebaseConfig(firebaseConfig);

// getApps()/getApp() guard against re-initializing during Next.js's
// hot-reload in development, which would otherwise throw.
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);
