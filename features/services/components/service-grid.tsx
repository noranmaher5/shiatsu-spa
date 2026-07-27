"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { EmptyState } from "@/components/shared";
import { ServiceCard } from "./service-card";
import type { Service } from "../types";
import type { Category } from "@/features/categories/types";

type ServiceGridProps = {
  services: Service[];
  categories: Category[];
  whatsappPhone?: string;
};

const CATEGORY_NAMES_AR: Record<string, string> = {
  massage: "المساج",
  "head-face": "الرأس والوجه",
  "feet-care": "العناية بالقدمين",
  "cupping-therapy": "العلاج بالحجامة",
  baths: "الحمامات",
  facial: "العناية بالبشرة",
};

export function ServiceGrid({
  services,
  categories,
  whatsappPhone,
}: ServiceGridProps) {
  const locale = useLocale();
  const t = useTranslations("services");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const filteredServices = selectedCategoryId
    ? services.filter((s) => s.categoryId === selectedCategoryId)
    : services;

  if (services.length === 0) {
    return <EmptyState message={t("noServices")} />;
  }

  return (
    <div className="space-y-8">
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
              selectedCategoryId === null
                ? "border-primary bg-primary text-primary-foreground shadow-soft"
                : "border-border/60 bg-secondary/50 text-foreground hover:border-primary/40 hover:bg-secondary"
            }`}
          >
            {t("allCategories")}
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
              selectedCategoryId === category.id
                ? "border-primary bg-primary text-primary-foreground shadow-soft"
                : "border-border/60 bg-secondary/50 text-foreground hover:border-primary/40 hover:bg-secondary"
            }`}
          >
              {locale === "ar"
                ? CATEGORY_NAMES_AR[category.slug] ?? category.name.ar
                : category.name.en}
            </button>
          ))}
        </div>
      )}

      {filteredServices.length === 0 ? (
        <EmptyState message={t("noServicesInCategory")} />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              whatsappPhone={whatsappPhone}
              variant="featured"
            />
          ))}
        </div>
      )}
    </div>
  );
}
