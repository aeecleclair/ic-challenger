import { z } from "zod";
import { ProductVariant } from "@/src/api/hyperionSchemas";
export const editProductSchema = z.object({
  products: z.array(
    z.object({
      product: z.custom<ProductVariant>(),
      quantity: z.number().min(1),
    }),
  ),
});

export type EditProductValues = z.infer<typeof editProductSchema>;
