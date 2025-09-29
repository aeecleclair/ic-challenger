import { z } from "zod";

export const licenseFormSchema = z.object({
  license_number: z.string().optional(),
});

export type LicenseFormValues = z.infer<typeof licenseFormSchema>;
