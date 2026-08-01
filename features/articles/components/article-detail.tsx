"use client";

import { useLocale, useTranslations } from "next-intl";
import { Calendar, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { OptimizedImage } from "@/components/shared";
import { PUBLIC_ROUTES } from "@/lib/constants";
import type { Article } from "../types";
import { getArticleContent, getArticleTitle } from "../content";

type ArticleDetailProps = {
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

export function ArticleDetail({ article }: ArticleDetailProps) {
  const locale = useLocale();
  const t = useTranslations("articles");
  const title = getArticleTitle(article, locale);
  const content = getArticleContent(article, locale);
  const author =
    locale === "ar" ? article.author?.ar : article.author?.en;

  return (
    <article className="mx-auto max-w-4xl space-y-8 py-8">
      <Link
        href={PUBLIC_ROUTES.articles}
        className="text-muted-foreground hover:text-primary inline-flex items-center gap-2 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="size-4 rtl:rotate-180" />
        {t("backToArticles")}
      </Link>

      <header className="space-y-4">
        <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-4" aria-hidden="true" />
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, locale)}</time>
          </span>
          {author && author.trim() && !author.includes("[TODO:") && (
            <>
              <span aria-hidden="true">·</span>
              <span>{author}</span>
            </>
          )}
        </div>
        <h1 className="font-sans text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {title}
        </h1>
      </header>

      {article.coverImageUrl && (
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-secondary/30">
          <OptimizedImage
            src={article.coverImageUrl}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 900px"
            priority
            className="object-cover"
          />
        </div>
      )}

      <div className="border-border bg-card rounded-2xl border p-6 sm:p-10">
        <div className="text-muted-foreground prose prose-invert max-w-none leading-relaxed whitespace-pre-line">
          {content}
        </div>
      </div>
    </article>
  );
}
