import { z } from "zod";

export const sportQuotaFormSchema = z.object({
  participant_quota: z.number().optional(),
  team_quota: z.number().optional(),
});

export type SportQuotaFormValues = z.infer<typeof sportQuotaFormSchema>;
