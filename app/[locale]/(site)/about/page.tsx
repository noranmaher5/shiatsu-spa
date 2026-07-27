import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AboutSection } from "@/features/settings";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");
  return {
    title: t("heading"),
    description: t("subheading"),
  };
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <AboutSection />
    </div>
  );
}
