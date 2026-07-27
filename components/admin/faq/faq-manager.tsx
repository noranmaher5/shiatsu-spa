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
import { faqFormSchema, type FaqFormValues } from "@/features/faq/schema";
import { createFaq, updateFaq, deleteFaq, toggleFaqActive } from "@/features/faq/actions";
import type { FaqItem } from "@/features/faq/types";

function emptyValues(order: number): FaqFormValues {
  return {
    question: { en: "", ar: "" },
    answer: { en: "", ar: "" },
    category: "",
    order,
    isActive: true,
  };
}

export function FaqManager({ faqs }: { faqs: FaqItem[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FaqItem | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FaqFormValues>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: emptyValues(faqs.length),
  });

  function openCreate() {
    setEditing(null);
    reset(emptyValues(faqs.length));
    setFormOpen(true);
  }

  function openEdit(faq: FaqItem) {
    setEditing(faq);
    reset({
      question: faq.question,
      answer: faq.answer,
      category: faq.category ?? "",
      order: faq.order,
      isActive: faq.isActive,
    });
    setFormOpen(true);
  }

  async function onSubmit(values: FaqFormValues) {
    setIsSubmitting(true);
    const result = editing ? await updateFaq(editing.id, values) : await createFaq(values);

    if (!result.success) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }

    toast.success(editing ? "FAQ updated." : "FAQ created.");
    setIsSubmitting(false);
    setFormOpen(false);
    router.refresh();
  }

  function handleToggle(faq: FaqItem, next: boolean) {
    startTransition(async () => {
      const result = await toggleFaqActive(faq.id, next);
      if (!result.success) toast.error(result.error);
      else router.refresh();
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteFaq(deleteTarget.id);
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success("FAQ deleted.");
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
          New FAQ
        </Button>
      </div>

      {faqs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          No FAQs yet. Add your first question to get started.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-end">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs.map((faq) => (
              <TableRow key={faq.id}>
                <TableCell className="max-w-md font-medium text-foreground">
                  {faq.question.en}
                </TableCell>
                <TableCell>{faq.order}</TableCell>
                <TableCell>
                  <Switch
                    checked={faq.isActive}
                    onCheckedChange={(next) => handleToggle(faq, next)}
                    disabled={isPending}
                    aria-label={`Toggle FAQ active`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => openEdit(faq)} aria-label="Edit">
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeleteTarget(faq)}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit FAQ" : "New FAQ"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <BilingualField label="Question" name="question" register={register} errors={errors} />
            <BilingualField
              label="Answer"
              name="answer"
              register={register}
              errors={errors}
              multiline
            />

            <Field label="Category (optional)" htmlFor="category">
              <Input id="category" {...register("category")} placeholder="e.g. booking" />
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
        title="Delete FAQ?"
        description="This question and answer will be permanently removed."
        confirmLabel="Delete"
        isLoading={isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}
