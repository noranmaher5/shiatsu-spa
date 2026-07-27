"use client";

import { useEffect, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { OptimizedImage } from "@/components/shared";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, Sparkles } from "lucide-react";
import type { GalleryItem } from "../types";

type GalleryLightboxProps = {
  items: GalleryItem[];
  currentIndex: number | null;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
};

export function GalleryLightbox({
  items,
  currentIndex,
  onClose,
  onSelectIndex,
}: GalleryLightboxProps) {
  const locale = useLocale();
  const t = useTranslations("common");
  const isRtl = locale === "ar";

  const isOpen = currentIndex !== null && currentIndex >= 0 && currentIndex < items.length;
  const currentItem = isOpen ? items[currentIndex] : null;

  const handlePrev = useCallback(() => {
    if (currentIndex === null || items.length === 0) return;
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    onSelectIndex(prevIndex);
  }, [currentIndex, items.length, onSelectIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex === null || items.length === 0) return;
    const nextIndex = (currentIndex + 1) % items.length;
    onSelectIndex(nextIndex);
  }, [currentIndex, items.length, onSelectIndex]);

  // Keyboard arrow & Escape navigation
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        if (isRtl) handleNext();
        else handlePrev();
      } else if (e.key === "ArrowRight") {
        if (isRtl) handlePrev();
        else handleNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose, isRtl]);

  if (!currentItem || currentIndex === null) return null;

  const title = isRtl ? currentItem.title.ar : currentItem.title.en;
  const counterText = isRtl
    ? `صورة ${currentIndex + 1} من ${items.length}`
    : `Image ${currentIndex + 1} of ${items.length}`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        closeLabel={t("close")}
        hideCloseButton={true}
        className="fixed left-[50%] top-[50%] z-50 flex w-[calc(100vw-2rem)] max-w-3xl sm:max-w-4xl max-h-[85vh] translate-x-[-50%] translate-y-[-50%] flex-col justify-between rounded-3xl border border-[#d6ad62]/40 bg-[#0d1b12]/95 p-4 sm:p-6 text-white shadow-2xl backdrop-blur-2xl overflow-hidden"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Top Header Bar: Counter & Single Close Button */}
        <div className="flex w-full items-center justify-between pb-3 border-b border-white/10">
          {/* Photo Counter Badge */}
          <div className="flex items-center gap-2 rounded-full border border-[#d6ad62]/30 bg-[#d6ad62]/10 px-3.5 py-1 backdrop-blur-md">
            <Sparkles className="size-3.5 text-[#d6ad62]" />
            <span className="font-sans text-xs font-semibold tracking-wider text-[#d6ad62]">
              {counterText}
            </span>
          </div>

          {/* SINGLE Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 transition-all hover:bg-red-600 hover:text-white hover:border-red-500"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Middle Area: Next/Prev Arrows + Image Frame */}
        <div className="relative flex flex-1 items-center justify-center gap-2 sm:gap-4 py-4 min-h-[50vh]">
          {/* Previous Arrow Button */}
          {items.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
              className="z-20 flex size-10 sm:size-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white transition-all hover:scale-110 hover:bg-[#143725] hover:border-[#d6ad62] active:scale-95 shadow-xl"
            >
              {isRtl ? <ChevronRight className="size-5 sm:size-6" /> : <ChevronLeft className="size-5 sm:size-6" />}
            </button>
          )}

          {/* Photo Display Frame - Well proportioned & fill-fitted */}
          <div className="relative flex flex-1 h-[48vh] sm:h-[54vh] w-full items-center justify-center overflow-hidden rounded-2xl bg-black/40 border border-white/10 p-1">
            <OptimizedImage
              key={currentItem.id}
              src={currentItem.imageUrl}
              alt={title}
              fill
              sizes="(max-width: 1280px) 90vw, 1000px"
              priority
              className="object-contain transition-all duration-300 rounded-xl select-none"
            />
          </div>

          {/* Next Arrow Button */}
          {items.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="z-20 flex size-10 sm:size-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white transition-all hover:scale-110 hover:bg-[#143725] hover:border-[#d6ad62] active:scale-95 shadow-xl"
            >
              {isRtl ? <ChevronLeft className="size-5 sm:size-6" /> : <ChevronRight className="size-5 sm:size-6" />}
            </button>
          )}
        </div>

        {/* Bottom Caption Bar */}
        <div className="pt-3 border-t border-white/10 text-center">
          <div className="mx-auto max-w-xl">
            {currentItem.category && (
              <span className="mb-1 inline-block rounded-full border border-[#d6ad62]/40 bg-[#d6ad62]/20 px-3 py-0.5 text-[11px] font-semibold text-[#d6ad62]">
                {currentItem.category}
              </span>
            )}
            <h3 className="font-serif-heading text-base sm:text-lg font-bold text-white tracking-tight">
              {title}
            </h3>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
