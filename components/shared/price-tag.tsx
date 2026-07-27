"use client";

import { useLocale } from "next-intl";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function PriceTag({ price, className }: { price: number; className?: string }) {
  const locale = useLocale();

  return (
    <span className={cn("text-primary font-sans font-semibold", className)}>
      {formatPrice(price, locale === "ar" ? "ar" : "en")}
    </span>
  );
}
