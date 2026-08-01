"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { articleFormSchema, type ArticleFormValues } from "@/features/articles/schema";
import { createArticle, updateArticle } from "@/features/articles/actions";
import { slugify } from "@/lib/utils/slugify";
import { ADMIN_ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Field } from "@/components/ui/field";
import { BilingualField } from "@/components/admin/bilingual-field";
import { ImageUploader } from "@/components/admin/image-uploader";
import type { Article } from "@/features/articles/types";

type ArticleFormProps = {
  defaultOrder: number;
  article?: Article;
};

function toDateInputValue(iso: string | undefined): string {
  if (!iso) return new Date().toISOString().slice(0, 10);
  try {
    return new Date(iso).toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

export function ArticleForm({ defaultOrder, article }: ArticleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: article
      ? {
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt ?? { en: "", ar: "" },
          content: article.content,
          coverImageUrl: article.coverImageUrl,
          author: article.author ?? { en: "", ar: "" },
          publishedAt: toDateInputValue(article.publishedAt),
          metaTitle: article.metaTitle ?? { en: "", ar: "" },
          metaDescription: article.metaDescription ?? { en: "", ar: "" },
          order: article.order,
          isActive: article.isActive,
        }
      : {
          title: { en: "", ar: "" },
          slug: "",
          excerpt: { en: "", ar: "" },
          content: { en: "", ar: "" },
          coverImageUrl: null,
          author: { en: "Shiatsu Spa", ar: "شياتسو سبا" },
          publishedAt: new Date().toISOString().slice(0, 10),
          metaTitle: { en: "", ar: "" },
          metaDescription: { en: "", ar: "" },
          order: defaultOrder,
          isActive: true,
        },
  });

  const coverImageUrl = watch("coverImageUrl");
  const titleEn = watch("title.en");

  async function onSubmit(values: ArticleFormValues) {
    setIsSubmitting(true);
    const result = article
      ? await updateArticle(article.id, values, article.slug)
      : await createArticle(values);

    if (!result.success) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }

    toast.success(article ? "Article updated." : "Article created.");
    router.push(ADMIN_ROUTES.articles);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto flex max-w-4xl flex-col gap-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-sans text-base font-semibold">Basic Information</h2>

        <div className="flex flex-col gap-4">
          <BilingualField label="Title" name="title" register={register} errors={errors} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Slug" htmlFor="slug" required error={errors.slug?.message}>
              <div className="flex gap-2">
                <Input id="slug" dir="ltr" {...register("slug")} />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setValue("slug", slugify(titleEn || ""), { shouldValidate: true })}
                >
                  Generate
                </Button>
              </div>
            </Field>

            <Field label="Publish Date" htmlFor="publishedAt" required error={errors.publishedAt?.message}>
              <Input id="publishedAt" type="date" dir="ltr" {...register("publishedAt")} />
            </Field>
          </div>

          <BilingualField
            label="Excerpt"
            name="excerpt"
            register={register}
            errors={errors}
            required={false}
            multiline
          />

          <BilingualField
            label="Content"
            name="content"
            register={register}
            errors={errors}
            multiline
          />

          <BilingualField
            label="Author"
            name="author"
            register={register}
            errors={errors}
            required={false}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-sans text-base font-semibold">Cover Image</h2>
        <ImageUploader
          value={coverImageUrl}
          onChange={(url) => setValue("coverImageUrl", url, { shouldValidate: true })}
          folder="articles"
          label="Article cover photo"
          aspectClassName="aspect-video max-h-56"
        />
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-1 font-sans text-base font-semibold">SEO Settings</h2>
        <p className="text-muted-foreground mb-4 text-sm">
          Optional. Leave blank to use the title and excerpt automatically.
        </p>

        <div className="flex flex-col gap-4">
          <BilingualField
            label="Meta Title"
            name="metaTitle"
            register={register}
            errors={errors}
            required={false}
          />
          <BilingualField
            label="Meta Description"
            name="metaDescription"
            register={register}
            errors={errors}
            required={false}
            multiline
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-sans text-base font-semibold">Display Settings</h2>
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
              Published (visible on website)
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push(ADMIN_ROUTES.articles)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="animate-spin" aria-hidden="true" />
          ) : (
            <Save aria-hidden="true" />
          )}
          {article ? "Save Changes" : "Create Article"}
        </Button>
      </div>
    </form>
  );
}
