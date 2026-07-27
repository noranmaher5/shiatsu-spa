"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Save, Building2, MapPin, Phone } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { BilingualField } from "@/components/admin/bilingual-field";
import { ImageUploader } from "@/components/admin/image-uploader";
import { branchFormSchema, type BranchFormValues } from "@/features/branches/schema";
import {
  createBranch,
  updateBranch,
  deleteBranch,
  toggleBranchActive,
} from "@/features/branches/actions";
import type { Branch } from "@/features/branches/types";

function emptyValues(order: number): BranchFormValues {
  return {
    name: { en: "", ar: "" },
    address: { en: "", ar: "" },
    phone: "",
    whatsapp: "",
    workingHours: { en: "", ar: "" },
    coverImageUrl: null,
    googleMapsUrl: "",
    latitude: undefined,
    longitude: undefined,
    order,
    isActive: true,
  };
}

export function BranchesManager({ branches }: { branches: Branch[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Branch | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Branch | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: emptyValues(branches.length),
  });

  function openCreate() {
    setEditing(null);
    reset(emptyValues(branches.length));
    setFormOpen(true);
  }

  function openEdit(branch: Branch) {
    setEditing(branch);
    reset({
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      whatsapp: branch.whatsapp,
      workingHours: branch.workingHours,
      coverImageUrl: branch.coverImageUrl,
      googleMapsUrl: branch.googleMapsUrl,
      latitude: branch.latitude,
      longitude: branch.longitude,
      order: branch.order,
      isActive: branch.isActive,
    });
    setFormOpen(true);
  }

  async function onSubmit(values: BranchFormValues) {
    setIsSubmitting(true);
    const result = editing
      ? await updateBranch(editing.id, values)
      : await createBranch(values);

    if (!result.success) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }

    toast.success(editing ? "Branch updated." : "Branch created.");
    setIsSubmitting(false);
    setFormOpen(false);
    router.refresh();
  }

  function handleToggle(branch: Branch, next: boolean) {
    startTransition(async () => {
      const result = await toggleBranchActive(branch.id, next);
      if (!result.success) toast.error(result.error);
      else router.refresh();
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteBranch(deleteTarget.id);
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success("Branch deleted.");
        router.refresh();
      }
      setDeleteTarget(null);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate} className="rounded-xl bg-[#143725] text-white hover:bg-[#0d1b12] shadow-xs gap-2">
          <Plus className="size-4" aria-hidden="true" />
          Add New Branch
        </Button>
      </div>

      {branches.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground shadow-xs">
          <Building2 className="mx-auto size-8 text-muted-foreground/50 mb-3" />
          No branches yet. Add your first location to get started.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="border-b border-border/80 hover:bg-transparent">
                <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider">Branch Location</TableHead>
                <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider">Phone / WhatsApp</TableHead>
                <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider">Display Order</TableHead>
                <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-end font-semibold text-foreground text-xs uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map((branch) => (
                <TableRow key={branch.id} className="transition-colors hover:bg-muted/30">
                  <TableCell className="font-medium text-foreground py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-sm text-foreground flex items-center gap-2">
                        <MapPin className="size-3.5 text-[#c89c47]" />
                        {branch.name.en}
                      </span>
                      <span className="text-xs text-muted-foreground line-clamp-1 ps-5">
                        {branch.address.en}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 font-mono">
                      <Phone className="size-3.5 text-muted-foreground/70" />
                      {branch.phone}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex size-7 items-center justify-center rounded-lg bg-muted/60 text-xs font-bold text-foreground">
                      {branch.order}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={branch.isActive}
                        onCheckedChange={(next) => handleToggle(branch, next)}
                        disabled={isPending}
                        aria-label={`Toggle ${branch.name.en} active`}
                      />
                      <span className={`text-xs font-medium ${branch.isActive ? "text-emerald-700 font-semibold" : "text-muted-foreground"}`}>
                        {branch.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1.5">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(branch)} aria-label="Edit" className="size-8 rounded-lg hover:bg-[#143725]/10 hover:text-[#143725]">
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(branch)}
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
        </div>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6">
          <DialogHeader className="border-b border-border/60 pb-3">
            <DialogTitle className="font-serif-heading text-xl font-bold text-foreground">
              {editing ? "Edit Branch Location" : "Add New Branch"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-2">
            <BilingualField label="Branch Name" name="name" register={register} errors={errors} />
            <BilingualField
              label="Address Details"
              name="address"
              register={register}
              errors={errors}
              multiline
            />
            <BilingualField
              label="Working Hours"
              name="workingHours"
              register={register}
              errors={errors}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Phone Number" htmlFor="phone" required error={errors.phone?.message}>
                <Input id="phone" dir="ltr" placeholder="+96550890601" {...register("phone")} className="rounded-xl" />
              </Field>
              <Field label="WhatsApp Number" htmlFor="whatsapp" required error={errors.whatsapp?.message}>
                <Input id="whatsapp" dir="ltr" placeholder="+96550890601" {...register("whatsapp")} className="rounded-xl" />
              </Field>
            </div>

            <Field
              label="Google Maps Embed / Navigation URL"
              htmlFor="googleMapsUrl"
              required
              error={errors.googleMapsUrl?.message}
            >
              <Input id="googleMapsUrl" dir="ltr" {...register("googleMapsUrl")} className="rounded-xl" />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Latitude" htmlFor="latitude" error={errors.latitude?.message}>
                <Input id="latitude" type="number" step="any" dir="ltr" placeholder="29.257" {...register("latitude", { valueAsNumber: true })} className="rounded-xl" />
              </Field>
              <Field label="Longitude" htmlFor="longitude" error={errors.longitude?.message}>
                <Input id="longitude" type="number" step="any" dir="ltr" placeholder="48.057" {...register("longitude", { valueAsNumber: true })} className="rounded-xl" />
              </Field>
            </div>

            <ImageUploader
              value={watch("coverImageUrl")}
              onChange={(url) => setValue("coverImageUrl", url, { shouldValidate: true })}
              folder="branches"
              label="Branch Cover Photo"
              aspectClassName="aspect-video max-h-48"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Display Order" htmlFor="order" error={errors.order?.message}>
                <Input id="order" type="number" min="0" {...register("order", { valueAsNumber: true })} className="rounded-xl" />
              </Field>
              <div className="flex items-center gap-3 pt-6">
                <Switch
                  id="isActive"
                  checked={watch("isActive")}
                  onCheckedChange={(checked) => setValue("isActive", checked)}
                />
                <label htmlFor="isActive" className="text-sm font-medium text-foreground cursor-pointer">
                  Active location (visible on site)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border/60">
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="rounded-xl bg-[#143725] text-white hover:bg-[#0d1b12]">
                {isSubmitting ? (
                  <Loader2 className="animate-spin size-4" aria-hidden="true" />
                ) : (
                  <Save className="size-4" aria-hidden="true" />
                )}
                {editing ? "Save Changes" : "Create Branch"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete branch?"
        description={`"${deleteTarget?.name.en}" will be permanently removed from your website.`}
        confirmLabel="Delete"
        isLoading={isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
