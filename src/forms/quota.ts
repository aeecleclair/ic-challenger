import { z } from "zod";

export const quotaFormSchema = z.object({
  participant_quota: z.number().optional(),
  team_quota: z.number().optional(),
});

export type QuotaFormValues = z.infer<typeof quotaFormSchema>;
