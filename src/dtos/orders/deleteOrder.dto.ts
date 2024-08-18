import { z } from "zod";

export interface DeleteOrderInputDTO {
  token: string;
  orderId: string;
}

export interface DeleteOrderOutputDTO {
  message: string;
}

export const DeleteOrderSchema = z
  .object({
    token: z.string().min(1),
    orderId: z.string().min(1),
  })
  .transform((data) => data as DeleteOrderInputDTO);

//--------------------------------------------------------------------------

export interface CancelOrderInputDTO {
  token: string;
  orderId: string;
}

export interface CancelOrderOutputDTO {
  message: string;
}

export const CancelOrderSchema = z
  .object({
    token: z.string().min(1),
    orderId: z.string().min(1),
  })
  .transform((data) => data as CancelOrderInputDTO);
