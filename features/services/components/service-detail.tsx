"use client";

import { useLocale, useTranslations } from "next-intl";
import { Clock, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { OptimizedImage, PriceTag, WhatsAppButton } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { PUBLIC_ROUTES } from "@/lib/constants";
import type { Service } from "../types";
import { getServiceDescription, getServiceName } from "../content";

type ServiceDetailProps = {
  service: Service;
  whatsappPhone?: string;
};

export function ServiceDetail({
  service,
  whatsappPhone = "96500000000",
}: ServiceDetailProps) {
  const locale = useLocale();
  const t = useTranslations("common");
  const tServices = useTranslations("services");
  const name = getServiceName(service, locale);
  const description = getServiceDescription(service, locale);

  return (
    <article className="mx-auto max-w-4xl space-y-8 py-8">
      <Link
        href={PUBLIC_ROUTES.services}
        className="text-muted-foreground hover:text-primary inline-flex items-center gap-2 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="size-4 rtl:rotate-180" />
        {tServices("backToServices")}
      </Link>

      <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-card">
        <div className="relative aspect-21/9 w-full bg-secondary/30">
          {service.imageUrl ? (
            <OptimizedImage
              src={service.imageUrl}
              alt={name}
              fill
              sizes="(max-width: 1024px) 100vw, 900px"
              priority
              className="object-cover"
            />
          ) : (
            <div className="text-muted-foreground/60 flex size-full items-center justify-center font-sans text-lg font-medium">
              {name}
            </div>
          )}
        </div>

        <div className="space-y-6 p-6 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-sans text-3xl font-bold tracking-tight sm:text-4xl">
                {name}
              </h1>
              <div className="mt-3 flex items-center gap-3">
                <Badge variant="outline" className="border-primary/40 text-primary">
                  <Clock className="mr-1.5 size-3.5" aria-hidden="true" />
                  {service.durationMinutes} {tServices("duration")}
                </Badge>
              </div>
            </div>
            <PriceTag price={service.price} className="text-2xl font-bold" />
          </div>

          <div className="border-border border-t pt-6">
            <h2 className="mb-3 font-sans text-lg font-semibold">
              {tServices("about")}
            </h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>

          <div className="border-border border-t pt-6">
            <WhatsAppButton
              phoneNumber={whatsappPhone}
              serviceName={name}
              label={t("bookNow")}
              size="lg"
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
