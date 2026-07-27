"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useLocale } from "next-intl";
import { OptimizedImage } from "@/components/shared";
import { ChevronLeft, ChevronRight, Maximize2, Sparkles } from "lucide-react";
import type { GalleryItem } from "../types";

const GalleryLightbox = dynamic(
  () => import("./gallery-lightbox").then((mod) => mod.GalleryLightbox),
  { ssr: false },
);

type GallerySliderProps = {
  items: GalleryItem[];
};

export function GallerySlider({ items }: GallerySliderProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [startIndex, setStartIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (items.length === 0) return null;

  const visibleCount = 3; // Show 3 photos at a time on desktop
  const maxStartIndex = Math.max(0, items.length - visibleCount);

  function handlePrev() {
    setStartIndex((prev) => Math.max(0, prev - 1));
  }

  function handleNext() {
    setStartIndex((prev) => Math.min(maxStartIndex, prev + 1));
  }

  return (
    <>
      <div className="relative w-full">
        {/* Slider Controls (Next / Prev Arrows) */}
        {items.length > visibleCount && (
          <div className="mb-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={isRtl ? handleNext : handlePrev}
              disabled={isRtl ? startIndex >= maxStartIndex : startIndex === 0}
              aria-label="Previous photos"
              className="flex size-10 items-center justify-center rounded-full border border-border/80 bg-card text-foreground transition-all hover:bg-primary hover:text-white disabled:opacity-30 disabled:pointer-events-none shadow-sm"
            >
              {isRtl ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
            </button>
            <button
              type="button"
              onClick={isRtl ? handlePrev : handleNext}
              disabled={isRtl ? startIndex === 0 : startIndex >= maxStartIndex}
              aria-label="Next photos"
              className="flex size-10 items-center justify-center rounded-full border border-border/80 bg-card text-foreground transition-all hover:bg-primary hover:text-white disabled:opacity-30 disabled:pointer-events-none shadow-sm"
            >
              {isRtl ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
            </button>
          </div>
        )}

        {/* Slider Track Container */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out gap-6"
            style={{
              transform: isRtl
                ? `translateX(${startIndex * (100 / visibleCount)}%)`
                : `translateX(-${startIndex * (100 / visibleCount)}%)`,
            }}
          >
            {items.map((item, index) => {
              const title = isRtl ? item.title.ar : item.title.en;

              return (
                <div
                  key={item.id}
                  className="w-full shrink-0 sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                >
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(index)}
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
                      <div className="flex justify-end">
                        <div className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-white/20 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                          <Maximize2 className="size-4" />
                        </div>
                      </div>
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
                </div>
              );
            })}
          </div>
        </div>

        {/* Pagination Dots */}
        {items.length > visibleCount && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: maxStartIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setStartIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  startIndex === idx ? "w-8 bg-[#d6ad62]" : "w-2 bg-primary/20 hover:bg-primary/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Full-Screen Lightbox Slider */}
      <GalleryLightbox
        items={items}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onSelectIndex={(idx) => setLightboxIndex(idx)}
      />
    </>
  );
}
