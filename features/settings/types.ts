import type { Bilingual } from "@/types";

export type HeroSettings = {
  title: Bilingual;
  subtitle: Bilingual;
  buttonText: Bilingual;
  buttonLink: string;
  backgroundImageUrl: string | null;
};

export type CompanySettings = {
  name: Bilingual;
  slogan: Bilingual;
  aboutUs: Bilingual;
  vision: Bilingual;
  mission: Bilingual;
};

export type ContactSettings = {
  phones: string[];
  whatsapp: string;
  email: string;
};

export type SocialSettings = {
  instagram: string | null;
  snapchat: string | null;
  tiktok: string | null;
  twitter: string | null;
  facebook: string | null;
  website: string | null;
};

export type SeoSettings = {
  metaTitle: Bilingual;
  metaDescription: Bilingual;
  keywords: string[];
  ogImageUrl: string | null;
  faviconUrl: string | null;
};

export type WebsiteSettings = {
  googleAnalyticsId: string | null;
  metaPixelId: string | null;
  businessHours: Bilingual;
  emergencyContact: string | null;
  logoUrl: string | null;
};
