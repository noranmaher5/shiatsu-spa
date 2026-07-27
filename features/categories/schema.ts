import { z } from "zod";
import { bilingualSchema, orderAndActiveSchema } from "@/lib/schema/shared";

export const categoryFormSchema = z.object({
  name: bilingualSchema,
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  ...orderAndActiveSchema,
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
