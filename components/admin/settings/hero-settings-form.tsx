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
import { heroSettingsSchema, type HeroSettingsFormValues } from "@/features/settings/schemas/hero";
import { updateHeroSettings } from "@/features/settings/actions";
import type { HeroSettings } from "@/features/settings/types";

export function HeroSettingsForm({ initialData }: { initialData: HeroSettings | null }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<HeroSettingsFormValues>({
    resolver: zodResolver(heroSettingsSchema),
    defaultValues: initialData ?? {
      title: { en: "", ar: "" },
      subtitle: { en: "", ar: "" },
      buttonText: { en: "", ar: "" },
      buttonLink: "/contact",
      backgroundImageUrl: null,
    },
  });

  async function onSubmit(values: HeroSettingsFormValues) {
    setIsSubmitting(true);
    const result = await updateHeroSettings(values);
    setIsSubmitting(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Hero settings saved.");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-2xl flex-col gap-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-sans text-base font-semibold">Homepage Hero</h2>
        <div className="flex flex-col gap-4">
          <BilingualField label="Title" name="title" register={register} errors={errors} />
          <BilingualField label="Subtitle" name="subtitle" register={register} errors={errors} multiline />
          <BilingualField label="Button Text" name="buttonText" register={register} errors={errors} />
          <Field label="Button Link" htmlFor="buttonLink" required error={errors.buttonLink?.message}>
            <Input id="buttonLink" dir="ltr" {...register("buttonLink")} placeholder="/contact" />
          </Field>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-sans text-base font-semibold">Background Image</h2>
        <ImageUploader
          value={watch("backgroundImageUrl")}
          onChange={(url) => setValue("backgroundImageUrl", url, { shouldValidate: true })}
          folder="settings"
          label="Hero background"
        />
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
