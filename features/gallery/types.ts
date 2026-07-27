import type { Bilingual, FirestoreEntity } from "@/types";

export type GalleryItem = FirestoreEntity & {
  title: Bilingual;
  imageUrl: string;
  category?: string;
  isActive: boolean;
};
