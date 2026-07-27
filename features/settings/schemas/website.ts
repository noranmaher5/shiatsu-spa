import { z } from "zod";
import { bilingualSchema } from "@/lib/schema/shared";

const optionalString = z
  .string()
  .trim()
  .transform((val) => (val === "" ? null : val));

export const websiteSettingsSchema = z.object({
  googleAnalyticsId: optionalString,
  metaPixelId: optionalString,
  businessHours: bilingualSchema,
  emergencyContact: optionalString,
  logoUrl: z.string().url().nullable(),
});

export type WebsiteSettingsFormValues = z.input<typeof websiteSettingsSchema>;
export type WebsiteSettingsFormData = z.output<typeof websiteSettingsSchema>;
