"use client";

import { useLocale, useTranslations } from "next-intl";
import { MapPin, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OptimizedImage, WhatsAppButton } from "@/components/shared";
import { WorkingHoursBadge } from "./working-hours-badge";
import { GoogleMapEmbed } from "./google-map-embed";
import type { Branch } from "../types";
import { getBranchEnglishContent } from "../lib/branch-content";

type BranchDetailViewProps = {
  branch: Branch;
  embedUrl: string;
};

export function BranchDetailView({ branch, embedUrl }: BranchDetailViewProps) {
  const locale = useLocale();
  const t = useTranslations("common");
  const tBranches = useTranslations("branches");
  const englishContent = getBranchEnglishContent(branch);
  const name = locale === "ar" ? branch.name.ar : englishContent.name;
  const address = locale === "ar" ? branch.address.ar : englishContent.address;

  return (
    <Card className="overflow-hidden">
      {branch.coverImageUrl ? (
        <div className="relative aspect-21/9 w-full overflow-hidden">
          <OptimizedImage src={branch.coverImageUrl} alt={name} fill sizes="100vw" className="object-cover" />
        </div>
      ) : null}

      <CardContent className="grid gap-6 pt-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h2 className="font-sans text-2xl font-semibold">{name}</h2>

          <div className="text-muted-foreground flex items-start gap-2">
            <MapPin className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <span>{address}</span>
          </div>

          <WorkingHoursBadge workingHours={branch.workingHours} />

          <a
            href={`tel:${branch.phone}`}
            dir="ltr"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-2 font-semibold text-foreground transition-colors hover:border-primary/30 hover:bg-primary/20 hover:text-primary"
          >
            <Phone className="size-5" aria-hidden="true" />
            <span className="font-mono tracking-[0.04em]">{branch.phone}</span>
          </a>

          <div className="mt-2 flex flex-wrap gap-3">
            <WhatsAppButton phoneNumber={branch.whatsapp} label={t("bookNow")} />
            <Button asChild variant="outline">
              <a href={branch.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                <MapPin aria-hidden="true" />
                {tBranches("viewOnMap")}
              </a>
            </Button>
          </div>
        </div>

        <GoogleMapEmbed
          embedUrl={embedUrl}
          title={name}
          autoLoad
          externalUrl={branch.googleMapsUrl}
        />
      </CardContent>
    </Card>
  );
}
