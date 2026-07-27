/**
 * The admin CRUD schema has a single `address` field (per spec) — the
 * Home page's compact branch card shows a shortened version of it,
 * while /branches shows the full text. This derives "short" rather
 * than storing a second field, so editors never have two addresses
 * to keep in sync.
 */
export function getShortAddress(address: string, maxLength = 55): string {
  if (address.length <= maxLength) return address;
  return `${address.slice(0, maxLength).trimEnd()}…`;
}
