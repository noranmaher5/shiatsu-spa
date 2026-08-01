import { PageHeader } from "@/components/admin/page-header";
import { ArticleForm } from "@/components/admin/articles/article-form";
import { getAllArticlesAdmin } from "@/features/articles/api";

export const metadata = { title: "New Article" };

export default async function NewArticlePage() {
  const articles = await getAllArticlesAdmin();

  return (
    <div>
      <PageHeader title="New Article" description="Write a new article for your website." />
      <ArticleForm defaultOrder={articles.length} />
    </div>
  );
}
