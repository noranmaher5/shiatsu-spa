import { z } from "zod";
import { bilingualSchema, optionalBilingualSchema, orderAndActiveSchema } from "@/lib/schema/shared";

export const articleFormSchema = z.object({
  title: bilingualSchema,
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  excerpt: optionalBilingualSchema,
  content: bilingualSchema,
  coverImageUrl: z.string().url().nullable(),
  author: optionalBilingualSchema,
  publishedAt: z.string().min(1, "Publish date is required"),
  metaTitle: optionalBilingualSchema,
  metaDescription: optionalBilingualSchema,
  ...orderAndActiveSchema,
});

export type ArticleFormValues = z.infer<typeof articleFormSchema>;
