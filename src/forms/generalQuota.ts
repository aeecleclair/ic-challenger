import { z } from "zod";

export const generalQuotaFormSchema = z.object({
  athlete_quota: z.number().optional(),
  cameraman_quota: z.number().optional(),
  pompom_quota: z.number().optional(),
  fanfare_quota: z.number().optional(),
  athlete_cameraman_quota: z.number().optional(),
  athlete_pompom_quota: z.number().optional(),
  athlete_fanfare_quota: z.number().optional(),
  non_athlete_cameraman_quota: z.number().optional(),
  non_athlete_pompom_quota: z.number().optional(),
  non_athlete_fanfare_quota: z.number().optional(),
});

export type GeneralQuotaFormValues = z.infer<typeof generalQuotaFormSchema>;
