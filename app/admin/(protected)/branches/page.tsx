import { PageHeader } from "@/components/admin/page-header";
import { BranchesManager } from "@/components/admin/branches/branches-manager";
import { getAllBranchesAdmin } from "@/features/branches/api";

export const metadata = { title: "Branches" };

export default async function AdminBranchesPage() {
  const branches = await getAllBranchesAdmin();

  return (
    <div>
      <PageHeader title="Branches" description="Manage your branch locations." />
      <BranchesManager branches={branches} />
    </div>
  );
}
