import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug, ServiceDetail } from "@/features/services";
import { getContactSettings } from "@/features/settings";

export const revalidate = 3600;

type ServiceDetailPageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  const title = locale === "ar" ? service.name.ar : service.name.en;
  const description =
    locale === "ar"
      ? service.shortDescription?.ar || service.description.ar
      : service.shortDescription?.en || service.description.en;

  return {
    title: `${title} | Shiatsu Spa Kuwait`,
    description,
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const [service, contact] = await Promise.all([
    getServiceBySlug(slug),
    getContactSettings(),
  ]);

  if (!service) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <ServiceDetail service={service} whatsappPhone={contact?.whatsapp} />
    </div>
  );
}
