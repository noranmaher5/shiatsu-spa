import type { Bilingual, FirestoreEntity } from "@/types";

export type FaqItem = FirestoreEntity & {
  question: Bilingual;
  answer: Bilingual;
  category?: string;
  isActive: boolean;
};
