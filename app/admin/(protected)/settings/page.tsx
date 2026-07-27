import { PageHeader } from "@/components/admin/page-header";
import { HeroSettingsForm } from "@/components/admin/settings/hero-settings-form";
import { CompanySettingsForm } from "@/components/admin/settings/company-settings-form";
import { ContactSettingsForm } from "@/components/admin/settings/contact-settings-form";
import { SocialSettingsForm } from "@/components/admin/settings/social-settings-form";
import { SeoSettingsForm } from "@/components/admin/settings/seo-settings-form";
import { WebsiteSettingsForm } from "@/components/admin/settings/website-settings-form";
import { getSettingsDocAdmin } from "@/features/settings/api";
import type {
  HeroSettings,
  CompanySettings,
  ContactSettings,
  SocialSettings,
  SeoSettings,
  WebsiteSettings,
} from "@/features/settings/types";

export const metadata = { title: "Settings" };

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-6" id={title.toLowerCase().replace(/\s+/g, "-")}>
      <h2 className="font-sans text-base font-semibold text-foreground">{title}</h2>
      {description && <p className="text-muted-foreground mb-4 mt-1 text-sm">{description}</p>}
      <div className={description ? "" : "mt-4"}>{children}</div>
    </section>
  );
}

/**
 * A single unified settings page rather than separate routes per
 * document — matches the "lightweight CMS" scope. Each section still
 * saves independently (its own Server Action + revalidateTag), so
 * one section's mistake can't block saving another.
 */
export default async function AdminSettingsPage() {
  const [hero, company, contact, social, seo, website] = await Promise.all([
    getSettingsDocAdmin<HeroSettings>("hero"),
    getSettingsDocAdmin<CompanySettings>("company"),
    getSettingsDocAdmin<ContactSettings>("contact"),
    getSettingsDocAdmin<SocialSettings>("social"),
    getSettingsDocAdmin<SeoSettings>("seo"),
    getSettingsDocAdmin<WebsiteSettings>("website"),
  ]);

  return (
    <div>
      <PageHeader
        title="Website Settings"
        description="Manage your logo, hero, about content, contact info, social links, and SEO — all in one place."
      />

      <div className="flex flex-col gap-6">
        <Section title="Logo & Metadata" description="Site logo, business hours, and tracking IDs.">
          <WebsiteSettingsForm initialData={website} />
        </Section>

        <Section title="Hero" description="The main banner shown at the top of your homepage.">
          <HeroSettingsForm initialData={hero} />
        </Section>

        <Section title="About" description="Company name, slogan, and the content shown on your About page.">
          <CompanySettingsForm initialData={company} />
        </Section>

        <Section title="Contact Information" description="Phone numbers, WhatsApp, and email.">
          <ContactSettingsForm initialData={contact} />
        </Section>

        <Section title="Social Links">
          <SocialSettingsForm initialData={social} />
        </Section>

        <Section title="SEO" description="Search engine title, description, keywords, and preview image.">
          <SeoSettingsForm initialData={seo} />
        </Section>
      </div>
    </div>
  );
}
