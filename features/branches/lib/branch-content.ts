import type { Branch } from "../types";

const LEGACY_CONTENT: Record<string, { name: string; address: string; lat: number; lng: number }> = {
  "+96560074005": {
    name: "Sabah Al Salem Branch",
    address: "Sabah Al Salem, Orange Tower, opposite Oxygen Club",
    lat: 29.26675,
    lng: 48.083008,
  },
  "+96566555297": {
    name: "Al Riqqa Branch",
    address: "Al Riqqa, Fourth Ring Road, next to Oxygen Club",
    lat: 29.3094167,
    lng: 47.9163324,
  },
};

function isPlaceholder(value: string | undefined): boolean {
  return !value || value.includes("TODO") || value.includes("add English translation");
}

export function getBranchEnglishContent(branch: Pick<Branch, "phone" | "name" | "address">) {
  const fallback = LEGACY_CONTENT[branch.phone];
  return {
    name: isPlaceholder(branch.name.en) && fallback ? fallback.name : branch.name.en,
    address: isPlaceholder(branch.address.en) && fallback ? fallback.address : branch.address.en,
    coords: fallback ? { lat: fallback.lat, lng: fallback.lng } : null,
  };
}
