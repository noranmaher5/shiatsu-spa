/**
 * Default `revalidate` value (in seconds) for public pages that don't
 * specify their own. On-demand revalidation (revalidateTag/revalidatePath,
 * triggered by admin saves) is the primary mechanism — this is a safety
 * net so pages never go stale indefinitely even if a revalidation call
 * is ever missed.
 */
export const DEFAULT_REVALIDATE_SECONDS = 3600; // 1 hour
