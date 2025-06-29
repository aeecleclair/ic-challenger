import { z } from "zod";

export const quotaFormSchema = z.object({
  participant_quota: z
    .number()
    .min(0, "Le quota de participants doit être supérieur ou égal à 0"),
  team_quota: z
    .number()
    .min(0, "Le quota d'équipes doit être supérieur ou égal à 0"),
});

export type QuotaFormValues = z.infer<typeof quotaFormSchema>;
