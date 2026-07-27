import { unstable_cache } from "next/cache";
import { collection, query, where, orderBy, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createConverter, timestampToIso } from "@/lib/firebase/firestore-helpers";
import { REVALIDATE_TAGS, DEFAULT_REVALIDATE_SECONDS } from "@/lib/constants";
import type { FaqItem } from "./types";

type FaqItemDoc = Omit<FaqItem, "id" | "createdAt" | "updatedAt"> & {
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

const faqConverter = createConverter<FaqItemDoc>();

function mapFaqDoc(docSnapshot: { id: string; data: () => FaqItemDoc }): FaqItem {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    ...data,
    createdAt: timestampToIso(data.createdAt),
    updatedAt: timestampToIso(data.updatedAt),
  } satisfies FaqItem;
}

async function fetchActiveFaqs(): Promise<FaqItem[]> {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, "faq").withConverter(faqConverter),
        where("isActive", "==", true),
      ),
    );
    const faqs = snapshot.docs.map(mapFaqDoc);
    return faqs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
}

export const getActiveFaqs = unstable_cache(
  fetchActiveFaqs,
  ["faq-active"],
  {
    tags: [REVALIDATE_TAGS.faq],
    revalidate: DEFAULT_REVALIDATE_SECONDS,
  },
);

async function fetchAllFaqsAdmin(): Promise<FaqItem[]> {
  try {
    const snapshot = await getDocs(
      query(collection(db, "faq").withConverter(faqConverter), orderBy("order", "asc")),
    );
    return snapshot.docs.map(mapFaqDoc);
  } catch (error) {
    console.error("Error fetching all FAQs (admin):", error);
    return [];
  }
}

export const getAllFaqsAdmin = unstable_cache(fetchAllFaqsAdmin, ["faq-admin-all"], {
  tags: [REVALIDATE_TAGS.faq],
  revalidate: DEFAULT_REVALIDATE_SECONDS,
});
