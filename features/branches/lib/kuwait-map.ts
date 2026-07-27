/** Default viewport when showing branches on a Kuwait-wide map. */
export const KUWAIT_MAP_VIEW = {
  query: "Kuwait",
  center: { lat: 29.29, lng: 47.9 },
  zoom: 10,
} as const;

/** Approximate bounds of the Kuwait overview embed at zoom 9. */
export const KUWAIT_MAP_BOUNDS = {
  minLat: 28.5,
  maxLat: 30.1,
  minLng: 46.7,
  // Google Maps' embedded Kuwait view includes more of the Gulf on the
  // right side than the old bounds assumed. This keeps branch pins aligned
  // with the land areas visible in the iframe.
  maxLng: 48.7,
} as const;

/** Known branch coordinates keyed by Google hex place id. */
export const BRANCH_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "0x3fcf757eec163d35:0x6e435e7ec995e4bb": { lat: 29.26675, lng: 48.083008 },
  "0x3fcf9123aea2e689:0x3b8fc696e5b6a88d": { lat: 29.3094167, lng: 47.9163324 },
};

export const branches = [
  { name: "Sabah Al Salem", lat: 29.26675, lng: 48.083008 },
  { name: "Al Riqqa", lat: 29.3094167, lng: 47.9163324 },
] as const;

export function buildKuwaitOverviewEmbedUrl(): string {
  const { query, center, zoom } = KUWAIT_MAP_VIEW;
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&ll=${center.lat},${center.lng}&z=${zoom}&hl=ar&output=embed`;
}

export function latLngToMapPosition(lat: number, lng: number): { top: string; left: string } {
  const { minLat, maxLat, minLng, maxLng } = KUWAIT_MAP_BOUNDS;
  return {
    top: `${((maxLat - lat) / (maxLat - minLat)) * 100}%`,
    left: `${((lng - minLng) / (maxLng - minLng)) * 100}%`,
  };
}

export function getBranchCoordinates(hexPlaceId: string | null): { lat: number; lng: number } | null {
  if (!hexPlaceId) return null;
  return BRANCH_COORDINATES[hexPlaceId] ?? null;
}
