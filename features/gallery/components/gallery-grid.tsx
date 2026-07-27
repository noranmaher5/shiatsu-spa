"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { OptimizedImage, EmptyState } from "@/components/shared";
import { Maximize2, Sparkles } from "lucide-react";
import type { GalleryItem } from "../types";

const GalleryLightbox = dynamic(
  () => import("./gallery-lightbox").then((mod) => mod.GalleryLightbox),
  { ssr: false },
);

type GalleryGridProps = {
  items: GalleryItem[];
};

export function GalleryGrid({ items }: GalleryGridProps) {
  const locale = useLocale();
  const t = useTranslations("gallery");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (items.length === 0) {
    return <EmptyState message={t("empty")} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          const title = locale === "ar" ? item.title.ar : item.title.en;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className="group relative flex aspect-4/3 w-full items-center justify-center overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-300 hover:border-[#d6ad62]/60 hover:shadow-2xl hover:shadow-[#143725]/30 focus:outline-none focus:ring-2 focus:ring-[#d6ad62]"
            >
              <OptimizedImage
                src={item.imageUrl}
                alt={title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Glassmorphism Hover Overlay */}
              <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-3xl">
                {/* Top Badge Icon */}
                <div className="flex justify-end">
                  <div className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-white/20 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                    <Maximize2 className="size-4" />
                  </div>
                </div>

                {/* Bottom Caption Title */}
                <div className="text-start text-white">
                  {item.category && (
                    <span className="mb-1 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[#d6ad62]">
                      <Sparkles className="size-3" />
                      {item.category}
                    </span>
                  )}
                  <p className="font-serif-heading text-base font-bold tracking-tight">{title}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Luxury Lightbox Slider */}
      <GalleryLightbox
        items={items}
        currentIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onSelectIndex={(idx) => setSelectedIndex(idx)}
      />
    </>
  );
}
