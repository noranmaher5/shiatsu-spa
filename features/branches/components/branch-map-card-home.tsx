import { getLocale } from "next-intl/server";
import { buildMapEmbedUrl } from "../lib/google-maps";
import { BranchMapCardHomeView } from "./branch-map-card-home-view";
import type { Branch } from "../types";

function buildFallbackQuery(branch: Branch, locale: string): string {
  const name = locale === "ar" ? branch.name.ar : branch.name.en;
  const address = locale === "ar" ? branch.address.ar : branch.address.en;
  const country = locale === "ar" ? "الكويت" : "Kuwait";
  return [name, address, country].filter(Boolean).join(", ");
}

export async function BranchMapCardHome({ branch }: { branch: Branch }) {
  const locale = await getLocale();
  const fallbackQuery = buildFallbackQuery(branch, locale);
  const embedUrl = await buildMapEmbedUrl(
    branch.googleMapsUrl,
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY,
    fallbackQuery,
  );

  return <BranchMapCardHomeView branch={branch} embedUrl={embedUrl} />;
}
