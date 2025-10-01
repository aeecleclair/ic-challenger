import { z } from "zod";

export const licenseFormSchema = z.object({
  license_number: z
    .string()
    .min(1, "Le numéro de licence est requis pour valider l'inscription."),
});

export type LicenseFormValues = z.infer<typeof licenseFormSchema>;
