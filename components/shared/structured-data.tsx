import { getCompanySettings, getContactSettings, getSocialSettings } from "@/features/settings/api";
import type { Locale } from "@/i18n/routing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shiatsuspa.org";

/**
 * Renders a lightweight JSON-LD snippet for the business. We intentionally
 * keep this minimal to avoid extra Firestore reads during every page render.
 */
export async function StructuredData({ locale }: { locale: Locale }) {
  const [company, contact, social] = await Promise.all([
    getCompanySettings(),
    getContactSettings(),
    getSocialSettings(),
  ]);

  const name = company?.name?.[locale] || "Shiatsu Spa Kuwait";
  const description = company?.aboutUs?.[locale] || undefined;

  const sameAs = social
    ? Object.values(social).filter((url): url is string => Boolean(url))
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    "@id": `${siteUrl}/#business`,
    name,
    description,
    url: siteUrl,
    telephone: contact?.phones?.[0] || undefined,
    email: contact?.email || undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
