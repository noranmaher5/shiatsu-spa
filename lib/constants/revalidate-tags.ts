/**
 * Cache tags used with Next.js's `fetch(..., { next: { tags: [...] } })`
 * or `revalidateTag()`. Each public page that reads a collection tags
 * its fetch with the matching constant; the admin save flow calls
 * `revalidateTag()` with the same constant after a successful write.
 */
export const REVALIDATE_TAGS = {
  services: "services",
  serviceDetail: (slug: string) => `service:${slug}`,
  categories: "categories",
  branches: "branches",
  gallery: "gallery",
  faq: "faq",
  testimonials: "testimonials",
  settingsHero: "settings:hero",
  settingsCompany: "settings:company",
  settingsContact: "settings:contact",
  settingsSocial: "settings:social",
  settingsSeo: "settings:seo",
  settingsWebsite: "settings:website",
} as const;
