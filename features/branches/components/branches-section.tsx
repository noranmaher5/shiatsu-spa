import { getLocale, getTranslations } from "next-intl/server";
import { getActiveBranches } from "@/features/branches/api";
import { resolveBranchMapPins } from "@/features/branches/lib/google-maps";
import { BranchInfoCardHome } from "@/features/branches/components/branch-info-card-home";
import { KuwaitBranchesMap } from "@/features/branches/components/kuwait-branches-map";
import { EmptyState, FadeIn } from "@/components/shared";
import { Link } from "@/i18n/navigation";
import { PUBLIC_ROUTES } from "@/lib/constants";

export async function BranchesSection() {
  const locale = await getLocale();
  const tNav = await getTranslations("nav");
  const tBranches = await getTranslations("branches");
  const branches = await getActiveBranches();
  const mapPins = await resolveBranchMapPins(branches, locale);

  return (
    <section
      aria-labelledby="branches-heading"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
    >
      <FadeIn>
        <div className="mb-12 flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
          <div className="text-center sm:text-start">
            <h2
              id="branches-heading"
              className="font-serif-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              {tBranches("heading")}
            </h2>
            <div className="mx-auto mt-4 h-0.5 w-12 bg-primary/60 sm:mx-0" aria-hidden="true" />
            <p className="text-foreground/80 mt-4 max-w-xl text-base leading-relaxed">
              {tBranches("subheading")}
            </p>
          </div>
          <Link
            href={PUBLIC_ROUTES.contact}
            className="group flex shrink-0 items-center gap-2 rounded-full border border-primary/30 px-6 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            {tNav("contact")}
            <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
          </Link>
        </div>
      </FadeIn>

      {branches.length === 0 ? (
        <EmptyState message={tBranches("empty")} />
      ) : (
        <div className="space-y-8">
          <FadeIn>
            <KuwaitBranchesMap pins={mapPins} />
          </FadeIn>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {branches.map((branch, index) => (
              <FadeIn key={branch.id} delay={index * 0.1}>
                <BranchInfoCardHome branch={branch} />
              </FadeIn>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
