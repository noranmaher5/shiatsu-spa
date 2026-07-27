"use client";

import { Clock } from "lucide-react";
import { useLocale } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { Bilingual } from "@/types";

export function WorkingHoursBadge({ workingHours }: { workingHours: Bilingual }) {
  const locale = useLocale();
  const text = locale === "ar" ? workingHours.ar : workingHours.en;

  return (
    <Badge variant="outline" className="gap-1.5">
      <Clock className="size-3.5" aria-hidden="true" />
      {text}
    </Badge>
  );
}
