import { PageHeader } from "@/components/admin/page-header";
import { TestimonialsManager } from "@/components/admin/testimonials/testimonials-manager";
import { getAllTestimonialsAdmin } from "@/features/testimonials/api";

export const metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonialsAdmin();

  return (
    <div>
      <PageHeader title="Testimonials" description="Manage client reviews shown on your homepage." />
      <TestimonialsManager testimonials={testimonials} />
    </div>
  );
}
