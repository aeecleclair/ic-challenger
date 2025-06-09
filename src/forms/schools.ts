import { z } from "zod";

export const schoolFormSchema = z.object({
  name_fr: z
    .string({
      required_error: "Veuillez renseigner le nom de l'école",
    })
    .min(1, {
      message: "Veuillez renseigner le nom de l'école",
    }),
  status: z.enum(["external", "local", "centrale"], {
    required_error: "Veuillez sélectionner un statut",
  }),
  ffsuCode: z.string({
    required_error: "Veuillez renseigner le code FFSU",
  }),
  quotaSport: z.number().min(1, {
    message: "Le quota doit être supérieur à 0",
  }),
  quotaBySport: z.record(
    z.string(),
    z.number().min(1, {
      message: "Le quota doit être supérieur à 0",
    }),
  ),
  quotaResidence: z
    .number()
    .min(1, {
      message: "Le quota doit être supérieur à 0",
    })
    .optional(),
});
