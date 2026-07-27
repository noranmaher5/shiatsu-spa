import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ContactSection } from "@/features/settings";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact");
  return {
    title: t("heading"),
    description: t("subheading"),
  };
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <ContactSection />
    </div>
  );
}
