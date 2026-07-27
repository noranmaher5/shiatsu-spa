import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges conditional class names (clsx) and then resolves conflicting
 * Tailwind utility classes (tailwind-merge), so the last conflicting
 * class always wins instead of both being applied.
 *
 * This is the standard shadcn/ui `cn()` helper. Every component in
 * `components/ui` and every feature component uses this instead of
 * template-literal string concatenation for class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
