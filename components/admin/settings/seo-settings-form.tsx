"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BilingualField } from "@/components/admin/bilingual-field";
import { ImageUploader } from "@/components/admin/image-uploader";
import { seoSettingsSchema, type SeoSettingsFormValues } from "@/features/settings/schemas/seo";
import { updateSeoSettings } from "@/features/settings/actions";
import type { SeoSettings } from "@/features/settings/types";

export function SeoSettingsForm({ initialData }: { initialData: SeoSettings | null }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keywordInput, setKeywordInput] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SeoSettingsFormValues>({
    resolver: zodResolver(seoSettingsSchema),
    defaultValues: initialData ?? {
      metaTitle: { en: "", ar: "" },
      metaDescription: { en: "", ar: "" },
      keywords: [],
      ogImageUrl: null,
      faviconUrl: null,
    },
  });

  const keywords = watch("keywords");

  function addKeyword() {
    const value = keywordInput.trim();
    if (!value || keywords.includes(value)) {
      setKeywordInput("");
      return;
    }
    setValue("keywords", [...keywords, value]);
    setKeywordInput("");
  }

  function removeKeyword(word: string) {
    setValue(
      "keywords",
      keywords.filter((k) => k !== word),
    );
  }

  async function onSubmit(values: SeoSettingsFormValues) {
    setIsSubmitting(true);
    const result = await updateSeoSettings(values);
    setIsSubmitting(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("SEO settings saved.");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <BilingualField label="Meta Title" name="metaTitle" register={register} errors={errors} />
      <BilingualField
        label="Meta Description"
        name="metaDescription"
        register={register}
        errors={errors}
        multiline
      />

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">Keywords</span>
        <div className="flex gap-2">
          <Input
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addKeyword();
              }
            }}
            placeholder="Type a keyword and press Enter"
          />
          <Button type="button" variant="outline" onClick={addKeyword}>
            Add
          </Button>
        </div>
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {keywords.map((word) => (
              <span
                key={word}
                className="bg-secondary/60 flex items-center gap-1 rounded-full px-3 py-1 text-xs text-foreground"
              >
                {word}
                <button type="button" onClick={() => removeKeyword(word)} aria-label={`Remove ${word}`}>
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ImageUploader
          value={watch("ogImageUrl")}
          onChange={(url) => setValue("ogImageUrl", url, { shouldValidate: true })}
          folder="settings"
          label="Open Graph Image"
        />
        <ImageUploader
          value={watch("faviconUrl")}
          onChange={(url) => setValue("faviconUrl", url, { shouldValidate: true })}
          folder="settings"
          label="Favicon"
          aspectClassName="aspect-square"
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
