import { z } from "zod";

export const registeringFormSchema = z
  .object({
    phone: z
      .string({
        required_error: "Veuillez renseigner le numéro de téléphone",
      })
      .min(1, {
        message: "Veuillez renseigner le numéro de téléphone",
      })
      .regex(/^\+?[0-9\s]+$/, {
        message: "Veuillez renseigner un numéro de téléphone valide",
      }),
    status: z.enum(
      ["sport", "cheerleader", "fanfaron", "cameraman", "volunteer"],
      {
        required_error: "Veuillez sélectionner au moins un statut",
      },
    ),
    sex: z.enum(["masculin", "féminin"], {
      required_error: "Veuillez sélectionner une option",
    }),
    sport: z
      .object({
        id: z.string({
          required_error: "Veuillez sélectionner un sport",
        }),
        team_id: z.string().optional(),
        team_leader: z.boolean().optional(),
        license_number: z.string().optional(),
      })
      .optional(),
    package: z.enum(["light", "full"], {
      required_error: "Veuillez sélectionner un package",
    }),
    party: z.boolean({
      required_error:
        "Veuillez indiquer si vous souhaitez participer à la soirée",
    }),
    bottle: z.boolean({
      required_error: "Veuillez indiquer si vous souhaitez une gourde",
    }),
    tShirt: z.boolean({
      required_error: "Veuillez indiquer si vous souhaitez un t-shirt",
    }),
    tShirtSize: z.enum(["XS", "S", "M", "L", "XL"]).optional(),
  })
  .superRefine((data, ctx) => {
    if (data?.tShirt && !data?.tShirtSize) {
      ctx.addIssue({
        path: ["tShirtSize"],
        code: z.ZodIssueCode.custom,
        message: "Veuillez sélectionner une taille de t-shirt",
      });
    }
  })
  .superRefine((data, ctx) => {
    if (data.status === "sport" && !data.sport) {
      ctx.addIssue({
        path: ["sport"],
        code: z.ZodIssueCode.custom,
        message: "Veuillez renseigner les informations sportives",
      });
    }
    if (
      data.status === "sport" &&
      data.sport?.team_leader &&
      !data.sport?.team_id
    ) {
      ctx.addIssue({
        path: ["sport", "team_id"],
        code: z.ZodIssueCode.custom,
        message: "Veuillez renseigner le nom de l'équipe",
      });
    }
    if (data.status === "sport" && !data.sport?.license_number) {
      ctx.addIssue({
        path: ["sport", "license_number"],
        code: z.ZodIssueCode.custom,
        message: "Veuillez renseigner le numéro de licence",
      });
    }
  });
