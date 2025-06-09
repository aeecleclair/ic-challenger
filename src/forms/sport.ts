import { z } from "zod";

export const sportFormSchema = z.object({
  name_fr: z
    .string({
      required_error: "Veuillez renseigner le nom du produit",
    })
    .min(1, {
      message: "Veuillez renseigner le nom du produit",
    }),
  quota: z
    .number()
    .min(1, {
      message: "Le quota doit être supérieur à 0",
    })
    .optional(),
  type: z.enum(["team", "individual"], {
    required_error: "Veuillez sélectionner un type de sport",
  }),
});
