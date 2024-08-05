export interface RemoveOrderItemInputDTO {
  token: string;
  orderId: string;
  productId: string;
}

import { z } from "zod";

export const RemoveOrderItemSchema = z
  .object({
    token: z.string().min(1),
    orderId: z.string().min(1),
    productId: z.string().min(1),
  })
  .transform((data) => data as RemoveOrderItemInputDTO);
