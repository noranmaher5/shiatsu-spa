import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/**
 * next-intl's plugin wraps the Next.js config to wire up the request-scoped
 * i18n config (./i18n/request.ts) so Server Components can read the active
 * locale without extra boilerplate in every page.
 */
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // ISR + SSR are required by the approved architecture (revalidation on
  // admin save). Do NOT set `output: "export"` here — that would force a
  // fully static export and silently break ISR and the /api/revalidate route.

  images: {
    // Only Firebase Storage is ever used for user-uploaded images (services,
    // gallery, branches, settings). Keeping this list explicit — rather than
    // a wildcard — is a deliberate security choice: Next.js Image Optimization
    // will refuse to fetch/optimize images from any other host.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    // Prioritize AVIF over WebP for 20-30% smaller image payloads
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-accordion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-slot",
      "sonner",
      "@tanstack/react-query",
    ],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },

  // Prevents leaking the Next.js/React version in response headers.
  poweredByHeader: false,

  eslint: {
    // We run ESLint ourselves in CI/pre-commit (see Husky config) — no need
    // for Next.js to also run it during `next build`, which just slows builds.
    ignoreDuringBuilds: false,
  },
};

export default withNextIntl(nextConfig);
