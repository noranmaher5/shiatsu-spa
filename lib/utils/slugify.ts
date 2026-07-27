/**
 * Converts a (typically English) name into a URL-safe slug used for
 * /services/[slug]. Arabic names are not slugified from — the English
 * name is always the slug source so URLs stay ASCII and shareable.
 */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
