"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Save, Star } from "lucide-react";
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
import {
  testimonialFormSchema,
  type TestimonialFormValues,
} from "@/features/testimonials/schema";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialActive,
} from "@/features/testimonials/actions";
import type { Testimonial } from "@/features/testimonials/types";

function emptyValues(order: number): TestimonialFormValues {
  return {
    clientName: "",
    content: { en: "", ar: "" },
    rating: 5,
    avatarUrl: null,
    order,
    isActive: true,
  };
}

export function TestimonialsManager({ testimonials }: { testimonials: Testimonial[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: emptyValues(testimonials.length),
  });

  function openCreate() {
    setEditing(null);
    reset(emptyValues(testimonials.length));
    setFormOpen(true);
  }

  function openEdit(testimonial: Testimonial) {
    setEditing(testimonial);
    reset({
      clientName: testimonial.clientName,
      content: testimonial.content,
      rating: testimonial.rating,
      avatarUrl: testimonial.avatarUrl ?? null,
      order: testimonial.order,
      isActive: testimonial.isActive,
    });
    setFormOpen(true);
  }

  async function onSubmit(values: TestimonialFormValues) {
    setIsSubmitting(true);
    const result = editing
      ? await updateTestimonial(editing.id, values)
      : await createTestimonial(values);

    if (!result.success) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }

    toast.success(editing ? "Testimonial updated." : "Testimonial created.");
    setIsSubmitting(false);
    setFormOpen(false);
    router.refresh();
  }

  function handleToggle(testimonial: Testimonial, next: boolean) {
    startTransition(async () => {
      const result = await toggleTestimonialActive(testimonial.id, next);
      if (!result.success) toast.error(result.error);
      else router.refresh();
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteTestimonial(deleteTarget.id);
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success("Testimonial deleted.");
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
          New Testimonial
        </Button>
      </div>

      {testimonials.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          No testimonials yet. Add your first review to get started.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-end">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((testimonial) => (
              <TableRow key={testimonial.id}>
                <TableCell className="font-medium text-foreground">
                  {testimonial.clientName}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`size-3.5 ${
                          i < testimonial.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell>{testimonial.order}</TableCell>
                <TableCell>
                  <Switch
                    checked={testimonial.isActive}
                    onCheckedChange={(next) => handleToggle(testimonial, next)}
                    disabled={isPending}
                    aria-label={`Toggle ${testimonial.clientName} active`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEdit(testimonial)}
                      aria-label="Edit"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeleteTarget(testimonial)}
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Testimonial" : "New Testimonial"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Field
              label="Client Name"
              htmlFor="clientName"
              required
              error={errors.clientName?.message}
            >
              <Input id="clientName" {...register("clientName")} />
            </Field>

            <BilingualField
              label="Review"
              name="content"
              register={register}
              errors={errors}
              multiline
            />

            <Field label="Rating (1–5)" htmlFor="rating" required error={errors.rating?.message}>
              <Input
                id="rating"
                type="number"
                min="1"
                max="5"
                {...register("rating", { valueAsNumber: true })}
              />
            </Field>

            <ImageUploader
              value={watch("avatarUrl")}
              onChange={(url) => setValue("avatarUrl", url, { shouldValidate: true })}
              folder="gallery"
              label="Avatar (optional)"
              aspectClassName="aspect-video max-h-40"
            />

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
        title="Delete testimonial?"
        description={`The review from "${deleteTarget?.clientName}" will be permanently removed.`}
        confirmLabel="Delete"
        isLoading={isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}
