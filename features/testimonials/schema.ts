import { z } from "zod";
import { bilingualSchema, orderAndActiveSchema } from "@/lib/schema/shared";

export const testimonialFormSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  content: bilingualSchema,
  rating: z.number().int().min(1, "Rating must be between 1 and 5").max(5),
  avatarUrl: z.string().url().nullable(),
  ...orderAndActiveSchema,
});

export type TestimonialFormValues = z.infer<typeof testimonialFormSchema>;
