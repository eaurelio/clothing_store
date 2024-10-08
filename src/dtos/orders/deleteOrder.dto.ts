import { z } from "zod";

export interface DeleteOrderInputDTO {
  orderId: string;
}

export interface DeleteOrderOutputDTO {
  message: string;
}

export const DeleteOrderSchema = z
  .object({
    orderId: z.string()
  })
  .transform((data) => data as DeleteOrderInputDTO);

//--------------------------------------------------------------------------

export interface CancelOrderInputDTO {
  orderId: string;
  userId: string;
}

export interface CancelOrderOutputDTO {
  message: string;
}

export const CancelOrderSchema = z
  .object({
    orderId: z.string(),
    userId: z.string()
  })
  .transform((data) => data as CancelOrderInputDTO);
