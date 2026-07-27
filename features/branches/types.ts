import type { Bilingual, FirestoreEntity } from "@/types";

export type Branch = FirestoreEntity & {
  name: Bilingual;
  address: Bilingual;
  phone: string;
  whatsapp: string;
  workingHours: Bilingual;
  coverImageUrl: string | null;
  googleMapsUrl: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
};
