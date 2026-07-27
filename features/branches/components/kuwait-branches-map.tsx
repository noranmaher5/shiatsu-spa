"use client";

import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import { buildKuwaitOverviewEmbedUrl, latLngToMapPosition } from "../lib/kuwait-map";
import type { BranchMapPin } from "../lib/google-maps";

type KuwaitBranchesMapProps = {
  pins: BranchMapPin[];
};

export function KuwaitBranchesMap({ pins }: KuwaitBranchesMapProps) {
  const t = useTranslations("branches");
  const embedUrl = buildKuwaitOverviewEmbedUrl();

  return (
    <div className="border-primary/40 relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-dashed bg-card sm:aspect-[21/9]">
      <iframe
        src={embedUrl}
        title={t("kuwaitMapTitle")}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="pointer-events-none absolute inset-0 size-full border-0"
        allowFullScreen
      />

      {pins.map((pin) => {
        if (!pin.coords) return null;
        const position = latLngToMapPosition(pin.coords.lat, pin.coords.lng);

        return (
          <a
            key={pin.id}
            href={pin.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ top: position.top, left: position.left }}
            className="group/pin absolute z-10 -translate-x-1/2 -translate-y-full"
            aria-label={`${t("viewOnMap")}: ${pin.name}`}
          >
            <span className="relative flex flex-col items-center">
              <span className="mb-1 max-w-[9rem] truncate rounded-full bg-brand-dark/90 px-3 py-1 text-[10px] font-semibold text-white opacity-0 shadow-soft transition-opacity group-hover/pin:opacity-100 sm:max-w-[11rem] sm:text-xs">
                {pin.name}
              </span>
              <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card ring-4 ring-primary/25 transition-transform group-hover/pin:scale-110">
                <MapPin className="size-4 fill-current" aria-hidden="true" />
              </span>
            </span>
          </a>
        );
      })}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/30 to-transparent p-4">
        <p className="text-foreground/90 text-xs font-medium sm:text-sm">{t("kuwaitMapHint")}</p>
      </div>
    </div>
  );
}
