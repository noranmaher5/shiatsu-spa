"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { BilingualField } from "@/components/admin/bilingual-field";
import { ImageUploader } from "@/components/admin/image-uploader";
import {
  websiteSettingsSchema,
  type WebsiteSettingsFormData,
  type WebsiteSettingsFormValues,
} from "@/features/settings/schemas/website";
import { updateWebsiteSettings } from "@/features/settings/actions";
import type { WebsiteSettings } from "@/features/settings/types";

export function WebsiteSettingsForm({ initialData }: { initialData: WebsiteSettings | null }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WebsiteSettingsFormValues, unknown, WebsiteSettingsFormData>({
    resolver: zodResolver(websiteSettingsSchema),
    defaultValues: {
      googleAnalyticsId: initialData?.googleAnalyticsId ?? "",
      metaPixelId: initialData?.metaPixelId ?? "",
      businessHours: initialData?.businessHours ?? { en: "", ar: "" },
      emergencyContact: initialData?.emergencyContact ?? "",
      logoUrl: initialData?.logoUrl ?? null,
    } as unknown as WebsiteSettingsFormValues,
  });

  async function onSubmit(values: WebsiteSettingsFormData) {
    setIsSubmitting(true);
    const result = await updateWebsiteSettings(values);
    setIsSubmitting(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Website settings saved.");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <ImageUploader
        value={watch("logoUrl")}
        onChange={(url) => setValue("logoUrl", url, { shouldValidate: true })}
        folder="settings"
        label="Site Logo"
        aspectClassName="aspect-square"
      />

      <BilingualField
        label="Business Hours"
        name="businessHours"
        register={register}
        errors={errors}
      />

      <Field label="Emergency Contact (optional)" htmlFor="emergencyContact">
        <Input id="emergencyContact" dir="ltr" {...register("emergencyContact")} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Google Analytics ID (optional)" htmlFor="googleAnalyticsId">
          <Input id="googleAnalyticsId" dir="ltr" placeholder="G-XXXXXXXXXX" {...register("googleAnalyticsId")} />
        </Field>
        <Field label="Meta Pixel ID (optional)" htmlFor="metaPixelId">
          <Input id="metaPixelId" dir="ltr" placeholder="123456789012345" {...register("metaPixelId")} />
        </Field>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Save aria-hidden="true" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
