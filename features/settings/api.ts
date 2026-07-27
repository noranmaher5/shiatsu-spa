import { unstable_cache } from "next/cache";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { REVALIDATE_TAGS, DEFAULT_REVALIDATE_SECONDS } from "@/lib/constants";
import type {
  HeroSettings,
  CompanySettings,
  ContactSettings,
  SocialSettings,
  SeoSettings,
  WebsiteSettings,
} from "./types";

async function getSettingsDoc<T>(id: string): Promise<T | null> {
  try {
    const snapshot = await getDoc(doc(db, "settings", id));
    if (!snapshot.exists()) return null;

    // Settings forms are Client Components. Do not pass Firestore Timestamp
    // metadata (which has a toJSON method) across the Server/Client boundary.
    const settings = { ...(snapshot.data() as Record<string, unknown>) };
    delete settings.createdAt;
    delete settings.updatedAt;
    return settings as T;
  } catch (error) {
    console.error(`Error fetching settings doc ${id}:`, error);
    return null;
  }
}

export const getHeroSettings = unstable_cache(
  () => getSettingsDoc<HeroSettings>("hero"),
  ["settings-hero"],
  { tags: [REVALIDATE_TAGS.settingsHero], revalidate: DEFAULT_REVALIDATE_SECONDS },
);

export const getCompanySettings = unstable_cache(
  () => getSettingsDoc<CompanySettings>("company"),
  ["settings-company"],
  { tags: [REVALIDATE_TAGS.settingsCompany], revalidate: DEFAULT_REVALIDATE_SECONDS },
);

export const getContactSettings = unstable_cache(
  () => getSettingsDoc<ContactSettings>("contact"),
  ["settings-contact"],
  { tags: [REVALIDATE_TAGS.settingsContact], revalidate: DEFAULT_REVALIDATE_SECONDS },
);

export const getSocialSettings = unstable_cache(
  () => getSettingsDoc<SocialSettings>("social"),
  ["settings-social"],
  { tags: [REVALIDATE_TAGS.settingsSocial], revalidate: DEFAULT_REVALIDATE_SECONDS },
);

export const getSeoSettings = unstable_cache(
  () => getSettingsDoc<SeoSettings>("seo"),
  ["settings-seo"],
  { tags: [REVALIDATE_TAGS.settingsSeo], revalidate: DEFAULT_REVALIDATE_SECONDS },
);

export const getWebsiteSettings = unstable_cache(
  () => getSettingsDoc<WebsiteSettings>("website"),
  ["settings-website"],
  { tags: [REVALIDATE_TAGS.settingsWebsite], revalidate: DEFAULT_REVALIDATE_SECONDS },
);

export const getSettingsDocAdmin = getSettingsDoc;
