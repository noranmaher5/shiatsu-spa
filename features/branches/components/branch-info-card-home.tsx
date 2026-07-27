"use client";

import { useLocale, useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import { WorkingHoursBadge } from "./working-hours-badge";
import { getShortAddress } from "../lib/get-short-address";
import { getBranchEnglishContent } from "../lib/branch-content";
import type { Branch } from "../types";

export function BranchInfoCardHome({ branch }: { branch: Branch }) {
  const locale = useLocale();
  const tBranches = useTranslations("branches");
  const englishContent = getBranchEnglishContent(branch);
  const name = locale === "ar" ? branch.name.ar : englishContent.name;
  const address = locale === "ar" ? branch.address.ar : englishContent.address;

  return (
    <article className="rounded-2xl border border-dashed border-primary/40 bg-card p-5 transition-all duration-300 hover:border-primary/65 hover:shadow-card">
      <h3 className="font-serif-heading text-xl font-bold tracking-tight text-white">{name}</h3>
      <p className="text-muted-foreground mt-2 flex items-start gap-2 text-sm leading-relaxed">
        <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        <span>{getShortAddress(address)}</span>
      </p>
      <div className="mt-3">
        <WorkingHoursBadge workingHours={branch.workingHours} />
      </div>
      <a
        href={branch.googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary/80"
      >
        <MapPin className="size-3.5 text-primary" aria-hidden="true" />
        {tBranches("viewOnMap")}
      </a>
    </article>
  );
}
