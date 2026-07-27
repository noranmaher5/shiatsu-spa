import { z } from "zod";

const bilingualSchema = z.object({
  en: z.string().min(1, "English text is required"),
  ar: z.string().min(1, "Arabic text is required"),
});

/**
 * Basic international phone validation: optional leading "+", 8-15
 * digits. Deliberately loose — Kuwait numbers and any future
 * international branch numbers both need to pass, and WhatsApp's own
 * validation is the real final check when the link is opened.
 */
const phoneSchema = z
  .string()
  .regex(/^\+?\d{8,15}$/, "Enter a valid phone number (digits only, optional +)");

export const branchFormSchema = z.object({
  name: bilingualSchema,
  address: bilingualSchema,
  phone: phoneSchema,
  whatsapp: phoneSchema,
  workingHours: bilingualSchema,
  coverImageUrl: z.string().url().nullable(),
  googleMapsUrl: z.string().url("Enter a valid Google Maps URL"),
  latitude: z.number().finite().min(-90).max(90).optional(),
  longitude: z.number().finite().min(-180).max(180).optional(),
  order: z.number().int().min(0),
  isActive: z.boolean(),
});

export type BranchFormValues = z.infer<typeof branchFormSchema>;
