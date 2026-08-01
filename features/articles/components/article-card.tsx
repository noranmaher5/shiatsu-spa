"use client";

import { useLocale, useTranslations } from "next-intl";
import { Calendar, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { OptimizedImage } from "@/components/shared";
import { Link } from "@/i18n/navigation";
import { PUBLIC_ROUTES } from "@/lib/constants";
import type { Article } from "../types";
import { getArticleExcerpt, getArticleTitle } from "../content";

type ArticleCardProps = {
  article: Article;
};

function formatDate(dateStr: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-KW" : "en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export function ArticleCard({ article }: ArticleCardProps) {
  const locale = useLocale();
  const t = useTranslations("common");
  const title = getArticleTitle(article, locale);
  const excerpt = getArticleExcerpt(article, locale);

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-2xl border-border/60 bg-card/80 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.85)] transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_24px_60px_-30px_rgba(197,164,103,0.3)]">
      <Link href={PUBLIC_ROUTES.articleDetail(article.slug)} className="flex flex-1 flex-col">
        <div className="relative aspect-[16/9] overflow-hidden bg-secondary/40">
          {article.coverImageUrl ? (
            <OptimizedImage
              src={article.coverImageUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="text-muted-foreground/60 flex size-full items-center justify-center text-sm font-medium">
              {title}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="text-muted-foreground mb-3 flex items-center gap-1.5 text-xs">
            <Calendar className="size-3.5" aria-hidden="true" />
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, locale)}</time>
          </div>

          <h2 className="font-serif-heading text-xl font-bold tracking-tight text-white transition-colors group-hover:text-primary sm:text-2xl">
            {title}
          </h2>

          {excerpt && (
            <p className="text-foreground/70 mt-3 line-clamp-3 flex-1 text-sm leading-relaxed">
              {excerpt}
            </p>
          )}

          <span className="text-primary mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
            {t("readMore")}
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </Card>
  );
}
