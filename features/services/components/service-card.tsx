"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight, Clock, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OptimizedImage, PriceTag, WhatsAppButton } from "@/components/shared";
import { Link } from "@/i18n/navigation";
import { PUBLIC_ROUTES } from "@/lib/constants";
import type { Service } from "../types";
import { getServiceDescription, getServiceName } from "../content";

type ServiceCardProps = {
  service: Service;
  whatsappPhone?: string;
  variant?: "default" | "featured";
};

export function ServiceCard({
  service,
  whatsappPhone = "96500000000",
  variant = "default",
}: ServiceCardProps) {
  const locale = useLocale();
  const t = useTranslations("common");
  const tServices = useTranslations("services");
  const tHome = useTranslations("home");
  const name = getServiceName(service, locale);
  const shortDescription =
    locale === "ar"
      ? service.shortDescription?.ar || service.description.ar
      : service.shortDescription?.en && !service.shortDescription.en.includes("[TODO:")
        ? service.shortDescription.en
        : getServiceDescription(service, locale);
  const label = locale === "ar" ? "خدمة علاجية" : "Wellness treatment";

  if (variant === "featured") {
    return (
      <article className="group rounded-2xl border border-dashed border-primary/45 bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/70 hover:shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
          <div className="relative aspect-4/3 shrink-0 overflow-hidden rounded-xl bg-secondary/40 sm:aspect-square sm:w-[42%]">
            {service.imageUrl ? (
              <OptimizedImage
                src={service.imageUrl}
                alt={name}
                fill
                sizes="(max-width: 640px) 100vw, 42vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="text-muted-foreground/60 flex size-full items-center justify-center text-sm font-medium">
                {name}
              </div>
            )}
          </div>

          <div className="flex min-h-[140px] flex-1 flex-col justify-between py-1">
            <div>
              <span className="font-script-title text-primary block text-lg">{label}</span>
              <h3 className="font-serif-heading mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
                {name}
              </h3>
              <div className="mt-3 flex items-center gap-3 text-xs">
                <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5">
                  <PriceTag price={service.price} className="text-sm" />
                </span>
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Clock className="size-3.5 text-primary" aria-hidden="true" />
                  {service.durationMinutes} {tServices("duration")}
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-dashed border-primary/30 pt-3 sm:gap-3">
              <Link
                href={PUBLIC_ROUTES.serviceDetail(service.slug)}
                className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary/80"
              >
                {t("more")}
                <ArrowUpRight className="size-3 text-primary" aria-hidden="true" />
              </Link>
              <WhatsAppButton
                phoneNumber={whatsappPhone}
                serviceName={name}
                label={t("bookNow")}
                size="sm"
                className="rounded-full px-4 text-xs font-semibold"
              />
              <div className="hidden h-7 w-px bg-border/60 sm:block" aria-hidden="true" />
              <div className="flex w-full items-center justify-end gap-1.5 text-xs font-medium text-foreground/90 sm:ms-auto sm:w-auto">
                <Star className="size-3.5 fill-primary text-primary" aria-hidden="true" />
                <span>{tHome("featuredServices.rate")}</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-2xl border-border/60 bg-card/80 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.85)] transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_24px_60px_-30px_rgba(197,164,103,0.3)] sm:flex-row">
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-secondary/40 sm:aspect-auto sm:min-h-[280px] sm:w-2/5">
        {service.imageUrl ? (
          <OptimizedImage
            src={service.imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 40vw, 28vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="text-muted-foreground/60 flex size-full items-center justify-center text-sm font-medium">
            {name}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-white">
          <span className="rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[11px] font-semibold tracking-wide uppercase backdrop-blur-md">
            {label}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex-1">
          <h3 className="font-serif-heading text-xl font-bold tracking-tight text-white transition-colors group-hover:text-primary sm:text-2xl">
            {name}
          </h3>
          <div className="mt-4 flex items-center gap-3 text-xs">
            <span className="border-primary/25 bg-primary/10 rounded-full border px-3 py-1.5">
              <PriceTag price={service.price} className="text-sm" />
            </span>
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Clock className="size-3.5" aria-hidden="true" />
              {service.durationMinutes} {tServices("duration")}
            </span>
          </div>
          <p className="text-foreground/70 mt-4 line-clamp-3 text-sm leading-relaxed">
            {shortDescription}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border/40 pt-4">
          <Button asChild variant="outline" size="sm" className="flex-1 rounded-full text-xs font-semibold">
            <Link href={PUBLIC_ROUTES.serviceDetail(service.slug)}>{t("viewDetails")}</Link>
          </Button>
          <WhatsAppButton
            phoneNumber={whatsappPhone}
            serviceName={name}
            label={t("bookNow")}
            size="sm"
            className="flex-1 rounded-full text-xs font-semibold"
          />
          <div className="hidden h-7 w-px bg-border/60 sm:block" aria-hidden="true" />
          <span className="text-muted-foreground flex items-center gap-1.5 px-1 text-xs font-medium">
            <Star className="size-3.5 fill-primary text-primary" aria-hidden="true" />
            5.0
          </span>
        </div>
      </div>
    </Card>
  );
}
