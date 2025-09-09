import { z } from "zod";
import {
  isValidPhoneNumber,
  parsePhoneNumberWithError,
} from "libphonenumber-js";
import { AppModulesSportCompetitionSchemasSportCompetitionProductVariantComplete } from "@/src/api/hyperionSchemas";

const sexEnum = ["masculine", "feminine"] as const;

export const registeringFormSchema = z
  .object({
    phone: z
      .string({
        required_error: "Veuillez renseigner le numéro de téléphone",
      })
      .refine(
        (value) => isValidPhoneNumber(value, "FR"),
        "Veuillez renseigner un numéro de téléphone valide",
      ),
    is_athlete: z.boolean(),
    is_cameraman: z.boolean(),
    is_fanfare: z.boolean(),
    is_pompom: z.boolean(),
    is_volunteer: z.boolean(),
    sex: z.enum(sexEnum, {
      required_error: "Veuillez sélectionner une option",
    }),
    sport: z
      .object({
        id: z.string({
          required_error: "Veuillez sélectionner un sport",
        }),
        team_id: z.string().optional(),
        team_leader: z.boolean(),
        license_number: z.string().optional(),
        substitute: z.boolean().optional(),
      })
      .optional(),
    products: z.array(
      z.object({
        product:
          z.custom<AppModulesSportCompetitionSchemasSportCompetitionProductVariantComplete>(),
        quantity: z.number().min(1),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    if (
      !data.is_athlete &&
      !data.is_cameraman &&
      !data.is_fanfare &&
      !data.is_pompom &&
      !data.is_volunteer
    ) {
      ctx.addIssue({
        path: ["is_athlete"],
        code: z.ZodIssueCode.custom,
        message: "Veuillez sélectionner au moins un rôle",
      });
    }
  })
  .superRefine((data, ctx) => {
    if (data.is_athlete && !data.sport) {
      ctx.addIssue({
        path: ["sport"],
        code: z.ZodIssueCode.custom,
        message: "Veuillez renseigner les informations sportives",
      });
    }
    if (data.is_athlete && data.sport?.team_leader && !data.sport?.team_id) {
      ctx.addIssue({
        path: ["sport", "team_id"],
        code: z.ZodIssueCode.custom,
        message: "Veuillez renseigner le nom de l'équipe",
      });
    }
  });

export type RegisteringFormValues = z.infer<typeof registeringFormSchema>;
