import Link from "next/link";
import { Plus } from "lucide-react";
import { ADMIN_ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/page-header";
import { ArticlesTable } from "@/components/admin/articles/articles-table";
import { getAllArticlesAdmin } from "@/features/articles/api";

export const metadata = { title: "Articles" };

export default async function AdminArticlesPage() {
  const articles = await getAllArticlesAdmin();

  return (
    <div>
      <PageHeader
        title="Articles"
        description="Manage blog articles for SEO and content marketing."
        action={
          <Button asChild>
            <Link href={ADMIN_ROUTES.newArticle}>
              <Plus aria-hidden="true" />
              New Article
            </Link>
          </Button>
        }
      />
      <ArticlesTable articles={articles} />
    </div>
  );
}
