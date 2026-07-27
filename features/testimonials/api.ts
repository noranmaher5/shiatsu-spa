import { unstable_cache } from "next/cache";
import { collection, query, where, orderBy, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createConverter, timestampToIso } from "@/lib/firebase/firestore-helpers";
import { REVALIDATE_TAGS, DEFAULT_REVALIDATE_SECONDS } from "@/lib/constants";
import type { Testimonial } from "./types";

type TestimonialDoc = Omit<Testimonial, "id" | "createdAt" | "updatedAt"> & {
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

const testimonialConverter = createConverter<TestimonialDoc>();

function mapTestimonialDoc(docSnapshot: {
  id: string;
  data: () => TestimonialDoc;
}): Testimonial {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    ...data,
    createdAt: timestampToIso(data.createdAt),
    updatedAt: timestampToIso(data.updatedAt),
  } satisfies Testimonial;
}

async function fetchActiveTestimonials(): Promise<Testimonial[]> {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, "testimonials").withConverter(testimonialConverter),
        where("isActive", "==", true),
      ),
    );
    const testimonials = snapshot.docs.map(mapTestimonialDoc);
    return testimonials.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}

export const getActiveTestimonials = unstable_cache(
  fetchActiveTestimonials,
  ["testimonials-active"],
  {
    tags: [REVALIDATE_TAGS.testimonials],
    revalidate: DEFAULT_REVALIDATE_SECONDS,
  },
);

async function fetchAllTestimonialsAdmin(): Promise<Testimonial[]> {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, "testimonials").withConverter(testimonialConverter),
        orderBy("order", "asc"),
      ),
    );
    return snapshot.docs.map(mapTestimonialDoc);
  } catch (error) {
    console.error("Error fetching all testimonials (admin):", error);
    return [];
  }
}

export const getAllTestimonialsAdmin = unstable_cache(
  fetchAllTestimonialsAdmin,
  ["testimonials-admin-all"],
  { tags: [REVALIDATE_TAGS.testimonials], revalidate: DEFAULT_REVALIDATE_SECONDS },
);
