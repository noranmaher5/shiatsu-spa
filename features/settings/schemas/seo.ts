import { z } from "zod";
import { bilingualSchema } from "@/lib/schema/shared";

export const seoSettingsSchema = z.object({
  metaTitle: bilingualSchema,
  metaDescription: bilingualSchema,
  keywords: z.array(z.string().min(1)),
  ogImageUrl: z.string().url().nullable(),
  faviconUrl: z.string().url().nullable(),
});

export type SeoSettingsFormValues = z.infer<typeof seoSettingsSchema>;
