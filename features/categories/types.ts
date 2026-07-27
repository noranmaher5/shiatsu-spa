import type { Bilingual, FirestoreEntity } from "@/types";

export type Category = FirestoreEntity & {
  name: Bilingual;
  slug: string;
  isActive: boolean;
};
