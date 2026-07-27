import Link from "next/link";
import { Plus } from "lucide-react";
import { ADMIN_ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/page-header";
import { ServicesTable } from "@/components/admin/services/services-table";
import { getAllServicesAdmin } from "@/features/services/api";
import { getAllCategoriesAdmin } from "@/features/categories/api";

export const metadata = { title: "Services" };

export default async function AdminServicesPage() {
  const [services, categories] = await Promise.all([
    getAllServicesAdmin(),
    getAllCategoriesAdmin(),
  ]);

  return (
    <div>
      <PageHeader
        title="Services"
        description="Manage the treatments and pricing shown on your website."
        action={
          <Button asChild>
            <Link href={ADMIN_ROUTES.newService}>
              <Plus aria-hidden="true" />
              New Service
            </Link>
          </Button>
        }
      />
      <ServicesTable services={services} categories={categories} />
    </div>
  );
}
