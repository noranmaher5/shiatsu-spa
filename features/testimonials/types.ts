import type { Bilingual, FirestoreEntity } from "@/types";

export type Testimonial = FirestoreEntity & {
  clientName: string;
  content: Bilingual;
  rating: number;
  avatarUrl?: string | null;
  isActive: boolean;
};
