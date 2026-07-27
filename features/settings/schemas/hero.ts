import { z } from "zod";
import { bilingualSchema } from "@/lib/schema/shared";

export const heroSettingsSchema = z.object({
  title: bilingualSchema,
  subtitle: bilingualSchema,
  buttonText: bilingualSchema,
  buttonLink: z.string().min(1, "Button link is required"),
  backgroundImageUrl: z.string().url().nullable(),
});

export type HeroSettingsFormValues = z.infer<typeof heroSettingsSchema>;
