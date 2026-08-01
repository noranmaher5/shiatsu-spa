import type { Bilingual, OptionalBilingual, FirestoreEntity } from "@/types";

export type Article = FirestoreEntity & {
  title: Bilingual;
  slug: string;
  excerpt?: OptionalBilingual;
  content: Bilingual;
  coverImageUrl: string | null;
  author?: OptionalBilingual;
  publishedAt: string;
  metaTitle?: OptionalBilingual;
  metaDescription?: OptionalBilingual;
  isActive: boolean;
};
