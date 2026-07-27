import { z } from "zod";

/** A required EN/AR text pair — the shape of every `Bilingual` field. */
export const bilingualSchema = z.object({
  en: z.string().min(1, "English text is required"),
  ar: z.string().min(1, "Arabic text is required"),
});

/** An optional EN/AR text pair — the shape of every `OptionalBilingual` field. */
export const optionalBilingualSchema = z.object({
  en: z.string().optional(),
  ar: z.string().optional(),
});

/** Every `FirestoreEntity` has these two admin-editable fields. */
export const orderAndActiveSchema = {
  order: z.number().int().min(0),
  isActive: z.boolean(),
};

/** An image URL that's been uploaded (or explicitly cleared to null). */
export const imageUrlSchema = z.string().url().nullable();
