import Link from "next/link";
import { ADMIN_ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="text-primary font-serif-heading text-6xl font-bold">404</span>
      <h1 className="font-sans text-2xl font-bold text-foreground">Not Found</h1>
      <p className="text-muted-foreground max-w-sm text-sm">
        The item you&apos;re looking for doesn&apos;t exist or may have been deleted.
      </p>
      <Button asChild>
        <Link href={ADMIN_ROUTES.dashboard}>Back to Dashboard</Link>
      </Button>
    </div>
  );
}
