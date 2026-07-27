import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
} from "firebase/firestore";

/**
 * Builds a strongly-typed Firestore converter for a given entity type.
 *
 * Firestore's raw SDK returns `DocumentData` (effectively `any`) from
 * every read. Without a converter, every feature ends up either
 * casting with `as Service` (unsafe — no validation) or duplicating
 * this mapping logic. `withConverter(createConverter<Service>())`
 * gives typed reads AND writes in one place per collection.
 *
 * `T` must NOT include `id` — the id comes from the document snapshot,
 * not from the document's own field data, so we never have to keep an
 * `id` field in sync with the document path.
 */
export function createConverter<T extends DocumentData>(): FirestoreDataConverter<
  T & { id: string }
> {
  return {
    toFirestore(data: T & { id: string }): DocumentData {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = data;
      return rest;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): T & { id: string } {
      return {
        id: snapshot.id,
        ...(snapshot.data() as T),
      };
    },
  };
}

/**
 * Every Firestore document in this project uses Timestamp for
 * createdAt/updatedAt. This helper converts one to a plain ISO string
 * for Server Components, which cannot serialize Firestore's Timestamp
 * class across the server/client boundary.
 */
export function timestampToIso(timestamp: Timestamp | undefined | null): string | null {
  return timestamp ? timestamp.toDate().toISOString() : null;
}
