"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { CalendarCheck } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { PUBLIC_ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/shared";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links: { href: string; label: string }[] = [
    { href: PUBLIC_ROUTES.home, label: t("home") },
    { href: PUBLIC_ROUTES.about, label: t("about") },
    { href: PUBLIC_ROUTES.services, label: t("services") },
    { href: PUBLIC_ROUTES.gallery, label: t("gallery") },
    { href: PUBLIC_ROUTES.contact, label: t("contact") },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,backdrop-filter,border-color,box-shadow] duration-500 ease-out",
        scrolled
          ? "border-border/60 bg-background/85 shadow-card backdrop-blur-xl"
          : "border-transparent bg-transparent backdrop-blur-0",
      )}
    >
      <div className="mx-auto grid h-20 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-6 px-4 sm:px-6 lg:px-10">
        {/* Left — Brand Logo */}
        <Link
          href={PUBLIC_ROUTES.home}
          className="group flex items-center transition-opacity hover:opacity-90"
        >
          <OptimizedImage
            src="/images/logo/logo2.png"
            alt="Shiatsu Spa logo"
            width={110}
            height={100}
            className=" "
          />
        </Link>

        {/* Center — Navigation Menu */}
        <nav
          className="hidden items-center justify-center gap-10 md:flex"
          aria-label="Main navigation"
        >
          {links.map((link) => {
            const active = pathname === link.href ||
              (link.href !== PUBLIC_ROUTES.home && pathname.startsWith(`${link.href}/`));
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative py-2 text-xs font-medium tracking-widest uppercase transition-colors",
                  active ? "text-primary" : "text-foreground/80 hover:text-primary",
                )}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "bg-primary absolute inset-x-0 -bottom-0.5 h-px origin-center scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100",
                    "bg-primary",
                    active && "scale-x-100",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right — Search, Book Now, Language Switcher */}
        <div className="flex items-center justify-end gap-3">

          <Button
            asChild
            size="sm"
            className="hidden rounded-full px-5 text-xs font-semibold tracking-wider uppercase shadow-soft transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-card md:inline-flex"
          >
            <Link href={PUBLIC_ROUTES.contact}>
              <CalendarCheck aria-hidden="true" />
              {tCommon("bookNow")}
            </Link>
          </Button>

          <LanguageSwitcher className="inline-flex px-2 text-xs md:px-3" />

          <MobileNav />
        </div>
      </div>
    </header>
  );
}
