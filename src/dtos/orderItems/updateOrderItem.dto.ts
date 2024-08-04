// import z from "zod";

// export interface UpdateOrderItemInputDTO {
//   token: string;
//   itemId: string;
//   quantity?: number;
//   price?: number;
// }

// export interface UpdateOrderItemOutputDTO {
//   message: string;
//   orderItem: {
//     itemId: string;
//     orderId: string;
//     productId: string;
//     quantity: number;
//     price: number;
//   };
// }

// export const UpdateOrderItemSchema = z
//   .object({
//     token: z.string(),
//     itemId: z.string(),
//     quantity: z.number().min(1).optional(),
//     price: z.number().min(0).optional(),
//   })
//   .transform((data) => data as UpdateOrderItemInputDTO);
