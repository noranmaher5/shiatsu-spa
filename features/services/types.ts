import type { Bilingual, OptionalBilingual, FirestoreEntity } from "@/types";

export type Service = FirestoreEntity & {
  name: Bilingual;
  slug: string;
  shortDescription?: OptionalBilingual;
  description: Bilingual;
  price: number;
  durationMinutes: number;
  categoryId: string;
  categoryName?: Bilingual;
  imageUrl: string | null;
  isFeatured: boolean;
  isActive: boolean;
};
