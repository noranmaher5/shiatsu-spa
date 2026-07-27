"use client";

import { useLocale } from "next-intl";
import { MessageCircle } from "lucide-react";
import { Button, type buttonVariants } from "@/components/ui/button";
import { generateWhatsappLink } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

type WhatsAppButtonProps = {
  phoneNumber: string;
  serviceName?: string;
  branchName?: string;
  /** Falls back to a generic greeting when neither serviceName nor a
   * custom label is provided (e.g. a branch's "Chat on WhatsApp" button). */
  label: string;
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
};

export function WhatsAppButton({
  phoneNumber,
  serviceName,
  branchName,
  label,
  size = "md",
  className,
}: WhatsAppButtonProps) {
  const locale = useLocale();
  const href = serviceName
    ? generateWhatsappLink({
        phoneNumber,
        serviceName,
        branchName,
        locale: locale === "ar" ? "ar" : "en",
      })
    : `https://wa.me/${phoneNumber.replace(/[^\d]/g, "")}`;

  return (
    <Button asChild variant="whatsapp" size={size} className={className}>
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
        <MessageCircle aria-hidden="true" />
        {label}
      </a>
    </Button>
  );
}
