"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Save } from "lucide-react";
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
import { slugify } from "@/lib/utils/slugify";
import { categoryFormSchema, type CategoryFormValues } from "@/features/categories/schema";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryActive,
} from "@/features/categories/actions";
import type { Category } from "@/features/categories/types";

function emptyValues(order: number): CategoryFormValues {
  return { name: { en: "", ar: "" }, slug: "", order, isActive: true };
}

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: emptyValues(categories.length),
  });

  function openCreate() {
    setEditing(null);
    reset(emptyValues(categories.length));
    setFormOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    reset({
      name: category.name,
      slug: category.slug,
      order: category.order,
      isActive: category.isActive,
    });
    setFormOpen(true);
  }

  async function onSubmit(values: CategoryFormValues) {
    setIsSubmitting(true);
    const result = editing
      ? await updateCategory(editing.id, values)
      : await createCategory(values);

    if (!result.success) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }

    toast.success(editing ? "Category updated." : "Category created.");
    setIsSubmitting(false);
    setFormOpen(false);
    router.refresh();
  }

  function handleToggle(category: Category, next: boolean) {
    startTransition(async () => {
      const result = await toggleCategoryActive(category.id, next);
      if (!result.success) toast.error(result.error);
      else router.refresh();
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteCategory(deleteTarget.id);
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success("Category deleted.");
        router.refresh();
      }
      setDeleteTarget(null);
    });
  }

  const nameEn = watch("name.en");

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={openCreate}>
          <Plus aria-hidden="true" />
          New Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          No categories yet. Create your first one to get started.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-end">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium text-foreground">{category.name.en}</TableCell>
                <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                <TableCell>{category.order}</TableCell>
                <TableCell>
                  <Switch
                    checked={category.isActive}
                    onCheckedChange={(next) => handleToggle(category, next)}
                    disabled={isPending}
                    aria-label={`Toggle ${category.name.en} active`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => openEdit(category)} aria-label="Edit">
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeleteTarget(category)}
                      aria-label="Delete"
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Category" : "New Category"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <BilingualField label="Name" name="name" register={register} errors={errors} />

            <Field label="Slug" htmlFor="slug" required error={errors.slug?.message}>
              <div className="flex gap-2">
                <Input id="slug" dir="ltr" {...register("slug")} />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setValue("slug", slugify(nameEn || ""), { shouldValidate: true })}
                >
                  Generate
                </Button>
              </div>
            </Field>

            <Field label="Display Order" htmlFor="order" error={errors.order?.message}>
              <Input id="order" type="number" min="0" {...register("order", { valueAsNumber: true })} />
            </Field>

            <div className="flex items-center gap-3">
              <Switch
                id="isActive"
                checked={watch("isActive")}
                onCheckedChange={(checked) => setValue("isActive", checked)}
              />
              <label htmlFor="isActive" className="text-sm font-medium">
                Active (visible on website)
              </label>
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
        title="Delete category?"
        description={`"${deleteTarget?.name.en}" will be permanently removed. Services already assigned to it must be reassigned first.`}
        confirmLabel="Delete"
        isLoading={isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}
