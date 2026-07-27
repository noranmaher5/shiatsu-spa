import { getLocale, getTranslations } from "next-intl/server";
import { Star } from "lucide-react";
import { getActiveTestimonials } from "../api";
import { EmptyState, FadeIn } from "@/components/shared";
import { TestimonialsSlider } from "./testimonials-slider";

export async function TestimonialsSection() {
  const locale = await getLocale();
  const tHome = await getTranslations("home");
  const testimonials = await getActiveTestimonials();

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="relative overflow-hidden border-y border-border/40 bg-background px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="pointer-events-none absolute -top-32 start-1/4 size-80 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-40 end-0 size-96 rounded-full bg-brand-olive/20 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl">
        <FadeIn>
          <div className="mb-12 flex flex-col gap-8 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="font-script-title text-primary mb-2 text-2xl sm:text-3xl">
                {locale === "ar" ? "تجارب ضيوفنا" : "Guest experiences"}
              </p>
              <h2
                id="testimonials-heading"
                className="font-serif-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
              >
                {tHome("testimonials.heading")}
              </h2>
              <div className="mt-5 h-0.5 w-14 bg-primary/70" aria-hidden="true" />
              <p className="text-foreground/70 mt-5 max-w-xl text-base leading-relaxed">
                {tHome("testimonials.subheading")}
              </p>
            </div>

            <div className="flex w-fit items-center gap-4 rounded-2xl border border-primary/25 bg-card/70 px-5 py-4 shadow-card backdrop-blur-sm">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                <Star className="size-6 fill-primary text-primary" aria-hidden="true" />
              </div>
              <div>
                <p className="font-serif-heading text-2xl font-bold text-foreground">5.0/5</p>
                <p className="text-muted-foreground text-xs tracking-wide uppercase">
                  {locale === "ar" ? "تقييم الضيوف" : "Guest rating"}
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        {testimonials.length === 0 ? (
          <EmptyState message={tHome("testimonials.empty")} />
        ) : (
          <FadeIn delay={0.1}>
            <TestimonialsSlider testimonials={testimonials} locale={locale} />
          </FadeIn>
        )}
      </div>
    </section>
  );
}
