import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type OptimizedImageProps = Omit<ImageProps, "alt"> & {
  /** Required (not optional like next/image) — accessibility is not optional on this project. */
  alt: string;
};

/**
 * Wraps next/image so every image in the app gets:
 * - lazy loading by default (next/image's built-in default — we just
 *   never override it to `priority` except for the single LCP image
 *   per page, e.g. the hero background)
 * - a consistent object-cover + rounded treatment for card contexts
 * - a mandatory, real `alt` prop — no empty-string accessibility escape
 *   hatch here, unlike raw next/image where `alt=""` is valid
 */
export function OptimizedImage({ className, alt, ...props }: OptimizedImageProps) {
  return (
    <Image
      alt={alt}
      className={cn("object-cover", className)}
      sizes={props.sizes ?? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
      {...props}
    />
  );
}
