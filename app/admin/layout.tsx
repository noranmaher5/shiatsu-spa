import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Admin | Shiatsu Spa Kuwait",
    template: "%s | Shiatsu Spa Admin",
  },
  description: "Content management dashboard for Shiatsu Spa Kuwait.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4efe6",
};

/**
 * The admin dashboard is intentionally English-only (no next-intl
 * provider) — it's an internal tool for staff, not localized content
 * for site visitors. It gets its own <html>/<body> because it lives
 * outside the app/[locale] segment entirely.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-surface min-h-screen font-sans">
      <Providers>{children}</Providers>
    </div>
  );
}
