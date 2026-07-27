import { unstable_cache } from "next/cache";
import { collection, query, where, orderBy, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createConverter, timestampToIso } from "@/lib/firebase/firestore-helpers";
import { REVALIDATE_TAGS, DEFAULT_REVALIDATE_SECONDS } from "@/lib/constants";
import type { GalleryItem } from "./types";

type GalleryItemDoc = Omit<GalleryItem, "id" | "createdAt" | "updatedAt"> & {
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

const galleryConverter = createConverter<GalleryItemDoc>();

function mapGalleryDoc(docSnapshot: { id: string; data: () => GalleryItemDoc }): GalleryItem {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    ...data,
    createdAt: timestampToIso(data.createdAt),
    updatedAt: timestampToIso(data.updatedAt),
  } satisfies GalleryItem;
}

async function fetchActiveGalleryItems(): Promise<GalleryItem[]> {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, "gallery").withConverter(galleryConverter),
        where("isActive", "==", true),
      ),
    );
    const items = snapshot.docs.map(mapGalleryDoc);
    return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    return [];
  }
}

export const getActiveGalleryItems = unstable_cache(
  fetchActiveGalleryItems,
  ["gallery-active"],
  {
    tags: [REVALIDATE_TAGS.gallery],
    revalidate: DEFAULT_REVALIDATE_SECONDS,
  },
);

async function fetchAllGalleryItemsAdmin(): Promise<GalleryItem[]> {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, "gallery").withConverter(galleryConverter),
        orderBy("order", "asc"),
      ),
    );
    return snapshot.docs.map(mapGalleryDoc);
  } catch (error) {
    console.error("Error fetching all gallery items (admin):", error);
    return [];
  }
}

export const getAllGalleryItemsAdmin = unstable_cache(
  fetchAllGalleryItemsAdmin,
  ["gallery-admin-all"],
  { tags: [REVALIDATE_TAGS.gallery], revalidate: DEFAULT_REVALIDATE_SECONDS },
);
