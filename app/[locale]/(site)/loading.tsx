import { LoadingState } from "@/components/shared";

/**
 * Shown by Next.js while any (site) route's server components are
 * awaiting their Firestore fetches. Kept generic (no page-specific
 * copy) since it's shared across every public route in this segment.
 */
export default function SiteLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col items-center gap-3">
        <div className="bg-muted/30 h-10 w-64 animate-pulse rounded-md" />
        <div className="bg-muted/30 h-4 w-80 animate-pulse rounded-md" />
      </div>
      <LoadingState count={6} />
    </div>
  );
}
