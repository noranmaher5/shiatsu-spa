import { unstable_cache } from "next/cache";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createConverter, timestampToIso } from "@/lib/firebase/firestore-helpers";
import { REVALIDATE_TAGS, DEFAULT_REVALIDATE_SECONDS } from "@/lib/constants";
import type { Service } from "./types";

type ServiceDoc = Omit<Service, "id" | "createdAt" | "updatedAt"> & {
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

const serviceConverter = createConverter<ServiceDoc>();

function mapServiceDoc(docSnapshot: { id: string; data: () => ServiceDoc }): Service {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    ...data,
    createdAt: timestampToIso(data.createdAt),
    updatedAt: timestampToIso(data.updatedAt),
  } satisfies Service;
}

async function fetchActiveServices(): Promise<Service[]> {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, "services").withConverter(serviceConverter),
        where("isActive", "==", true),
      ),
    );
    const services = snapshot.docs.map(mapServiceDoc);
    return services.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (error) {
    console.error("Error fetching active services:", error);
    return [];
  }
}

async function fetchFeaturedServices(): Promise<Service[]> {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, "services").withConverter(serviceConverter),
        where("isActive", "==", true),
        where("isFeatured", "==", true),
      ),
    );
    const services = snapshot.docs.map(mapServiceDoc);
    return services.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (error) {
    console.error("Error fetching featured services:", error);
    return [];
  }
}

async function fetchServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, "services").withConverter(serviceConverter),
        where("slug", "==", slug),
        where("isActive", "==", true),
      ),
    );
    const match = snapshot.docs[0];
    return match ? mapServiceDoc(match) : null;
  } catch (error) {
    console.error(`Error fetching service by slug ${slug}:`, error);
    return null;
  }
}

export const getActiveServices = unstable_cache(
  fetchActiveServices,
  ["services-active"],
  {
    tags: [REVALIDATE_TAGS.services],
    revalidate: DEFAULT_REVALIDATE_SECONDS,
  },
);

export const getFeaturedServices = unstable_cache(
  fetchFeaturedServices,
  ["services-featured"],
  {
    tags: [REVALIDATE_TAGS.services],
    revalidate: DEFAULT_REVALIDATE_SECONDS,
  },
);

export const getServiceBySlug = (slug: string) =>
  unstable_cache(
    () => fetchServiceBySlug(slug),
    [`service-detail-${slug}`],
    {
      tags: [REVALIDATE_TAGS.serviceDetail(slug), REVALIDATE_TAGS.services],
      revalidate: DEFAULT_REVALIDATE_SECONDS,
    },
  )();

async function fetchAllServicesAdmin(): Promise<Service[]> {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, "services").withConverter(serviceConverter),
        orderBy("order", "asc"),
      ),
    );
    return snapshot.docs.map(mapServiceDoc);
  } catch (error) {
    console.error("Error fetching all services (admin):", error);
    return [];
  }
}

export const getAllServicesAdmin = unstable_cache(fetchAllServicesAdmin, ["services-admin-all"], {
  tags: [REVALIDATE_TAGS.services],
  revalidate: DEFAULT_REVALIDATE_SECONDS,
});

export async function getServiceByIdAdmin(id: string): Promise<Service | null> {
  try {
    const snapshot = await getDoc(doc(db, "services", id).withConverter(serviceConverter));
    if (!snapshot.exists()) return null;
    return mapServiceDoc(snapshot);
  } catch (error) {
    console.error(`Error fetching service ${id} (admin):`, error);
    return null;
  }
}
