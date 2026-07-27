import { getTranslations } from "next-intl/server";
import { getActiveFaqs } from "../api";
import { FaqAccordion } from "./faq-accordion";
import { FadeIn } from "@/components/shared";

export async function FaqSection() {
  const tHome = await getTranslations("home");
  const faqs = await getActiveFaqs();

  return (
    <section
      aria-labelledby="faq-heading"
      className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8"
    >
      <FadeIn>
        <div className="mb-12 text-center">
          <h2
            id="faq-heading"
            className="font-serif-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            {tHome("faq.heading")}
          </h2>
          <div className="mx-auto mt-4 h-0.5 w-12 bg-primary/60" aria-hidden="true" />
          <p className="text-foreground/80 mx-auto mt-4 max-w-xl text-base leading-relaxed">
            {tHome("faq.subheading")}
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <FaqAccordion items={faqs} />
      </FadeIn>
    </section>
  );
}
