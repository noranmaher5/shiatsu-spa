import { defineRouting } from "next-intl/routing";

/**
 * The approved architecture specifies locale-prefixed routing for BOTH
 * locales (/en/..., /ar/...) — localePrefix "always" (not "as-needed")
 * so every URL is explicit and consistent, which also avoids any
 * ambiguity for SEO (one canonical URL per locale, no bare "/" that
 * could resolve to either language).
 *
 * Arabic is the default locale (the client's primary market), used when
 * a visitor's Accept-Language header doesn't match a supported locale.
 */
export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
