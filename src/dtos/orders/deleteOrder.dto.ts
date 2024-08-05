import { z } from "zod";

export interface DeleteOrderInputDTO {
  token: string;
  orderId: string;
}

export const DeleteOrderSchema = z
  .object({
    token: z.string().min(1),
    orderId: z.string().min(1),
  })
  .transform((data) => data as DeleteOrderInputDTO);
