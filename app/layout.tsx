import type { Metadata, Viewport } from "next";
import { Alex_Brush, Cormorant_Garamond, Montserrat, Cairo } from "next/font/google";
import "./globals.css";

const alexBrush = Alex_Brush({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  icons: {
    icon: [{ url: "/images/logo/logo 1.png", type: "image/png" }],
    apple: "/images/logo/logo 1.png",
  },
  title: {
    default: "Shiatsu Spa Kuwait",
    template: "%s | Shiatsu Spa Kuwait",
  },
  description: "Shiatsu Spa Kuwait — wellness and massage services.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#262825",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`site-root ${alexBrush.variable} ${cormorant.variable} ${montserrat.variable} ${cairo.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
