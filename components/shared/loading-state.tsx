import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={className ?? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"}
      role="status"
      aria-label="Loading content"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-3">
          <Skeleton className="aspect-4/3 w-full" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
