import { z } from "zod";
import { bilingualSchema, optionalBilingualSchema, orderAndActiveSchema } from "@/lib/schema/shared";

export const serviceFormSchema = z.object({
  name: bilingualSchema,
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  shortDescription: optionalBilingualSchema,
  description: bilingualSchema,
  price: z.number().min(0, "Price must be 0 or more"),
  durationMinutes: z.number().int().min(1, "Duration must be at least 1 minute"),
  categoryId: z.string().min(1, "Select a category"),
  imageUrl: z.string().url().nullable(),
  isFeatured: z.boolean(),
  ...orderAndActiveSchema,
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
