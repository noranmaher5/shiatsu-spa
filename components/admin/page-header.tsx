import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
      <div className="flex items-center gap-3.5">
        <div className="h-9 w-1.5 rounded-full bg-gradient-to-b from-[#143725] to-[#c89c47]" />
        <div>
          <h1 className="font-serif-heading text-2xl font-bold tracking-tight text-[#0b1a10] sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-0.5 text-xs font-medium text-muted-foreground sm:text-sm">
              {description}
            </p>
          )}
        </div>
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
}
