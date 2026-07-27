import { unstable_cache } from "next/cache";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createConverter, timestampToIso } from "@/lib/firebase/firestore-helpers";
import { REVALIDATE_TAGS, DEFAULT_REVALIDATE_SECONDS } from "@/lib/constants";
import type { Branch } from "./types";

const LEGACY_BRANCH_CONTENT: Record<string, {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}> = {
  "+96560074005": {
    name: "Sabah Al Salem Branch",
    address: "Sabah Al Salem, Orange Tower, opposite Oxygen Club",
    latitude: 29.26675,
    longitude: 48.083008,
  },
  "+96566555297": {
    name: "Al Riqqa Branch",
    address: "Al Riqqa, Fourth Ring Road, next to Oxygen Club",
    latitude: 29.3094167,
    longitude: 47.9163324,
  },
};

type BranchDoc = Omit<Branch, "id" | "createdAt" | "updatedAt"> & {
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

const branchConverter = createConverter<BranchDoc>();

function mapBranchDoc(docSnapshot: { id: string; data: () => BranchDoc }): Branch {
  const data = docSnapshot.data();
  const legacy = LEGACY_BRANCH_CONTENT[data.phone];
  const hasPlaceholderEnglish = data.name.en.includes("TODO") || data.address.en.includes("TODO");
  return {
    id: docSnapshot.id,
    ...data,
    ...(legacy && hasPlaceholderEnglish
      ? {
          name: { ...data.name, en: legacy.name },
          address: { ...data.address, en: legacy.address },
        }
      : {}),
    ...(legacy && (data.latitude == null || data.longitude == null)
      ? { latitude: legacy.latitude, longitude: legacy.longitude }
      : {}),
    createdAt: timestampToIso(data.createdAt),
    updatedAt: timestampToIso(data.updatedAt),
  } satisfies Branch;
}

async function fetchActiveBranches(): Promise<Branch[]> {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, "branches").withConverter(branchConverter),
        where("isActive", "==", true),
      ),
    );
    const branches = snapshot.docs.map(mapBranchDoc);
    return branches.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (error) {
    console.error("Error fetching active branches:", error);
    return [];
  }
}

export const getActiveBranches = unstable_cache(
  fetchActiveBranches,
  ["branches-active"],
  {
    tags: [REVALIDATE_TAGS.branches],
    revalidate: DEFAULT_REVALIDATE_SECONDS,
  },
);

async function fetchAllBranchesAdmin(): Promise<Branch[]> {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, "branches").withConverter(branchConverter),
        orderBy("order", "asc"),
      ),
    );
    return snapshot.docs.map(mapBranchDoc);
  } catch (error) {
    console.error("Error fetching all branches (admin):", error);
    return [];
  }
}

export const getAllBranchesAdmin = unstable_cache(fetchAllBranchesAdmin, ["branches-admin-all"], {
  tags: [REVALIDATE_TAGS.branches],
  revalidate: DEFAULT_REVALIDATE_SECONDS,
});
