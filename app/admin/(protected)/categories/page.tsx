import { PageHeader } from "@/components/admin/page-header";
import { CategoriesManager } from "@/components/admin/categories/categories-manager";
import { getAllCategoriesAdmin } from "@/features/categories/api";

export const metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const categories = await getAllCategoriesAdmin();

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Group your services into categories for filtering."
      />
      <CategoriesManager categories={categories} />
    </div>
  );
}
