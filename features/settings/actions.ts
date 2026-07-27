"use server";

import { FieldValue } from "firebase-admin/firestore";
import { revalidateTag } from "next/cache";
import { adminDb } from "@/lib/firebase/admin";
import { getAdminSession } from "@/lib/auth/session";
import { REVALIDATE_TAGS } from "@/lib/constants";
import { actionErrorMessage, type ActionResult } from "@/lib/actions/types";
import { heroSettingsSchema, type HeroSettingsFormValues } from "./schemas/hero";
import { companySettingsSchema, type CompanySettingsFormValues } from "./schemas/company";
import { contactSettingsSchema, type ContactSettingsFormValues } from "./schemas/contact";
import { socialSettingsSchema, type SocialSettingsFormData } from "./schemas/social";
import { seoSettingsSchema, type SeoSettingsFormValues } from "./schemas/seo";
import { websiteSettingsSchema, type WebsiteSettingsFormData } from "./schemas/website";

/**
 * Every settings doc is a singleton (`/settings/{id}`) that may not
 * exist yet on a fresh project, so every save uses `set(..., {merge:
 * true})` (upsert) rather than `update()`, which would throw
 * "document not found" the first time an admin saves a given form.
 */
async function saveSettingsDoc(
  id: string,
  data: Record<string, unknown>,
  tag: string,
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: "Not authenticated." };

  await adminDb
    .collection("settings")
    .doc(id)
    .set({ ...data, updatedAt: FieldValue.serverTimestamp() }, { merge: true });

  // The Firestore write is the source of truth. Some hosting/dev runtimes
  // do not expose Next's incremental cache store to server actions; in that
  // case revalidation can throw after the write already succeeded. Do not
  // turn a successful save into a failed page request.
  try {
    revalidateTag(tag);
  } catch (error) {
    console.warn(`Could not revalidate settings cache for ${id}:`, error);
  }
  return { success: true };
}

export async function updateHeroSettings(values: HeroSettingsFormValues): Promise<ActionResult> {
  try {
    const data = heroSettingsSchema.parse(values);
    return await saveSettingsDoc("hero", data, REVALIDATE_TAGS.settingsHero);
  } catch (error) {
    console.error("updateHeroSettings failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to save hero settings.") };
  }
}

export async function updateCompanySettings(
  values: CompanySettingsFormValues,
): Promise<ActionResult> {
  try {
    const data = companySettingsSchema.parse(values);
    const result = await saveSettingsDoc("company", data, REVALIDATE_TAGS.settingsCompany);
    // metaTitle/description on the SEO page fall back to company name/aboutUs
    // when unset, and StructuredData reads company name directly.
    revalidateTag(REVALIDATE_TAGS.settingsSeo);
    return result;
  } catch (error) {
    console.error("updateCompanySettings failed:", error);
    return {
      success: false,
      error: actionErrorMessage(error, "Failed to save company settings."),
    };
  }
}

export async function updateContactSettings(
  values: ContactSettingsFormValues,
): Promise<ActionResult> {
  try {
    const data = contactSettingsSchema.parse(values);
    return await saveSettingsDoc("contact", data, REVALIDATE_TAGS.settingsContact);
  } catch (error) {
    console.error("updateContactSettings failed:", error);
    return {
      success: false,
      error: actionErrorMessage(error, "Failed to save contact settings."),
    };
  }
}

export async function updateSocialSettings(
  values: SocialSettingsFormData,
): Promise<ActionResult> {
  try {
    const data = socialSettingsSchema.parse(values);
    return await saveSettingsDoc("social", data, REVALIDATE_TAGS.settingsSocial);
  } catch (error) {
    console.error("updateSocialSettings failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to save social links.") };
  }
}

export async function updateSeoSettings(values: SeoSettingsFormValues): Promise<ActionResult> {
  try {
    const data = seoSettingsSchema.parse(values);
    return await saveSettingsDoc("seo", data, REVALIDATE_TAGS.settingsSeo);
  } catch (error) {
    console.error("updateSeoSettings failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to save SEO settings.") };
  }
}

export async function updateWebsiteSettings(
  values: WebsiteSettingsFormData,
): Promise<ActionResult> {
  try {
    const data = websiteSettingsSchema.parse(values);
    return await saveSettingsDoc("website", data, REVALIDATE_TAGS.settingsWebsite);
  } catch (error) {
    console.error("updateWebsiteSettings failed:", error);
    return {
      success: false,
      error: actionErrorMessage(error, "Failed to save website settings."),
    };
  }
}
