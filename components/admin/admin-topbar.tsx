"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Menu, LogOut, Loader2, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { signOutAdmin } from "@/features/auth";
import { ADMIN_ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./admin-sidebar";

export function AdminTopbar({ email }: { email: string | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleLogout() {
    setIsSigningOut(true);
    await signOutAdmin();
    router.push(ADMIN_ROUTES.login);
    router.refresh();
  }

  const initial = email && email.length > 0 ? email.charAt(0).toUpperCase() : "A";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border/80 bg-card/90 px-4 sm:px-8 backdrop-blur-md">
      {/* Mobile Menu Trigger */}
      <div className="flex items-center gap-3">
        <DialogPrimitive.Root open={mobileOpen} onOpenChange={setMobileOpen}>
          <DialogPrimitive.Trigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden size-10 rounded-xl border-border bg-card shadow-sm"
              aria-label="Open menu"
            >
              <Menu className="size-5 text-foreground" aria-hidden="true" />
            </Button>
          </DialogPrimitive.Trigger>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />
            <DialogPrimitive.Content
              className="fixed inset-y-0 start-0 z-50 flex w-72 flex-col gap-2 bg-[#0d1b12] text-white p-5 shadow-2xl focus:outline-none animate-in slide-in-from-left duration-300"
              aria-describedby={undefined}
            >
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <Image
                  src="/images/logo/logo 1.png"
                  alt="Shiatsu Spa"
                  width={36}
                  height={36}
                  className="object-contain"
                />
                <div>
                  <h2 className="font-serif-heading text-lg font-bold text-[#d6ad62]">Shiatsu Spa</h2>
                  <p className="text-xs text-[#d6ad62]">CMS Control Center 👋 · Admin</p>
                </div>
              </div>

              <DialogPrimitive.Title className="mt-2 px-1 text-[11px] font-bold tracking-widest text-white/50 uppercase">
                Navigation
              </DialogPrimitive.Title>

              <nav className="flex-1 space-y-1.5 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={true}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-[#143725] text-white font-semibold border-s-4 border-[#d6ad62]"
                          : "text-white/70 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      <item.icon className={cn("size-4.5", isActive ? "text-[#d6ad62]" : "text-white/50")} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-white/10 pt-3">
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl bg-white/10 px-3.5 py-2.5 text-xs text-white"
                >
                  <span>Live Website</span>
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>

        {/* Desktop Welcome Banner Badge */}
        <div className="hidden items-center gap-2 rounded-full border border-[#143725]/15 bg-[#143725]/5 px-3.5 py-1.5 text-xs font-semibold text-[#143725] sm:flex">
          <Sparkles className="size-3.5 text-[#c89c47]" />
          <span>حياكم الله 👋</span>
        </div>
      </div>

      {/* Right Side User Profile & Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick View Website Button */}
        <Button
          asChild
          variant="outline"
          size="sm"
          className="hidden rounded-full border-border bg-card hover:bg-[#143725]/10 hover:text-[#143725] sm:inline-flex"
        >
          <a href="/" target="_blank" rel="noopener noreferrer" className="gap-2">
            <ExternalLink className="size-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold">View Site</span>
          </a>
        </Button>

        {/* User Info Avatar Badge */}
        {email && (
          <div className="flex items-center gap-2.5 rounded-full border border-border bg-muted/30 p-1 pe-3">
            <div className="flex size-7 items-center justify-center rounded-full bg-[#143725] text-xs font-bold text-white shadow-sm">
              {initial}
            </div>
            <div className="hidden flex-col text-start lg:flex">
              <span className="max-w-[140px] truncate text-xs font-semibold text-foreground">
                {email}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-700">
                <ShieldCheck className="size-3" /> Admin Authorized
              </span>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          disabled={isSigningOut}
          className="rounded-full text-xs font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          {isSigningOut ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <LogOut className="size-4" aria-hidden="true" />
          )}
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    </header>
  );
}
