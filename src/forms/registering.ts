import { z } from "zod";

export const registeringFormSchema = z
  .object({
    name: z
      .string({
        required_error: "Veuillez renseigner le nom",
      })
      .min(1, {
        message: "Veuillez renseigner le nom",
      }),
    firstName: z
      .string({
        required_error: "Veuillez renseigner le prénom",
      })
      .min(1, {
        message: "Veuillez renseigner le prénom",
      }),
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
    sport: z
      .object({
        id: z.string(),
        team: z.string().optional(),
        team_leader: z.boolean().optional(),
        license: z.boolean().optional(),
        license_number: z.string().optional(),
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
      .optional()
      .superRefine((data, ctx) => {
        if (data?.tShirt && !data?.tShirtSize) {
          ctx.addIssue({
            path: ["tShirtSize"],
            code: z.ZodIssueCode.custom,
            message: "Veuillez sélectionner une taille de t-shirt",
          });
        }
      }),
    cheerleader: z
      .object({
        package: z.enum(["light", "full"], {
          required_error: "Veuillez sélectionner un package",
        }),
      })
      .optional(),
    fanfaron: z
      .object({
        package: z.enum(["light", "full"], {
          required_error: "Veuillez sélectionner un package",
        }),
      })
      .optional(),
    cameraman: z
      .object({
        package: z.enum(["light", "full"], {
          required_error: "Veuillez sélectionner un package",
        }),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === "sport" && !data.sport) {
      ctx.addIssue({
        path: ["sport"],
        code: z.ZodIssueCode.custom,
        message: "Veuillez renseigner les informations sportives",
      });
    } else if (data.status === "cheerleader" && !data.cheerleader) {
      ctx.addIssue({
        path: ["cheerleader", "package"],
        code: z.ZodIssueCode.custom,
        message: "Veuillez renseigner le package",
      });
    } else if (data.status === "fanfaron" && !data.fanfaron) {
      ctx.addIssue({
        path: ["fanfaron", "package"],
        code: z.ZodIssueCode.custom,
        message: "Veuillez renseigner le package",
      });
    } else if (data.status === "cameraman" && !data.cameraman) {
      ctx.addIssue({
        path: ["cameraman", "package"],
        code: z.ZodIssueCode.custom,
        message: "Veuillez renseigner le package",
      });
    }
    if (
      data.status === "sport" &&
      data.sport?.team_leader &&
      !data.sport?.team
    ) {
      ctx.addIssue({
        path: ["sport", "team"],
        code: z.ZodIssueCode.custom,
        message: "Veuillez renseigner le nom de l'équipe",
      });
    }
    if (
      data.status === "sport" &&
      data.sport?.license &&
      !data.sport?.license_number
    ) {
      ctx.addIssue({
        path: ["sport", "license_number"],
        code: z.ZodIssueCode.custom,
        message: "Veuillez renseigner le numéro de licence",
      });
    }
  });
