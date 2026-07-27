import { getBranchCoordinates } from "./kuwait-map";
import { getBranchEnglishContent } from "./branch-content";

const SHORT_LINK_HOSTS = ["maps.app.goo.gl", "goo.gl"];

/** Known branch coordinates keyed by Google hex place id or fallback queries. */
export const BRANCH_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "0x3fcf757eec163d35:0x6e435e7ec995e4bb": { lat: 29.26675, lng: 48.083008 },
  "0x3fcf9123aea2e689:0x3b8fc696e5b6a88d": { lat: 29.3094167, lng: 47.9163324 },
};

/** Extracts "@lat,lng" style coordinates embedded in Google Maps URLs. */
function extractLatLng(url: string): { lat: number; lng: number } | null {
  if (!url) return null;
  const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  const [, latStr, lngStr] = match ?? [];
  if (!latStr || !lngStr) return null;
  return { lat: Number(latStr), lng: Number(lngStr) };
}

/** Extracts place name from Google Maps URL segment. */
function extractPlaceName(url: string): string | null {
  if (!url) return null;
  const match = url.match(/\/maps\/place\/([^/@?]+)/);
  const [, placeSegment] = match ?? [];
  return placeSegment ? decodeURIComponent(placeSegment.replace(/\+/g, " ")) : null;
}

/** Extracts hex place id from Google Maps URL. */
export function extractHexPlaceId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/1s(0x[a-f0-9]+:0x[a-f0-9]+)/i);
  return match?.[1] ?? null;
}

/** Builds a clean, crystal-clear Google Maps iframe URL. */
export async function buildMapEmbedUrl(
  googleMapsUrl: string,
  apiKey?: string,
  fallbackQuery?: string,
  latitude?: number,
  longitude?: number,
): Promise<string> {
  // 1. Direct latitude & longitude if provided on document
  if (typeof latitude === "number" && typeof longitude === "number" && !isNaN(latitude) && !isNaN(longitude)) {
    return `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&hl=ar&output=embed`;
  }

  // 2. Extract coordinates from Google Maps URL
  const coords = extractLatLng(googleMapsUrl);
  if (coords) {
    return `https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=15&hl=ar&output=embed`;
  }

  // 3. Known hex ID coordinates
  const hexId = extractHexPlaceId(googleMapsUrl);
  if (hexId && BRANCH_COORDINATES[hexId]) {
    const known = BRANCH_COORDINATES[hexId];
    return `https://maps.google.com/maps?q=${known.lat},${known.lng}&z=15&hl=ar&output=embed`;
  }

  // 4. Place name
  const placeName = extractPlaceName(googleMapsUrl);
  if (placeName) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(placeName + ", Kuwait")}&z=14&hl=ar&output=embed`;
  }

  // 5. Fallback query (branch name + address + Kuwait)
  if (fallbackQuery) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(fallbackQuery)}&z=14&hl=ar&output=embed`;
  }

  return `https://maps.google.com/maps?q=Shiatsu+Spa+Kuwait&z=12&hl=ar&output=embed`;
}

export type BranchMapPin = {
  id: string;
  name: string;
  googleMapsUrl: string;
  coords: { lat: number; lng: number } | null;
};

export async function resolveBranchMapPins(
  branches: Array<{
    id: string;
    name: { ar: string; en: string };
    address: { ar: string; en: string };
    phone: string;
    googleMapsUrl: string;
    latitude?: number;
    longitude?: number;
  }>,
  locale: string,
): Promise<BranchMapPin[]> {
  return Promise.all(
    branches.map(async (branch) => {
      const legacyContent = getBranchEnglishContent(branch);
      const knownCoords =
        typeof branch.latitude === "number" && typeof branch.longitude === "number"
          ? { lat: branch.latitude, lng: branch.longitude }
          : legacyContent.coords;
      const hexId = knownCoords ? null : extractHexPlaceId(branch.googleMapsUrl);
      const coords = knownCoords ?? getBranchCoordinates(hexId);

      return {
        id: branch.id,
        name: locale === "ar" ? branch.name.ar : legacyContent.name,
        googleMapsUrl: branch.googleMapsUrl,
        coords,
      };
    }),
  );
}
