import { z } from "zod";
import { bilingualSchema } from "@/lib/schema/shared";

export const companySettingsSchema = z.object({
  name: bilingualSchema,
  slogan: bilingualSchema,
  aboutUs: bilingualSchema,
  vision: bilingualSchema,
  mission: bilingualSchema,
});

export type CompanySettingsFormValues = z.infer<typeof companySettingsSchema>;
