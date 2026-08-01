import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { ArticleForm } from "@/components/admin/articles/article-form";
import { getArticleByIdAdmin } from "@/features/articles/api";

export const metadata = { title: "Edit Article" };

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleByIdAdmin(id);

  if (!article) notFound();

  return (
    <div>
      <PageHeader title="Edit Article" description={article.title.en} />
      <ArticleForm defaultOrder={article.order} article={article} />
    </div>
  );
}
