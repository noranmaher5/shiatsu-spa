import { getTranslations } from "next-intl/server";
import { getActiveGalleryItems } from "../api";
import { GallerySlider } from "./gallery-slider";
import { EmptyState, FadeIn } from "@/components/shared";
import { Link } from "@/i18n/navigation";
import { PUBLIC_ROUTES } from "@/lib/constants";

export async function GallerySection() {
  const tNav = await getTranslations("nav");
  const tHome = await getTranslations("home");
  const tGallery = await getTranslations("gallery");
  const items = await getActiveGalleryItems();

  return (
    <section
      aria-labelledby="gallery-heading"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
    >
      <FadeIn>
        <div className="mb-12 flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
          <div className="text-center sm:text-start">
            <h2
              id="gallery-heading"
              className="font-serif-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              {tHome("gallery.heading")}
            </h2>
            <div className="mx-auto mt-4 h-0.5 w-12 bg-primary/60 sm:mx-0" aria-hidden="true" />
            <p className="text-foreground/80 mt-4 max-w-xl text-base leading-relaxed">
              {tHome("gallery.subheading")}
            </p>
          </div>
          <Link
            href={PUBLIC_ROUTES.gallery}
            className="group flex shrink-0 items-center gap-2 rounded-full border border-primary/30 px-6 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            {tNav("gallery")}
            <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
          </Link>
        </div>
      </FadeIn>

      {items.length === 0 ? (
        <EmptyState message={tGallery("empty")} />
      ) : (
        <FadeIn delay={0.1}>
          <GallerySlider items={items} />
        </FadeIn>
      )}
    </section>
  );
}
