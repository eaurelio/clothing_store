export interface AddOrderItemInputDTO {
  token: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}

import { z } from "zod";

export const AddOrderItemSchema = z
  .object({
    token: z.string().min(1),
    orderId: z.string().min(1),
    productId: z.string().min(1),
    quantity: z.number().min(1),
    price: z.number().min(0),
  })
  .transform((data) => data as AddOrderItemInputDTO);
