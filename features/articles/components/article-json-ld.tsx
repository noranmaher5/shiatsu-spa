import type { Article } from "../types";
import { getArticleMetaDescription, getArticleMetaTitle } from "../content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shiatsuspa.org";

type ArticleJsonLdProps = {
  article: Article;
  locale: string;
};

export function ArticleJsonLd({ article, locale }: ArticleJsonLdProps) {
  const title = getArticleMetaTitle(article, locale);
  const description = getArticleMetaDescription(article, locale);
  const author =
    locale === "ar" ? article.author?.ar : article.author?.en;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: article.coverImageUrl || undefined,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: author && !author.includes("[TODO:")
      ? { "@type": "Person", name: author }
      : { "@type": "Organization", name: "Shiatsu Spa Kuwait" },
    publisher: {
      "@type": "Organization",
      name: "Shiatsu Spa Kuwait",
      url: siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/${locale}/articles/${article.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
