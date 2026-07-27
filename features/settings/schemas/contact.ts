import { z } from "zod";

const phoneSchema = z
  .string()
  .regex(/^\+?\d{8,15}$/, "Enter a valid phone number (digits only, optional +)");

export const contactSettingsSchema = z.object({
  phones: z.array(phoneSchema).min(1, "Add at least one phone number"),
  whatsapp: phoneSchema,
  email: z.string().email("Enter a valid email address"),
});

export type ContactSettingsFormValues = z.infer<typeof contactSettingsSchema>;
