"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BilingualField } from "@/components/admin/bilingual-field";
import {
  companySettingsSchema,
  type CompanySettingsFormValues,
} from "@/features/settings/schemas/company";
import { updateCompanySettings } from "@/features/settings/actions";
import type { CompanySettings } from "@/features/settings/types";

export function CompanySettingsForm({ initialData }: { initialData: CompanySettings | null }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanySettingsFormValues>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: initialData ?? {
      name: { en: "", ar: "" },
      slogan: { en: "", ar: "" },
      aboutUs: { en: "", ar: "" },
      vision: { en: "", ar: "" },
      mission: { en: "", ar: "" },
    },
  });

  async function onSubmit(values: CompanySettingsFormValues) {
    setIsSubmitting(true);
    const result = await updateCompanySettings(values);
    setIsSubmitting(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("About page saved.");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <BilingualField label="Company Name" name="name" register={register} errors={errors} />
      <BilingualField label="Slogan" name="slogan" register={register} errors={errors} />
      <BilingualField label="About Us" name="aboutUs" register={register} errors={errors} multiline />
      <BilingualField label="Vision" name="vision" register={register} errors={errors} multiline />
      <BilingualField label="Mission" name="mission" register={register} errors={errors} multiline />

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Save aria-hidden="true" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
