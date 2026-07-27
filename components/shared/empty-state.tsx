import { cn } from "@/lib/utils";

export function EmptyState({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "border-border text-muted-foreground rounded-xl border border-dashed py-12 text-center",
        className,
      )}
    >
      {message}
    </p>
  );
}
