"use client";

import { useState } from "react";
import { CheckCircle2, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { OptimizedImage } from "@/components/shared";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Testimonial } from "../types";

type TestimonialsSliderProps = {
  testimonials: Testimonial[];
  locale: string;
};

export function TestimonialsSlider({ testimonials, locale }: TestimonialsSliderProps) {
  const isRtl = locale === "ar";
  const [startIndex, setStartIndex] = useState(0);

  if (testimonials.length === 0) return null;

  const visibleCount = 3; // Show 3 reviews per view on desktop
  const maxStartIndex = Math.max(0, testimonials.length - visibleCount);

  function handlePrev() {
    setStartIndex((prev) => Math.max(0, prev - 1));
  }

  function handleNext() {
    setStartIndex((prev) => Math.min(maxStartIndex, prev + 1));
  }

  return (
    <div className="relative w-full">
      {/* Slider Controls (Next / Prev Arrows) */}
      {testimonials.length > visibleCount && (
        <div className="mb-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={isRtl ? handleNext : handlePrev}
            disabled={isRtl ? startIndex >= maxStartIndex : startIndex === 0}
            aria-label="Previous reviews"
            className="flex size-10 items-center justify-center rounded-full border border-border/80 bg-card text-foreground transition-all hover:bg-primary hover:text-white disabled:opacity-30 disabled:pointer-events-none shadow-sm"
          >
            {isRtl ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
          </button>
          <button
            type="button"
            onClick={isRtl ? handlePrev : handleNext}
            disabled={isRtl ? startIndex === 0 : startIndex >= maxStartIndex}
            aria-label="Next reviews"
            className="flex size-10 items-center justify-center rounded-full border border-border/80 bg-card text-foreground transition-all hover:bg-primary hover:text-white disabled:opacity-30 disabled:pointer-events-none shadow-sm"
          >
            {isRtl ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
          </button>
        </div>
      )}

      {/* Slider Track Container */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out gap-5"
          style={{
            transform: isRtl
              ? `translateX(${startIndex * (100 / visibleCount)}%)`
              : `translateX(-${startIndex * (100 / visibleCount)}%)`,
          }}
        >
          {testimonials.map((testimonial) => {
            const content = isRtl ? testimonial.content.ar : testimonial.content.en;
            const initial = testimonial.clientName?.trim().charAt(0).toUpperCase() || "?";

            return (
              <div
                key={testimonial.id}
                className="w-full shrink-0 md:w-[calc(50%-10px)] xl:w-[calc(33.333%-14px)]"
              >
                <Card className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-border/60 bg-card/70 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.8)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_24px_70px_-30px_rgba(197,164,103,0.28)]">
                  <CardHeader className="relative z-10 flex-row items-center justify-between pb-3">
                    <div className="flex items-center gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-4 transition-transform duration-300 group-hover:scale-105 ${
                            i < testimonial.rating
                              ? "fill-primary text-primary"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-muted-foreground text-[10px] font-semibold tracking-[0.18em] uppercase">
                      {isRtl ? "تقييم موثّق" : "Verified review"}
                    </span>
                  </CardHeader>
                  <CardContent className="relative z-10 flex flex-1 flex-col justify-between pt-2">
                    <p className="text-foreground/80 min-h-28 text-sm leading-7 whitespace-pre-line sm:text-base">
                      {content}
                    </p>
                    <div className="mt-7 flex items-center gap-3 border-t border-border/40 pt-4">
                      <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-primary/30 bg-primary/10">
                        {testimonial.avatarUrl ? (
                          <OptimizedImage
                            src={testimonial.avatarUrl}
                            alt={testimonial.clientName}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-primary font-sans text-base font-semibold">{initial}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-sans text-sm font-semibold text-foreground">{testimonial.clientName}</p>
                        <p className="text-muted-foreground mt-0.5 text-xs">
                          {isRtl ? "ضيف عزيز" : "Valued guest"}
                        </p>
                      </div>
                      <CheckCircle2 className="text-primary ms-auto size-4" aria-hidden="true" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Dots */}
      {testimonials.length > visibleCount && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: maxStartIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setStartIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                startIndex === idx ? "w-8 bg-primary" : "w-2 bg-primary/20 hover:bg-primary/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
