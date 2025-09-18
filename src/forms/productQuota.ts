import { z } from "zod";

export const productQuotaFormSchema = z.object({
  quota: z.number().optional(),
});

export type ProductQuotaFormValues = z.infer<typeof productQuotaFormSchema>;
