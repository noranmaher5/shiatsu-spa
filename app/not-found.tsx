import { routing } from "@/i18n/routing";

/**
 * Root-level fallback. In normal operation, next-intl's middleware
 * redirects every request to a locale-prefixed path before it ever
 * reaches this file, so localized 404s are handled by
 * `app/[locale]/(site)/not-found.tsx` instead. This file only
 * catches the rare edge case of a request bypassing the middleware
 * matcher entirely (e.g. a malformed URL).
 */
export default function RootNotFound() {
  return (
    <html lang={routing.defaultLocale}>
      <body>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "sans-serif",
            textAlign: "center",
            padding: "1rem",
          }}
        >
          <h1>404 — Page Not Found</h1>
          <p>
            <a href={`/${routing.defaultLocale}`}>Back to Home</a>
          </p>
        </div>
      </body>
    </html>
  );
}
