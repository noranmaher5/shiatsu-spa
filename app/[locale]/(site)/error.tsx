"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";

const COPY = {
  en: {
    title: "Something went wrong",
    description:
      "We couldn't load this page. Please try again, or head back to the homepage.",
    retry: "Try Again",
    home: "Back to Home",
  },
  ar: {
    title: "حدث خطأ ما",
    description:
      "تعذر تحميل هذه الصفحة. يرجى المحاولة مرة أخرى أو العودة إلى الصفحة الرئيسية.",
    retry: "إعادة المحاولة",
    home: "العودة للرئيسية",
  },
} as const;

/**
 * Route-segment error boundary (required to be a Client Component by
 * Next.js). Catches unexpected render/data errors anywhere under the
 * (site) group so a single failing section doesn't blank the page.
 */
export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale() as "en" | "ar";
  const t = COPY[locale] ?? COPY.en;

  useEffect(() => {
    console.error("Site route error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <h1 className="font-sans text-3xl font-bold tracking-tight">{t.title}</h1>
      <p className="text-muted-foreground mt-3 text-base leading-relaxed">
        {t.description}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => reset()}>{t.retry}</Button>
        <Button variant="outline" asChild>
          <a href={`/${locale}`}>{t.home}</a>
        </Button>
      </div>
    </div>
  );
}
