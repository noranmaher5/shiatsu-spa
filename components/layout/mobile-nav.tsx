"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { PUBLIC_ROUTES } from "@/lib/constants";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");

  const links: { href: string; label: string }[] = [
    { href: PUBLIC_ROUTES.home, label: t("home") },
    { href: PUBLIC_ROUTES.about, label: t("about") },
    { href: PUBLIC_ROUTES.services, label: t("services") },
    { href: PUBLIC_ROUTES.gallery, label: t("gallery") },
    { href: PUBLIC_ROUTES.contact, label: t("contact") },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label={tCommon("openMenu")}>
          <Menu aria-hidden="true" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <Dialog.Content
          className="bg-card text-card-foreground shadow-card fixed inset-y-0 end-0 z-50 flex w-72 flex-col gap-1 p-6 focus:outline-none"
          aria-describedby={undefined}
        >
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="font-sans text-lg font-semibold">
              Shiatsu Spa
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label={tCommon("closeMenu")}>
                <X aria-hidden="true" />
              </Button>
            </Dialog.Close>
          </div>
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="hover:bg-secondary/40 rounded-lg px-3 py-2.5 text-base font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
