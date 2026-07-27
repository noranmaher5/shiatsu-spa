"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ImageUploader } from "@/components/admin/image-uploader";
import { galleryFormSchema, type GalleryFormValues } from "@/features/gallery/schema";
import {
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  toggleGalleryItemActive,
} from "@/features/gallery/actions";
import type { GalleryItem } from "@/features/gallery/types";

function emptyValues(order: number): GalleryFormValues {
  return { title: { en: "", ar: "" }, imageUrl: "", category: "", order, isActive: true };
}

export function GalleryManager({ items }: { items: GalleryItem[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<GalleryFormValues>({
    resolver: zodResolver(galleryFormSchema),
    defaultValues: emptyValues(items.length),
  });

  function openCreate() {
    setEditing(null);
    reset(emptyValues(items.length));
    setFormOpen(true);
  }

  function openEdit(item: GalleryItem) {
    setEditing(item);
    reset({
      title: item.title,
      imageUrl: item.imageUrl,
      category: item.category ?? "",
      order: item.order,
      isActive: item.isActive,
    });
    setFormOpen(true);
  }

  async function onSubmit(values: GalleryFormValues) {
    setIsSubmitting(true);
    const result = editing
      ? await updateGalleryItem(editing.id, values)
      : await createGalleryItem(values);

    if (!result.success) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }

    toast.success(editing ? "Gallery item updated." : "Gallery item created.");
    setIsSubmitting(false);
    setFormOpen(false);
    router.refresh();
  }

  function handleToggle(item: GalleryItem, next: boolean) {
    startTransition(async () => {
      const result = await toggleGalleryItemActive(item.id, next);
      if (!result.success) toast.error(result.error);
      else router.refresh();
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteGalleryItem(deleteTarget.id);
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success("Gallery item deleted.");
        router.refresh();
      }
      setDeleteTarget(null);
    });
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={openCreate}>
          <Plus aria-hidden="true" />
          New Gallery Item
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          No gallery items yet. Add your first photo to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative aspect-4/3 w-full bg-[#0d1b12]/30 p-1">
                <Image src={item.imageUrl} alt={item.title.en} fill sizes="300px" className="object-contain" />
                {!item.isActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <span className="rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white">
                      Inactive
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{item.title.en}</p>
                  <p className="text-muted-foreground text-xs">Order: {item.order}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Switch
                    checked={item.isActive}
                    onCheckedChange={(next) => handleToggle(item, next)}
                    disabled={isPending}
                    aria-label={`Toggle ${item.title.en} active`}
                  />
                </div>
              </div>
              <div className="flex gap-2 border-t border-border p-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(item)}>
                  <Pencil className="size-4" /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDeleteTarget(item)}
                  aria-label="Delete"
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Gallery Item" : "New Gallery Item"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <ImageUploader
              value={watch("imageUrl") || null}
              onChange={(url) => setValue("imageUrl", url ?? "", { shouldValidate: true })}
              folder="gallery"
              label="Photo"
              aspectClassName="aspect-video max-h-48"
            />
            {errors.imageUrl && (
              <p className="text-destructive -mt-2 text-xs">{errors.imageUrl.message}</p>
            )}

            <Field label="Category (optional)" htmlFor="category">
              <Input id="category" {...register("category")} placeholder="e.g. treatment-room" />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Display Order" htmlFor="order" error={errors.order?.message}>
                <Input id="order" type="number" min="0" {...register("order", { valueAsNumber: true })} />
              </Field>
              <div className="flex items-center gap-3 pt-6">
                <Switch
                  id="isActive"
                  checked={watch("isActive")}
                  onCheckedChange={(checked) => setValue("isActive", checked)}
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Active
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="animate-spin" aria-hidden="true" />
                ) : (
                  <Save aria-hidden="true" />
                )}
                {editing ? "Save Changes" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete gallery item?"
        description={`"${deleteTarget?.title.en}" will be permanently removed.`}
        confirmLabel="Delete"
        isLoading={isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}
