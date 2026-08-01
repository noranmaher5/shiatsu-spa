import type { Article } from "./types";

function isTodo(value: string | undefined) {
  return !value || value.includes("[TODO:");
}

export function getArticleTitle(article: Article, locale: string) {
  if (locale === "ar" || !isTodo(article.title.en)) {
    return locale === "ar" ? article.title.ar : article.title.en;
  }
  return article.title.ar;
}

export function getArticleExcerpt(article: Article, locale: string) {
  const excerpt =
    locale === "ar" ? article.excerpt?.ar : article.excerpt?.en;
  if (excerpt && !isTodo(excerpt)) return excerpt;

  const content = locale === "ar" ? article.content.ar : article.content.en;
  if (isTodo(content)) return "";
  return content.slice(0, 160) + (content.length > 160 ? "…" : "");
}

export function getArticleContent(article: Article, locale: string) {
  if (locale === "ar" || !isTodo(article.content.en)) {
    return locale === "ar" ? article.content.ar : article.content.en;
  }
  return article.content.ar;
}

export function getArticleMetaTitle(article: Article, locale: string) {
  const meta =
    locale === "ar" ? article.metaTitle?.ar : article.metaTitle?.en;
  if (meta && !isTodo(meta)) return meta;
  return getArticleTitle(article, locale);
}

export function getArticleMetaDescription(article: Article, locale: string) {
  const meta =
    locale === "ar" ? article.metaDescription?.ar : article.metaDescription?.en;
  if (meta && !isTodo(meta)) return meta;
  return getArticleExcerpt(article, locale);
}
