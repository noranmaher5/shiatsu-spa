"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Save, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import {
  contactSettingsSchema,
  type ContactSettingsFormValues,
} from "@/features/settings/schemas/contact";
import { updateContactSettings } from "@/features/settings/actions";
import type { ContactSettings } from "@/features/settings/types";

export function ContactSettingsForm({ initialData }: { initialData: ContactSettings | null }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContactSettingsFormValues>({
    resolver: zodResolver(contactSettingsSchema),
    defaultValues: initialData ?? { phones: [""], whatsapp: "", email: "" },
  });

  const phones = watch("phones");

  function addPhone() {
    setValue("phones", [...phones, ""]);
  }

  function removePhone(index: number) {
    setValue(
      "phones",
      phones.filter((_, i) => i !== index),
    );
  }

  function updatePhone(index: number, value: string) {
    setValue(
      "phones",
      phones.map((p, i) => (i === index ? value : p)),
    );
  }

  async function onSubmit(values: ContactSettingsFormValues) {
    setIsSubmitting(true);
    const result = await updateContactSettings(values);
    setIsSubmitting(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Contact information saved.");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">Phone Numbers</span>
        {phones.map((phone, index) => (
          <div key={index} className="flex gap-2">
            <Input
              dir="ltr"
              value={phone}
              onChange={(e) => updatePhone(index, e.target.value)}
              placeholder="+96550890601"
            />
            {phones.length > 1 && (
              <Button type="button" variant="outline" size="icon" onClick={() => removePhone(index)}>
                <X className="size-4" />
              </Button>
            )}
          </div>
        ))}
        {errors.phones && (
          <p className="text-destructive text-xs">
            {errors.phones.message || errors.phones.root?.message}
          </p>
        )}
        <Button type="button" variant="outline" size="sm" onClick={addPhone} className="self-start">
          <Plus className="size-4" /> Add phone number
        </Button>
      </div>

      <Field label="WhatsApp Number" htmlFor="whatsapp" required error={errors.whatsapp?.message}>
        <Input id="whatsapp" dir="ltr" {...register("whatsapp")} placeholder="+96550890601" />
      </Field>

      <Field label="Email" htmlFor="email" required error={errors.email?.message}>
        <Input id="email" type="email" dir="ltr" {...register("email")} />
      </Field>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Save aria-hidden="true" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
