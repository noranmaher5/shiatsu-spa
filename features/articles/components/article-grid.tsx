"use client";

import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/shared";
import { ArticleCard } from "./article-card";
import type { Article } from "../types";

type ArticleGridProps = {
  articles: Article[];
};

export function ArticleGrid({ articles }: ArticleGridProps) {
  const t = useTranslations("articles");

  if (articles.length === 0) {
    return <EmptyState message={t("noArticles")} />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
