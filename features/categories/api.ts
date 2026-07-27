import { unstable_cache } from "next/cache";
import { collection, query, where, orderBy, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createConverter, timestampToIso } from "@/lib/firebase/firestore-helpers";
import { REVALIDATE_TAGS, DEFAULT_REVALIDATE_SECONDS } from "@/lib/constants";
import type { Category } from "./types";

type CategoryDoc = Omit<Category, "id" | "createdAt" | "updatedAt"> & {
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

const categoryConverter = createConverter<CategoryDoc>();

function mapCategoryDoc(docSnapshot: { id: string; data: () => CategoryDoc }): Category {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    ...data,
    createdAt: timestampToIso(data.createdAt),
    updatedAt: timestampToIso(data.updatedAt),
  } satisfies Category;
}

async function fetchActiveCategories(): Promise<Category[]> {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, "categories").withConverter(categoryConverter),
        where("isActive", "==", true),
      ),
    );
    const categories = snapshot.docs.map(mapCategoryDoc);
    return categories.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export const getActiveCategories = unstable_cache(
  fetchActiveCategories,
  ["categories-active"],
  {
    tags: [REVALIDATE_TAGS.categories],
    revalidate: DEFAULT_REVALIDATE_SECONDS,
  },
);

async function fetchAllCategoriesAdmin(): Promise<Category[]> {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, "categories").withConverter(categoryConverter),
        orderBy("order", "asc"),
      ),
    );
    return snapshot.docs.map(mapCategoryDoc);
  } catch (error) {
    console.error("Error fetching all categories (admin):", error);
    return [];
  }
}

export const getAllCategoriesAdmin = unstable_cache(fetchAllCategoriesAdmin, ["categories-admin-all"], {
  tags: [REVALIDATE_TAGS.categories],
  revalidate: DEFAULT_REVALIDATE_SECONDS,
});
