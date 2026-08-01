import { getLocale, getTranslations } from "next-intl/server";
import { Phone, Mail, Clock } from "lucide-react";
import { getContactSettings, getWebsiteSettings } from "../api";
import { getActiveBranches } from "@/features/branches/api";
import { BranchDetail } from "@/features/branches/components/branch-detail";
import { WhatsAppButton, EmptyState, FadeIn } from "@/components/shared";
import { Card, CardContent } from "@/components/ui/card";

export async function ContactSection() {
  const locale = await getLocale();
  const t = await getTranslations("common");
  const tContact = await getTranslations("contact");
  const [contact, website, branches] = await Promise.all([
    getContactSettings(),
    getWebsiteSettings(),
    getActiveBranches(),
  ]);

  const businessHours =
    website && website.businessHours
      ? locale === "ar"
        ? website.businessHours.ar
        : website.businessHours.en
      : null;

  return (
    <div className="space-y-16 py-8">
      <FadeIn>
        <div className="text-center">
          <h1 className="font-sans text-4xl font-bold tracking-tight sm:text-5xl">
            {tContact("heading")}
          </h1>
          <p className="text-muted-foreground mt-3 text-base sm:text-lg">
            {tContact("subheading")}
          </p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {contact?.phones && contact.phones.length > 0 && (
          <FadeIn delay={0.1}>
            <Card className="h-full border-border/60 bg-card/60">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">
                  <Phone className="size-6" />
                </div>
                <h3 className="font-sans text-lg font-semibold">
                  {tContact("phone")}
                </h3>
                <div className="mt-3 flex w-full flex-col gap-2">
                  {contact.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone}`}
                      dir="ltr"
                      className="flex items-center justify-center rounded-xl border border-primary/15 bg-primary/5 px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                    >
                      <span className="font-mono tracking-[0.04em]">{phone}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        )}

        {contact?.email && (
          <FadeIn delay={0.2}>
            <Card className="h-full border-border/60 bg-card/60">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">
                  <Mail className="size-6" />
                </div>
                <h3 className="font-sans text-lg font-semibold">
                  {tContact("email")}
                </h3>
                <a
                  href={`mailto:${contact.email}`}
                  className="mt-3 inline-flex rounded-xl border border-primary/15 bg-primary/5 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                >
                  <span className="break-all">{contact.email}</span>
                </a>
              </CardContent>
            </Card>
          </FadeIn>
        )}

        {contact?.whatsapp && (
          <FadeIn delay={0.3}>
            <Card className="h-full border-border/60 bg-card/60">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">
                  <Clock className="size-6" />
                </div>
                <h3 className="font-sans text-lg font-semibold">
                  {tContact("directBooking")}
                </h3>
                {businessHours && (
                  <p className="text-muted-foreground mt-1 text-xs">{businessHours}</p>
                )}
                <div className="mt-4">
                  <WhatsAppButton
                    phoneNumber={contact.whatsapp}
                    label={t("bookNow")}
                    size="sm"
                  />
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        )}
      </div>

      <div className="space-y-8">
        <h2 className="font-sans text-2xl font-bold">
          {tContact("branchesMap")}
        </h2>
        {branches.length === 0 ? (
          <EmptyState message={tContact("empty")} />
        ) : (
          <div className="flex flex-col gap-10">
            {branches.map((branch) => (
              <BranchDetail key={branch.id} branch={branch} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
