"use client";

import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type GoogleMapEmbedProps = {
  embedUrl: string;
  title: string;
  autoLoad?: boolean;
  externalUrl?: string;
  className?: string;
};

export function GoogleMapEmbed({
  embedUrl,
  title,
  externalUrl,
  className,
}: GoogleMapEmbedProps) {
  const t = useTranslations("branches");

  return (
    <div
      className={cn(
        "group relative min-h-[300px] w-full overflow-hidden rounded-2xl border border-border/80 bg-card shadow-md",
        className,
      )}
    >
      <iframe
        src={embedUrl}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="size-full min-h-[300px] border-0 select-none"
        allowFullScreen
      />

      {externalUrl && (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 end-3 z-20 flex items-center gap-2 rounded-full border border-[#d6ad62]/40 bg-[#0d1b12]/90 px-4 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur-md transition-all hover:scale-105 hover:bg-[#143725] hover:border-[#d6ad62]"
          aria-label={`${t("viewOnMap")}: ${title}`}
        >
          <MapPin className="size-3.5 text-[#d6ad62]" aria-hidden="true" />
          <span>{t("viewOnMap")}</span>
        </a>
      )}
    </div>
  );
}
