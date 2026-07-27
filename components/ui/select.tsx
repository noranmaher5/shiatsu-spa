import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A styled native <select>. We deliberately don't build a custom
 * Radix-style listbox here — @radix-ui/react-select isn't a project
 * dependency, and a native select is fully accessible and keyboard
 * operable without any extra code, which is what the admin dashboard's
 * simple pickers (category, branch, etc.) need.
 */
function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(
          "border-input bg-background h-10 w-full appearance-none rounded-lg border px-3 pe-9 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="text-muted-foreground pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2"
        aria-hidden="true"
      />
    </div>
  );
}

export { Select };
