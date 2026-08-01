"use client";

import { useLocale, useTranslations } from "next-intl";
import { MapPin, Phone } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/shared";
import { WorkingHoursBadge } from "./working-hours-badge";
import { getShortAddress } from "../lib/get-short-address";
import type { Branch } from "../types";

export function BranchCardHome({ branch }: { branch: Branch }) {
  const locale = useLocale();
  const t = useTranslations("common");
  const tBranches = useTranslations("branches");
  const name = locale === "ar" ? branch.name.ar : branch.name.en;
  const address = locale === "ar" ? branch.address.ar : branch.address.en;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <div className="text-muted-foreground flex items-start gap-2 text-sm">
          <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{getShortAddress(address)}</span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3">
        <WorkingHoursBadge workingHours={branch.workingHours} />
        <a
          href={`tel:${branch.phone}`}
          dir="ltr"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:bg-primary/20 hover:text-primary"
        >
          <Phone className="size-4" aria-hidden="true" />
          <span className="font-mono tracking-[0.04em]">{branch.phone}</span>
        </a>
      </CardContent>

      <CardFooter className="flex-wrap gap-3">
        <WhatsAppButton phoneNumber={branch.whatsapp} label={t("bookNow")} size="sm" />
        <Button asChild variant="outline" size="sm">
          <a href={branch.googleMapsUrl} target="_blank" rel="noopener noreferrer">
            <MapPin aria-hidden="true" />
            {tBranches("viewOnMap")}
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
