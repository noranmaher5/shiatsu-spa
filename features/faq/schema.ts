import { z } from "zod";
import { bilingualSchema, orderAndActiveSchema } from "@/lib/schema/shared";

export const faqFormSchema = z.object({
  question: bilingualSchema,
  answer: bilingualSchema,
  category: z.string().optional(),
  ...orderAndActiveSchema,
});

export type FaqFormValues = z.infer<typeof faqFormSchema>;
