import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { ServiceForm } from "@/components/admin/services/service-form";
import { getServiceByIdAdmin } from "@/features/services/api";
import { getAllCategoriesAdmin } from "@/features/categories/api";

export const metadata = { title: "Edit Service" };

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [service, categories] = await Promise.all([
    getServiceByIdAdmin(id),
    getAllCategoriesAdmin(),
  ]);

  if (!service) notFound();

  return (
    <div>
      <PageHeader title="Edit Service" description={service.name.en} />
      <ServiceForm categories={categories} defaultOrder={service.order} service={service} />
    </div>
  );
}
