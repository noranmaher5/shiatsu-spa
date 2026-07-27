import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PUBLIC_ROUTES } from "@/lib/constants";
import { FadeIn, OptimizedImage } from "@/components/shared";
import { ArrowUpRight } from "lucide-react";

/**
 * Static brand copy — the client does not want this section editable
 * from the admin dashboard, so it's fixed here instead of coming from
 * Firestore (`settings/company`). Update these strings directly in
 * code if the copy ever needs to change.
 */
const COMPANY = {
  name: { en: "Shiatsu Spa", ar: "شياتسو سبا" },
  welcome: { en: "Welcome to", ar: "أهلاً بكم في" },
  teaser: {
    en: "Shiatsu Spa is a complete men's grooming and relaxation destination in Kuwait, blending the authenticity of traditional therapeutic technique with the highest standards of modern luxury.",
    ar: "شياتسو سبا هو وجهة رجالية متكاملة للعناية والاسترخاء في الكويت، تجمع بين أصالة تقنيات العلاج وأحدث معايير الرفاهية الحديثة.",
  },
  headline: {
    en: "LUXURY PRIVATE SPA EXPERIENCE FOR MEN",
    ar: "تجربة سبا خاصة فاخرة للرجال",
  },
  extended: {
    en: "We're not just a massage place — we're a space built for a man who values his time and expects a real result: physical relaxation, mental clarity, and genuine recovery. Since opening in 2023, we've built our reputation on precision, complete privacy, and a level of service that matches clients who expect the best and accept nothing less.",
    ar: "لسنا مجرد مكان للتدليك؛ نحن مساحة مصممة خصيصًا لرجل يقدّر وقته ويبحث عن نتيجة حقيقية: استرخاء جسدي، وضوح ذهني، وتعافٍ فعلي.\nمنذ انطلاقتنا في عام 2023، بنينا سمعتنا على الدقة في التنفيذ، والخصوصية التامة، ومستوى خدمة يليق بعملاء يتوقعون الأفضل ولا يقبلون بأقل منه.",
  },
  more: { en: "More", ar: "المزيد" },
};

const ABOUT_IMAGES = [
  {
    src: "/images/about_us/frame1.jpg",
    alt: { en: "Spa treatment detail", ar: "تفاصيل علاج السبا" },
    className:
      "aspect-[3/4] w-[42%] max-w-[340px] -translate-y-8 sm:max-w-[360px] lg:-translate-y-12 lg:max-w-[380px]",
    priority: false,
  },
  {
    src: "/images/about_us/frame2.jpg",
    alt: { en: "Relaxing spa moment", ar: "لحظة استرخاء في السبا" },
    className:
      "aspect-[3/4.2] w-[34%] max-w-[280px] -translate-y-3 sm:max-w-[300px] lg:max-w-[320px]",
    priority: true,
  },
] as const;

const WIDE_IMAGE = {
  src: "/images/about_us/frame3.png",
  alt: { en: "Luxury spa atmosphere", ar: "أجواء السبا الفاخرة" },
} as const;

export async function AboutTeaser() {
  const locale = await getLocale();
  const t = await getTranslations("nav");

  const welcome = locale === "ar" ? COMPANY.welcome.ar : COMPANY.welcome.en;
  const name = locale === "ar" ? COMPANY.name.ar : COMPANY.name.en;
  const teaser = locale === "ar" ? COMPANY.teaser.ar : COMPANY.teaser.en;
  const headline = locale === "ar" ? COMPANY.headline.ar : COMPANY.headline.en;
  const extended = locale === "ar" ? COMPANY.extended.ar : COMPANY.extended.en;
  const moreLabel = locale === "ar" ? COMPANY.more.ar : COMPANY.more.en;
  const wideImageAlt = locale === "ar" ? WIDE_IMAGE.alt.ar : WIDE_IMAGE.alt.en;

  const nameLines = name.split(" ");

  return (
    <section
      aria-labelledby="about-teaser-heading"
      className="relative overflow-hidden bg-background py-20 sm:py-24 lg:py-28"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top row — welcome, images, teaser */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.45fr)_minmax(0,1fr)] lg:items-center lg:gap-8 xl:gap-12">
          <FadeIn direction="right">
            <div className="space-y-2 lg:max-w-xs">
              <p className="font-script-title text-primary text-2xl sm:text-3xl">{welcome}</p>
              <h2
                id="about-teaser-heading"
                className="font-serif-heading flex flex-wrap items-baseline gap-x-3 text-4xl leading-[1.05] font-bold tracking-tight text-white sm:text-5xl lg:text-[3.25rem]"
              >
                {nameLines.map((line, index) => (
                  <span key={index}>{line}</span>
                ))}
              </h2>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.1}>
            <div className="flex items-end justify-center gap-1.5 sm:gap-2 lg:gap-2.5">
              {ABOUT_IMAGES.map((image) => (
                <div
                  key={image.src}
                  className={`rounded-arch relative overflow-hidden shadow-[0_24px_80px_-40px_rgba(0,0,0,0.7)] ${image.className}`}
                >
                  <OptimizedImage
                    src={image.src}
                    alt={locale === "ar" ? image.alt.ar : image.alt.en}
                    fill
                    priority={image.priority}
                    sizes="(min-width: 1024px) 18vw, 40vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn direction="left" delay={0.15}>
            <div className="flex flex-col gap-8 lg:max-w-sm lg:justify-self-end">
              <p className="text-sm leading-relaxed sm:text-base" style={{ color: "#ffff" }}>{teaser}</p>
              <Link
                href={PUBLIC_ROUTES.about}
                className="border-border/80 bg-brand-olive/60 hover:bg-brand-olive inline-flex w-fit items-center gap-2 rounded-full border px-6 py-2.5 text-sm font-medium text-white transition-colors duration-300"
              >
                {moreLabel}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* Bottom row — headline + extended copy */}
        <div className="mt-20 grid gap-10 lg:mt-24 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-16 xl:gap-24">
          <FadeIn direction="up" delay={0.1}>
            <div className="space-y-10">
              <p
                className="font-serif-heading text-2xl leading-snug font-bold tracking-wide uppercase sm:text-3xl lg:text-[2rem] lg:leading-tight"
                style={{ color: "#D8BF88" }}
              >
                {headline}
              </p>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
                <OptimizedImage
                  src={WIDE_IMAGE.src}
                  alt={wideImageAlt}
                  fill
                  sizes="(min-width: 1024px) 44vw, 90vw"
                  className="object-cover"
                />
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="left" delay={0.2}>
            <p
              className="max-w-lg text-sm leading-relaxed whitespace-pre-line sm:text-base lg:pb-2"
              style={{ color: "#fff" }}
            >
              {extended}
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}