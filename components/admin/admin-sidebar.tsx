"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  LayoutGrid,
  Building2,
  Images,
  MessageSquareQuote,
  Settings,
  ExternalLink,
  Crown,
  Newspaper,
} from "lucide-react";
import { ADMIN_ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: ADMIN_ROUTES.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { href: ADMIN_ROUTES.services, label: "Services", icon: Sparkles },
  { href: ADMIN_ROUTES.categories, label: "Categories", icon: LayoutGrid },
  { href: ADMIN_ROUTES.branches, label: "Branches", icon: Building2 },
  { href: ADMIN_ROUTES.gallery, label: "Gallery", icon: Images },
  { href: ADMIN_ROUTES.articles, label: "Articles", icon: Newspaper },
  { href: ADMIN_ROUTES.testimonials, label: "Testimonials", icon: MessageSquareQuote },
  { href: ADMIN_ROUTES.settings, label: "Settings", icon: Settings },
];

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      prefetch={true}
      className={cn(
        "group relative flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200",
        active
          ? "bg-[#143725] text-white font-semibold border-s-4 border-[#d6ad62] shadow-md shadow-black/30"
          : "text-white/70 hover:bg-white/10 hover:text-white",
      )}
    >
      <Icon
        className={cn(
          "size-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110",
          active ? "text-[#d6ad62]" : "text-white/50 group-hover:text-white",
        )}
      />
      <span>{label}</span>
    </Link>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-e border-white/10 bg-[#0d1b12] text-white shadow-xl md:flex">
      {/* Brand Header */}
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-5">
        <div className="relative flex size-10 items-center justify-center rounded-xl bg-white/10 p-1 backdrop-blur-sm border border-white/15 shadow-inner">
          <Image
            src="/images/logo/logo 1.png"
            alt="Shiatsu Spa"
            width={32}
            height={32}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-serif-heading text-base font-bold tracking-tight text-[#d6ad62]">
              Shiatsu Spa
            </span>
            <Crown className="size-3.5 text-[#d6ad62]" />
          </div>
          <span className="text-[10px] uppercase font-medium tracking-widest text-[#d6ad62]">
            CMS Control Center
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3.5 py-5">
        <div className="mb-2 px-3 text-[10px] font-bold tracking-widest text-white/40 uppercase">
          Navigation
        </div>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={pathname === item.href}
          />
        ))}
      </nav>

      {/* Footer Shortcut to Live Site */}
      <div className="border-t border-white/10 p-3.5">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs font-medium text-white/80 transition-all hover:bg-white/15 hover:text-white"
        >
          <span className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
            </span>
            Live Website
          </span>
          <ExternalLink className="size-3.5 text-white/60" />
        </a>
      </div>
    </aside>
  );
}

export { NAV_ITEMS };
