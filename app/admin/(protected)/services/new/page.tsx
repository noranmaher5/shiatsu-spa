import { PageHeader } from "@/components/admin/page-header";
import { ServiceForm } from "@/components/admin/services/service-form";
import { getAllServicesAdmin } from "@/features/services/api";
import { getAllCategoriesAdmin } from "@/features/categories/api";

export const metadata = { title: "New Service" };

export default async function NewServicePage() {
  const [services, categories] = await Promise.all([
    getAllServicesAdmin(),
    getAllCategoriesAdmin(),
  ]);

  return (
    <div>
      <PageHeader title="New Service" description="Add a new treatment to your website." />
      <ServiceForm categories={categories} defaultOrder={services.length} />
    </div>
  );
}
