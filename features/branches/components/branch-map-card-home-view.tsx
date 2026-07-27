"use client";

import { useLocale } from "next-intl";
import { MapPin } from "lucide-react";
import { GoogleMapEmbed } from "./google-map-embed";
import { WorkingHoursBadge } from "./working-hours-badge";
import { getShortAddress } from "../lib/get-short-address";
import type { Branch } from "../types";

type BranchMapCardHomeViewProps = {
  branch: Branch;
  embedUrl: string;
};

export function BranchMapCardHomeView({ branch, embedUrl }: BranchMapCardHomeViewProps) {
  const locale = useLocale();
  const name = locale === "ar" ? branch.name.ar : branch.name.en;
  const address = locale === "ar" ? branch.address.ar : branch.address.en;

  return (
    <article className="group overflow-hidden rounded-2xl border border-dashed border-primary/40 bg-card transition-all duration-300 hover:border-primary/65 hover:shadow-card">
      <GoogleMapEmbed
        embedUrl={embedUrl}
        title={name}
        autoLoad
        externalUrl={branch.googleMapsUrl}
        className="aspect-4/3 rounded-none border-0"
      />

      <div className="space-y-3 p-5">
        <h3 className="font-serif-heading text-xl font-bold tracking-tight text-white">
          {name}
        </h3>
        <p className="text-muted-foreground flex items-start gap-2 text-sm leading-relaxed">
          <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <span>{getShortAddress(address)}</span>
        </p>
        <WorkingHoursBadge workingHours={branch.workingHours} />
      </div>
    </article>
  );
}
