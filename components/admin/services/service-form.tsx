"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { serviceFormSchema, type ServiceFormValues } from "@/features/services/schema";
import { createService, updateService } from "@/features/services/actions";
import { slugify } from "@/lib/utils/slugify";
import { ADMIN_ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Field } from "@/components/ui/field";
import { BilingualField } from "@/components/admin/bilingual-field";
import { ImageUploader } from "@/components/admin/image-uploader";
import type { Category } from "@/features/categories/types";
import type { Service } from "@/features/services/types";

type ServiceFormProps = {
  categories: Category[];
  defaultOrder: number;
  service?: Service;
};

export function ServiceForm({ categories, defaultOrder, service }: ServiceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: service
      ? {
          name: service.name,
          slug: service.slug,
          shortDescription: service.shortDescription ?? { en: "", ar: "" },
          description: service.description,
          price: service.price,
          durationMinutes: service.durationMinutes,
          categoryId: service.categoryId,
          imageUrl: service.imageUrl,
          isFeatured: service.isFeatured,
          order: service.order,
          isActive: service.isActive,
        }
      : {
          name: { en: "", ar: "" },
          slug: "",
          shortDescription: { en: "", ar: "" },
          description: { en: "", ar: "" },
          price: 0,
          durationMinutes: 60,
          categoryId: categories[0]?.id ?? "",
          imageUrl: null,
          isFeatured: false,
          order: defaultOrder,
          isActive: true,
        },
  });

  const imageUrl = watch("imageUrl");
  const nameEn = watch("name.en");

  async function onSubmit(values: ServiceFormValues) {
    setIsSubmitting(true);
    const result = service
      ? await updateService(service.id, values, service.slug)
      : await createService(values);

    if (!result.success) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }

    toast.success(service ? "Service updated." : "Service created.");
    router.push(ADMIN_ROUTES.services);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto flex max-w-4xl flex-col gap-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-sans text-base font-semibold">Basic Information</h2>

        <div className="flex flex-col gap-4">
          <BilingualField label="Name" name="name" register={register} errors={errors} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

            <Field label="Category" htmlFor="categoryId" required error={errors.categoryId?.message}>
              <Select id="categoryId" {...register("categoryId")}>
                {categories.length === 0 && <option value="">No categories yet</option>}
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name.en}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <BilingualField
            label="Short Description"
            name="shortDescription"
            register={register}
            errors={errors}
            required={false}
          />

          <BilingualField
            label="Full Description"
            name="description"
            register={register}
            errors={errors}
            multiline
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-sans text-base font-semibold">Pricing & Duration</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Price (KWD)" htmlFor="price" required error={errors.price?.message}>
            <Input
              id="price"
              type="number"
              step="0.001"
              min="0"
              {...register("price", { valueAsNumber: true })}
            />
          </Field>
          <Field
            label="Duration (minutes)"
            htmlFor="durationMinutes"
            required
            error={errors.durationMinutes?.message}
          >
            <Input
              id="durationMinutes"
              type="number"
              min="1"
              {...register("durationMinutes", { valueAsNumber: true })}
            />
          </Field>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-sans text-base font-semibold">Image</h2>
        <ImageUploader
          value={imageUrl}
          onChange={(url) => setValue("imageUrl", url, { shouldValidate: true })}
          folder="services"
          label="Service photo"
          aspectClassName="aspect-video max-h-56"
        />
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-sans text-base font-semibold">Display Settings</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Display Order" htmlFor="order" error={errors.order?.message}>
            <Input id="order" type="number" min="0" {...register("order", { valueAsNumber: true })} />
          </Field>

          <div className="flex items-center gap-3 pt-6">
            <Switch
              id="isFeatured"
              checked={watch("isFeatured")}
              onCheckedChange={(checked) => setValue("isFeatured", checked)}
            />
            <label htmlFor="isFeatured" className="text-sm font-medium">
              Featured on homepage
            </label>
          </div>

          <div className="flex items-center gap-3 pt-6">
            <Switch
              id="isActive"
              checked={watch("isActive")}
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
            <label htmlFor="isActive" className="text-sm font-medium">
              Active (visible on website)
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push(ADMIN_ROUTES.services)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="animate-spin" aria-hidden="true" />
          ) : (
            <Save aria-hidden="true" />
          )}
          {service ? "Save Changes" : "Create Service"}
        </Button>
      </div>
    </form>
  );
}
