import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { Providers } from "@/components/providers";
import {
  getSeoSettings,
  getCompanySettings,
  getWebsiteSettings,
} from "@/features/settings/api";
import { StructuredData } from "@/components/shared/structured-data";
import { AnalyticsScripts } from "@/components/shared/analytics-scripts";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shiatsuspa.org";

const FALLBACK_TITLE: Record<Locale, string> = {
  en: "Shiatsu Spa Kuwait | Quality Touch",
  ar: "شياتسو سبا الكويت | لمسة جودة",
};

const FALLBACK_DESCRIPTION: Record<Locale, string> = {
  en: "Shiatsu Spa Kuwait — professional wellness and massage therapy services across two branches in Kuwait.",
  ar: "شياتسو سبا الكويت — خدمات علاجية ومساج احترافية عبر فرعين في الكويت.",
};

/**
 * Site-wide metadata is admin-editable via the /settings/seo Firestore
 * document (title, description, keywords, OG image, favicon per locale).
 * When that document hasn't been created yet, we fall back to the
 * static defaults above rather than rendering empty metadata tags.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = hasLocale(routing.locales, rawLocale) ? rawLocale : routing.defaultLocale;
  setRequestLocale(locale);
  const [seo, company] = await Promise.all([getSeoSettings(), getCompanySettings()]);

  const title = seo?.metaTitle?.[locale] || company?.name?.[locale] || FALLBACK_TITLE[locale];
  const description =
    seo?.metaDescription?.[locale] || company?.aboutUs?.[locale] || FALLBACK_DESCRIPTION[locale];
  const ogImage = seo?.ogImageUrl || undefined;
  const favicon = seo?.faviconUrl || "/images/logo/logo 1.png";

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${siteUrl}/${l}`]),
  );

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${company?.name?.[locale] || FALLBACK_TITLE[locale]}`,
    },
    description,
    keywords: seo?.keywords?.length ? seo.keywords : undefined,
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}`,
      siteName: company?.name?.[locale] || FALLBACK_TITLE[locale],
      locale: locale === "ar" ? "ar_KW" : "en_US",
      type: "website",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: { index: true, follow: true },
    icons: {
      icon: [{ url: favicon, type: "image/png" }],
      apple: favicon,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0D1B12",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  const direction = locale === "ar" ? "rtl" : "ltr";
  const website = await getWebsiteSettings();

  return (
    <div lang={locale} dir={direction}>
      <StructuredData locale={locale} />
      <AnalyticsScripts
        googleAnalyticsId={website?.googleAnalyticsId}
        metaPixelId={website?.metaPixelId}
      />
      <NextIntlClientProvider messages={messages}>
        <Providers>{children}</Providers>
      </NextIntlClientProvider>
    </div>
  );
}
