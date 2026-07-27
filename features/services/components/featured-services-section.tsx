import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { getFeaturedServices } from "../api";
import { getContactSettings } from "@/features/settings/api";
import { ServiceCard } from "./service-card";
import { EmptyState, FadeIn } from "@/components/shared";
import { Link } from "@/i18n/navigation";
import { PUBLIC_ROUTES } from "@/lib/constants";

export async function FeaturedServicesSection() {
  const tCommon = await getTranslations("common");
  const tHome = await getTranslations("home");
  const [services, contact] = await Promise.all([
    getFeaturedServices(),
    getContactSettings(),
  ]);

  const whatsappPhone = contact?.whatsapp || "96500000000";
  const featuredServices = services.slice(0, 4);

  return (
    <section
      aria-labelledby="featured-services-heading"
      className="bg-brand-dark border-border/30 border-y py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mb-14 text-center">
            <p className="font-script-title text-foreground/90 text-2xl sm:text-3xl">
              {tHome("featuredServices.eyebrow")}
            </p>
            <h2
              id="featured-services-heading"
              className="font-serif-heading text-primary mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
            >
              {tHome("featuredServices.heading")}
            </h2>
            <p className="text-foreground/75 mx-auto mt-4 max-w-xl text-sm sm:text-base">
              {tHome("featuredServices.subheading")}
            </p>
          </div>
        </FadeIn>

        {featuredServices.length === 0 ? (
          <EmptyState message={tHome("featuredServices.empty")} />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {featuredServices.map((service, index) => (
                <FadeIn key={service.id} delay={index * 0.1}>
                  <ServiceCard
                    service={service}
                    whatsappPhone={whatsappPhone}
                    variant="featured"
                  />
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={0.4}>
              <div className="mt-12 flex justify-center">
                <Link
                  href={PUBLIC_ROUTES.services}
                  className="group inline-flex items-center gap-2 rounded-full border border-primary/40 px-7 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary transition-colors hover:bg-primary/10"
                >
                  {tCommon("viewAll")}
                  <ArrowUpRight
                    className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </FadeIn>
          </>
        )}
      </div>
    </section>
  );
}
