"use client";

import { useState, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { makeQueryClient } from "@/lib/query-client";

/**
 * Wraps the app in the client-side providers it needs. Kept as its own
 * file (rather than inlined in a layout) so both the public [locale]
 * layout and the admin layout can share the exact same provider setup
 * once they're built in later sprints.
 */
export function Providers({ children }: { children: ReactNode }) {
  // useState (not useMemo) guarantees the QueryClient is created exactly
  // once per component instance and never recreated on re-render, while
  // still being safe for React's Strict Mode double-invoke in development.
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}
