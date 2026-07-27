import { PageHeader } from "@/components/admin/page-header";
import { GalleryManager } from "@/components/admin/gallery/gallery-manager";
import { getAllGalleryItemsAdmin } from "@/features/gallery/api";

export const metadata = { title: "Gallery" };

export default async function AdminGalleryPage() {
  const items = await getAllGalleryItemsAdmin();

  return (
    <div>
      <PageHeader title="Gallery" description="Manage the photos shown on your gallery page." />
      <GalleryManager items={items} />
    </div>
  );
}
