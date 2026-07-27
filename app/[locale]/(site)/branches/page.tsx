import { redirect } from "next/navigation";
import { PUBLIC_ROUTES } from "@/lib/constants";

export default function BranchesPage() {
  redirect(PUBLIC_ROUTES.contact);
}
