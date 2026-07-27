import { getLocale, getTranslations } from "next-intl/server";
import { getCompanySettings } from "../api";
import { EmptyState, FadeIn } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Target } from "lucide-react";

const ENGLISH_ABOUT =
  "Shiatsu Spa is an integrated men's destination for grooming and relaxation in Kuwait, combining authentic therapeutic techniques with modern luxury standards. We are not just a grooming place; we are a space designed for the man who values his time and seeks a real result: physical relaxation, mental clarity, and genuine recovery.\nSince opening in 2023, we have built our reputation on precision, complete privacy, and a level of service worthy of clients who expect the best and accept nothing less.";

const ENGLISH_VISION =
  "Our vision is for Shiatsu Spa to become Kuwait's leading men's wellness brand, delivering an elevated relaxation experience built on high quality and a commitment to Islamic values, and to become a recognized Gulf brand in men's spa services.";

const ENGLISH_MISSION =
  "To provide luxurious therapeutic and relaxation services with a professional approach, using natural and safe products in a comfortable and Sharia-compliant environment, with the goal of restoring balance to body, mind, and spirit.";

function usable(value: string | undefined, fallback: string) {
  return value && !value.includes("[TODO:") ? value : fallback;
}

export async function AboutSection() {
  const locale = await getLocale();
  const t = await getTranslations("about");
  const company = await getCompanySettings();

  if (!company) {
    return (
      <div className="py-16">
        <EmptyState message={t("empty")} />
      </div>
    );
  }

  const name = locale === "ar" ? company.name?.ar : company.name?.en;
  const slogan = locale === "ar" ? company.slogan?.ar : company.slogan?.en;
  const aboutUs = locale === "ar"
    ? company.aboutUs?.ar
    : usable(company.aboutUs?.en, ENGLISH_ABOUT);
  const vision = locale === "ar"
    ? company.vision?.ar
    : usable(company.vision?.en, ENGLISH_VISION);
  const mission = locale === "ar"
    ? company.mission?.ar
    : usable(company.mission?.en, ENGLISH_MISSION);

  return (
    <div className="space-y-16 py-8">
      <FadeIn>
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          {slogan && (
            <span className="text-primary text-xs font-semibold uppercase tracking-wider">
              {slogan}
            </span>
          )}
          <h1 className="font-sans text-4xl font-bold tracking-tight sm:text-5xl">
            {name || t("heading")}
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed pt-2">
            {aboutUs}
          </p>
        </div>
      </FadeIn>

      {(vision || mission) && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {vision && (
            <FadeIn delay={0.1}>
              <Card className="h-full border-border/60 bg-card/60 p-2">
                <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                  <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                    <Eye className="size-6" />
                  </div>
                  <CardTitle className="font-sans text-xl font-bold">
                    {t("vision")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed pt-2">{vision}</p>
                </CardContent>
              </Card>
            </FadeIn>
          )}

          {mission && (
            <FadeIn delay={0.2}>
              <Card className="h-full border-border/60 bg-card/60 p-2">
                <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                  <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                    <Target className="size-6" />
                  </div>
                  <CardTitle className="font-sans text-xl font-bold">
                    {t("mission")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed pt-2">{mission}</p>
                </CardContent>
              </Card>
            </FadeIn>
          )}
        </div>
      )}
    </div>
  );
}
