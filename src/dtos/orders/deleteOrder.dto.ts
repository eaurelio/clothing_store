import { z } from "zod";

export interface DeleteOrderInputDTO {
  orderId: string;
}

export interface DeleteOrderOutputDTO {
  message: string;
}

export const DeleteOrderSchema = z
  .object({
    orderId: z.string().min(1),
  })
  .transform((data) => data as DeleteOrderInputDTO);

//--------------------------------------------------------------------------

export interface CancelOrderInputDTO {
  orderId: string;
}

export interface CancelOrderOutputDTO {
  message: string;
}

export const CancelOrderSchema = z
  .object({
    orderId: z.string().min(1),
  })
  .transform((data) => data as CancelOrderInputDTO);
