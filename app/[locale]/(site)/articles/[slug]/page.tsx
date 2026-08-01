import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleBySlug, ArticleDetail, ArticleJsonLd } from "@/features/articles";
import {
  getArticleMetaDescription,
  getArticleMetaTitle,
} from "@/features/articles/content";

export const revalidate = 3600;

type ArticleDetailPageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Article Not Found" };
  }

  const title = getArticleMetaTitle(article, locale);
  const description = getArticleMetaDescription(article, locale);

  return {
    title: `${title} | Shiatsu Spa Kuwait`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
      images: article.coverImageUrl ? [{ url: article.coverImageUrl }] : undefined,
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug, locale } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <ArticleJsonLd article={article} locale={locale} />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <ArticleDetail article={article} />
      </div>
    </>
  );
}
