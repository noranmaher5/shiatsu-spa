import { z } from "zod";
import { orderAndActiveSchema } from "@/lib/schema/shared";

export const galleryFormSchema = z.object({
  // Gallery photos do not need a caption. Keep an empty bilingual object in
  // the stored shape so older gallery rendering code remains compatible.
  title: z
    .object({
      en: z.string().optional(),
      ar: z.string().optional(),
    })
    .optional(),
  imageUrl: z.string().url("Upload an image"),
  category: z.string().optional(),
  ...orderAndActiveSchema,
});

export type GalleryFormValues = z.infer<typeof galleryFormSchema>;
