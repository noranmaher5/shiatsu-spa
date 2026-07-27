"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import {
  socialSettingsSchema,
  type SocialSettingsFormData,
  type SocialSettingsFormValues,
} from "@/features/settings/schemas/social";
import { updateSocialSettings } from "@/features/settings/actions";
import type { SocialSettings } from "@/features/settings/types";

const FIELDS: { name: keyof SocialSettingsFormValues; label: string; placeholder: string }[] = [
  { name: "instagram", label: "Instagram", placeholder: "https://instagram.com/..." },
  { name: "snapchat", label: "Snapchat", placeholder: "https://snapchat.com/add/..." },
  { name: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@..." },
  { name: "twitter", label: "Twitter / X", placeholder: "https://x.com/..." },
  { name: "facebook", label: "Facebook", placeholder: "https://facebook.com/..." },
  { name: "website", label: "Website", placeholder: "https://..." },
];

function toFormValue(value: string | null | undefined): string {
  return value ?? "";
}

export function SocialSettingsForm({ initialData }: { initialData: SocialSettings | null }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SocialSettingsFormValues, unknown, SocialSettingsFormData>({
    resolver: zodResolver(socialSettingsSchema),
    defaultValues: {
      instagram: toFormValue(initialData?.instagram),
      snapchat: toFormValue(initialData?.snapchat),
      tiktok: toFormValue(initialData?.tiktok),
      twitter: toFormValue(initialData?.twitter),
      facebook: toFormValue(initialData?.facebook),
      website: toFormValue(initialData?.website),
    } as unknown as SocialSettingsFormValues,
  });

  async function onSubmit(values: SocialSettingsFormData) {
    setIsSubmitting(true);
    try {
      const result = await updateSocialSettings(values);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Social links saved.");
    } catch (error) {
      console.error("Saving social links failed:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save social links.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <Field
            key={field.name}
            label={field.label}
            htmlFor={field.name}
            error={errors[field.name]?.message as string | undefined}
          >
            <Input id={field.name} dir="ltr" placeholder={field.placeholder} {...register(field.name)} />
          </Field>
        ))}
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
