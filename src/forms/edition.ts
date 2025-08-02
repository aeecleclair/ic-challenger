import { z } from "zod";

export const editionFormSchema = z
  .object({
    name: z
      .string({
        required_error: "Veuillez renseigner le nom de l'édition",
      })
      .min(1, {
        message: "Veuillez renseigner le nom de l'édition",
      }),
    startDate: z
      .date({
        required_error: "Veuillez renseigner la date de début de l'édition",
      })
      .refine((date) => date > new Date(), {
        message: "La date de début doit être dans le futur",
      }),
    endDate: z.date({
      required_error: "Veuillez renseigner la date de fin de l'édition",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.startDate > data.endDate) {
      ctx.addIssue({
        message: "La date de fin doit être postérieure à la date de début",
        path: ["endDate"],
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type EditionFormSchema = z.infer<typeof editionFormSchema>;
