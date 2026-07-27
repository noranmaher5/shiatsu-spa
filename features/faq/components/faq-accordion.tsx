"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { EmptyState } from "@/components/shared";
import type { FaqItem } from "../types";

type FaqAccordionProps = {
  items: FaqItem[];
};

export function FaqAccordion({ items }: FaqAccordionProps) {
  const locale = useLocale();
  const t = useTranslations("faq");

  if (items.length === 0) {
    return <EmptyState message={t("empty")} />;
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {items.map((item) => {
        const question = locale === "ar" ? item.question.ar : item.question.en;
        const answer = locale === "ar" ? item.answer.ar : item.answer.en;

        return (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="border-border/60 bg-card/50 hover:bg-card rounded-xl border px-6 py-1 transition-colors"
          >
            <AccordionTrigger className="text-base font-semibold">
              {question}
            </AccordionTrigger>
            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
