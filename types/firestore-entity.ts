/**
 * Common shape shared by every top-level Firestore document in this
 * project. Feature-specific types (e.g. `Service` in
 * features/services/types.ts) extend this rather than repeating these
 * fields on every entity.
 */
export type FirestoreEntity = {
  id: string;
  order: number;
  createdAt: string | null; // ISO string — see timestampToIso()
  updatedAt: string | null;
};
