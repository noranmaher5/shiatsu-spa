import { getLocale } from "next-intl/server";
import { getHeroSettings } from "@/features/settings/api";
import { OptimizedImage } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { PUBLIC_ROUTES } from "@/lib/constants";
import { Award, ShieldCheck, Sparkles } from "lucide-react";

export async function HeroSection() {
  const locale = await getLocale();
  const hero = await getHeroSettings();
  const isArabic = locale === "ar";

  const fallback = {
    eyebrow: isArabic ? "شياتسو سبا · الكويت" : "Shiatsu Spa Kuwait",
    title: isArabic ? "استرخِ، استعد طاقتك،" : "Relax, Recharge,",
    titleAccent: isArabic ? "وتجدد." : "Revive.",
    subtitle: isArabic
      ? "تجربة عناية فاخرة مصممة خصيصًا للرجال، بلمسة علاجية خاصة وخصوصية تامة في الكويت."
      : "Luxury wellness tailored for gentlemen — therapeutic touch in a private, discreet retreat.",
    buttonText: isArabic ? "احجز الآن" : "Book Now",
  };

  const cmsText = (value: string | undefined, defaultValue: string) =>
    value && !value.includes("[TODO:") ? value : defaultValue;

  const eyebrow = fallback.eyebrow;
  const title = cmsText(hero ? (isArabic ? hero.title.ar : hero.title.en) : undefined, fallback.title);
  const titleAccent = fallback.titleAccent;
  const subtitle = cmsText(
    hero ? (isArabic ? hero.subtitle.ar : hero.subtitle.en) : undefined,
    fallback.subtitle,
  );
  const buttonText = cmsText(
    hero ? (isArabic ? hero.buttonText.ar : hero.buttonText.en) : undefined,
    fallback.buttonText,
  );

  const badges = [
    {
      icon: Sparkles,
      label: isArabic ? "لمسة بجودة عالية" : "Quality Touch",
    },
    {
      icon: Award,
      label: isArabic ? "معالجون محترفون" : "Expert Therapists",
    },
    {
      icon: ShieldCheck,
      label: isArabic ? "خصوصية تامة" : "Complete Privacy",
    },
  ];

  return (
    <section
      aria-label={isArabic ? "القسم الرئيسي" : "Hero"}
      className="relative flex min-h-[640px] flex-col overflow-hidden sm:min-h-[720px] lg:min-h-[820px]"
    >
      <div className="absolute inset-0 -z-20">
        <OptimizedImage
          src={hero?.backgroundImageUrl ?? "/images/hero/hero.jpg"}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(100deg, rgba(10,18,12,0.92) 0%, rgba(10,18,12,0.72) 32%, rgba(10,18,12,0.25) 60%, rgba(10,18,12,0.15) 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0a120c]/70 via-transparent to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-1 items-center pt-20 sm:pt-24">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-10">
          <div className="max-w-md">
            <span className="mb-4 block text-xs font-semibold tracking-[0.3em] text-white/90 uppercase">
              {eyebrow}
            </span>

            <h1 className="font-serif-heading text-4xl leading-[1.1] font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <span className="font-script-title text-primary glow-primary -mt-1 block text-5xl sm:text-6xl lg:text-7xl">
              {titleAccent}
            </span>

            <div className="bg-primary/60 my-6 h-0.5 w-16" aria-hidden="true" />

            <p className="text-base leading-relaxed text-white/85 sm:text-lg">{subtitle}</p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 text-base font-semibold shadow-soft transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-card"
              >
                <a href={hero?.buttonLink ?? "https://wa.me/96566555872"}>{buttonText}</a>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-primary/40 px-8 text-base font-semibold text-white hover:bg-primary/10"
              >
                <Link href={PUBLIC_ROUTES.services}>
                  {isArabic ? "استكشف الخدمات" : "Explore Services"}
                </Link>
              </Button>
            </div>
          </div>

          <div className="hidden shrink-0 flex-col items-center gap-6 sm:flex lg:gap-6">
            <div className="flex gap-4 lg:gap-6">
              {badges.map(({ icon: Icon, label }) => (
                <div key={label} className="flex w-20 flex-col items-center gap-2 text-center sm:w-24">
                  <div className="border-primary/40 bg-card/80 shadow-card flex size-12 items-center justify-center rounded-full border backdrop-blur-md sm:size-14">
                    <Icon className="text-primary size-5 sm:size-6" aria-hidden="true" />
                  </div>
                  <span className="text-[10px] leading-tight font-medium tracking-wide text-white/90 uppercase sm:text-xs">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="w-full max-w-3xl rounded-md border border-primary/30 bg-[#072617]/80 px-6 py-4 backdrop-blur-md">
              <p className="font-serif-heading text-center text-base text-white/95 sm:text-lg">
                {isArabic ? (
                  <>
                    حيث تلتقي <span className="text-primary glow-primary">الأناقة بالأصالة</span>
                  </>
                ) : (
                  <>
                    Where Style <span className="text-primary glow-primary">Meets Tradition</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
