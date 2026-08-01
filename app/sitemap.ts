import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { PUBLIC_ROUTES } from "@/lib/constants";
import { getActiveServices } from "@/features/services/api";
import { getActiveArticles } from "@/features/articles/api";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shiatsuspa.org";

const STATIC_PATHS: string[] = [
  PUBLIC_ROUTES.home,
  PUBLIC_ROUTES.about,
  PUBLIC_ROUTES.services,
  PUBLIC_ROUTES.branches,
  PUBLIC_ROUTES.gallery,
  PUBLIC_ROUTES.articles,
  PUBLIC_ROUTES.contact,
];

/**
 * Generates one entry per static route per locale, plus one entry per
 * active service (dynamic `/services/[slug]`) per locale. Firestore is
 * the source of truth for which services exist — if it's empty or
 * unreachable, the sitemap simply omits the dynamic entries rather
 * than throwing, so the static routes still get indexed.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, articles] = await Promise.all([
    getActiveServices(),
    getActiveArticles(),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      const cleanPath = path === "/" ? "" : path;
      entries.push({
        url: `${siteUrl}/${locale}${cleanPath}`,
        lastModified: new Date(),
        changeFrequency: path === PUBLIC_ROUTES.home ? "weekly" : "monthly",
        priority: path === PUBLIC_ROUTES.home ? 1 : 0.7,
      });
    }

    for (const service of services) {
      entries.push({
        url: `${siteUrl}/${locale}${PUBLIC_ROUTES.serviceDetail(service.slug)}`,
        lastModified: service.updatedAt ? new Date(service.updatedAt) : new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }

    for (const article of articles) {
      entries.push({
        url: `${siteUrl}/${locale}${PUBLIC_ROUTES.articleDetail(article.slug)}`,
        lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(article.publishedAt),
        changeFrequency: "weekly",
        priority: 0.75,
      });
    }
  }

  return entries;
}
