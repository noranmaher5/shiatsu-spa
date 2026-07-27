"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2, Star, Clock, Sparkles } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ADMIN_ROUTES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { deleteService, toggleServiceActive } from "@/features/services/actions";
import type { Service } from "@/features/services/types";
import type { Category } from "@/features/categories/types";

export function ServicesTable({
  services,
  categories,
}: {
  services: Service[];
  categories: Category[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  const categoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.name.en ?? "—";

  function handleToggle(service: Service, next: boolean) {
    setPendingToggleId(service.id);
    startTransition(async () => {
      const result = await toggleServiceActive(service.id, next);
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success(next ? "Service activated." : "Service deactivated.");
        router.refresh();
      }
      setPendingToggleId(null);
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteService(deleteTarget.id, deleteTarget.slug);
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success("Service deleted.");
        router.refresh();
      }
      setDeleteTarget(null);
    });
  }

  if (services.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground shadow-xs">
        <Sparkles className="mx-auto size-8 text-muted-foreground/50 mb-3" />
        No services yet. Create your first treatment to get started.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="border-b border-border/80 hover:bg-transparent">
            <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider">Service Name</TableHead>
            <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider">Category</TableHead>
            <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider">Price</TableHead>
            <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider">Duration</TableHead>
            <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider">Status</TableHead>
            <TableHead className="text-end font-semibold text-foreground text-xs uppercase tracking-wider">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id} className="transition-colors hover:bg-muted/30">
              <TableCell className="font-medium text-foreground py-4">
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold text-sm text-foreground">{service.name.en}</span>
                  {service.isFeatured && (
                    <Badge variant="outline" className="gap-1 border-amber-500/30 bg-amber-500/10 text-amber-700 text-[10px] font-bold">
                      <Star className="size-3 fill-amber-500/20 text-amber-600" /> Featured
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="inline-flex rounded-full bg-muted/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {categoryName(service.categoryId)}
                </span>
              </TableCell>
              <TableCell className="font-semibold text-sm text-[#143725]">
                {formatPrice(service.price, "en")}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3.5" />
                  {service.durationMinutes} min
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={service.isActive}
                    onCheckedChange={(next) => handleToggle(service, next)}
                    disabled={isPending && pendingToggleId === service.id}
                    aria-label={`Toggle ${service.name.en} active`}
                  />
                  <span className={`text-xs font-medium ${service.isActive ? "text-emerald-700 font-semibold" : "text-muted-foreground"}`}>
                    {service.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1.5">
                  <Button variant="ghost" size="icon" asChild className="size-8 rounded-lg hover:bg-[#143725]/10 hover:text-[#143725]">
                    <Link href={ADMIN_ROUTES.editService(service.id)} aria-label="Edit">
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTarget(service)}
                    aria-label="Delete"
                    className="size-8 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete service?"
        description={`"${deleteTarget?.name.en}" will be permanently removed from your website. This can't be undone.`}
        confirmLabel="Delete"
        isLoading={isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
