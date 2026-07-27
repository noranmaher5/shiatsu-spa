import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { PUBLIC_ROUTES } from "@/lib/constants";

export default async function SiteNotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <span className="text-primary font-serif-heading text-6xl font-bold">404</span>
      <h1 className="mt-4 font-sans text-3xl font-bold tracking-tight">{t("title")}</h1>
      <p className="text-muted-foreground mt-3 text-base leading-relaxed">
        {t("description")}
      </p>
      <Button asChild className="mt-8">
        <Link href={PUBLIC_ROUTES.home}>{t("backHome")}</Link>
      </Button>
    </div>
  );
}
