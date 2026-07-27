// Client SDK — safe for Client Components.
export { firebaseApp, db, auth, storage } from "./client";

// Firestore helpers — safe everywhere (pure functions, no credentials).
export { createConverter, timestampToIso } from "./firestore-helpers";

// NOTE: lib/firebase/admin.ts is intentionally NOT re-exported here.
// Import it directly (`@/lib/firebase/admin`) only from server-only
// code (API routes, server actions, scripts) so its `server-only`
// import guard stays meaningful — barreling it here would make it
// too easy to accidentally pull into a client bundle via this file.
