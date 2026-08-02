import { getTranslations } from "next-intl/server";
import { ArrowUpRight, ExternalLink, Mail, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PUBLIC_ROUTES } from "@/lib/constants";
import { getContactSettings, getSocialSettings, getWebsiteSettings } from "@/features/settings/api";
import { OptimizedImage } from "@/components/shared";

function SocialIcon({ label }: { label: string }) {
  if (label === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="size-4">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (label === "TikTok") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4">
        <path d="M15.5 3h3.1c.2 1.8 1.2 3 3 3.6v3.2c-1.2-.1-2.3-.5-3.2-1.1v6.1a6.2 6.2 0 1 1-5.4-6.1v3.3a2.9 2.9 0 1 0 2.1 2.8V3h.4Z" />
      </svg>
    );
  }

  if (label === "Snapchat") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4">
        <path d="M12 3.2c-2.8 0-4.7 2-4.7 5v1.2c0 .5-.3.8-.9 1.1-.5.2-1 .4-1.2.8-.1.3.1.7.5.9.5.3 1.1.4 1.6.5.2 1.1.8 1.8 1.7 2.3-.3.5-.8.8-1.5 1-.4.1-.6.4-.5.7.1.4.6.5 1 .5.7 0 1.3-.2 1.8-.4.4.8 1.1 1.1 2.2 1.1.8 0 1.2-.2 1.8-.2s1 .2 1.8.2c1.1 0 1.8-.3 2.2-1.1.5.2 1.1.4 1.8.4.4 0 .9-.1 1-.5.1-.3-.1-.6-.5-.7-.7-.2-1.2-.5-1.5-1 .9-.5 1.5-1.2 1.7-2.3.5-.1 1.1-.2 1.6-.5.4-.2.6-.6.5-.9-.2-.4-.7-.6-1.2-.8-.6-.3-.9-.6-.9-1.1V8.2c0-3-1.9-5-4.7-5Z" />
      </svg>
    );
  }

  return <ExternalLink className="size-4" aria-hidden="true" />;
}

export async function Footer() {
  const t = await getTranslations("nav");
  const tFooter = await getTranslations("footer");
  const [contact, social, website] = await Promise.all([
    getContactSettings(),
    getSocialSettings(),
    getWebsiteSettings(),
  ]);

  const socialLinks = [
    { href: social?.instagram, label: "Instagram" },
    { href: social?.facebook, label: "Facebook" },
    { href: social?.twitter, label: "Twitter" },
    { href: social?.tiktok, label: "TikTok" },
    { href: social?.snapchat, label: "Snapchat" },
  ].filter((item): item is typeof item & { href: string } => Boolean(item.href));

  return (
    <footer className="relative overflow-hidden border-t border-border bg-[#0d1b12] text-white">
      <div className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-[#d6ad62]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 size-96 rounded-full bg-[#1e5739]/40 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr] lg:px-10">
        <div className="flex flex-col items-start">
          <Link href={PUBLIC_ROUTES.home} className="inline-flex items-center">
            <OptimizedImage
              src={website?.logoUrl ?? "/images/logo/logo2.png"}
              alt="Shiatsu Spa logo"
              width={200}
              height={125}
              className="h-24 w-auto object-contain object-left"
            />
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-6 text-white/65">{tFooter("tagline")}</p>
          <div className="mt-5 flex gap-2">
            {socialLinks.map(({ href, label }) => {
              return href ? (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-colors hover:border-[#d6ad62]/60 hover:bg-[#d6ad62] hover:text-[#0d1b12]">
                  <SocialIcon label={label} />
                </a>
              ) : null;
            })}
          </div>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-col gap-3">
          <h2 className="mb-1 text-sm font-semibold tracking-widest text-[#d6ad62] uppercase">Quick Links</h2>
          <Link href={PUBLIC_ROUTES.home} className="text-sm text-white/70 transition-colors hover:text-[#d6ad62]">
            {t("home")}
          </Link>
          <Link href={PUBLIC_ROUTES.about} className="text-sm text-white/70 transition-colors hover:text-[#d6ad62]">
            {t("about")}
          </Link>
          <Link href={PUBLIC_ROUTES.services} className="text-sm text-white/70 transition-colors hover:text-[#d6ad62]">
            {t("services")}
          </Link>
          <Link href={PUBLIC_ROUTES.contact} className="text-sm text-white/70 transition-colors hover:text-[#d6ad62]">
            {t("contact")}
          </Link>
        </nav>

        <div className="flex flex-col gap-3">
          <h2 className="mb-1 text-sm font-semibold tracking-widest text-[#d6ad62] uppercase">Contact Us</h2>
          {contact?.phones?.map((phone) => (
            <a
              key={phone}
              href={`tel:${phone}`}
              className="flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-[#d6ad62]"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-white/10"><Phone className="size-4" aria-hidden="true" /></span>
              {phone}
            </a>
          ))}
          {contact?.email ? (
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-[#d6ad62]"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-white/10"><Mail className="size-4" aria-hidden="true" /></span>
              <span className="break-all">{contact.email}</span>
            </a>
          ) : null}
          <Link href={PUBLIC_ROUTES.contact} className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[#d6ad62] transition-colors hover:text-white">
            {t("contact")} <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="relative border-t border-white/10 px-4 py-5 text-center text-xs text-white/45">
        {tFooter("copyright", { year: new Date().getFullYear() })}
      </div>
    </footer>
  );
}
