import z from "zod";

export interface UpdateOrderInputDTO {
  token: string;
  orderId: string;
  status?: string;
  items?: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  total?: number;
}

export interface UpdateOrderOutputDTO {
  message: string;
  order: {
    orderId: string;
    userId: string;
    orderDate: string;
    status: string;
    total: number;
    items: {
      itemId: string;
      productId: string;
      quantity: number;
      price: number;
    }[];
  };
}

export const UpdateOrderSchema = z
  .object({
    token: z.string(),
    orderId: z.string(),
    status: z.string().optional(),
    items: z
      .array(
        z.object({
          productId: z.string().min(1),
          quantity: z.number().min(1),
          price: z.number().min(0),
        })
      )
      .optional(),
    total: z.number().optional(),
  })
  .transform((data) => data as UpdateOrderInputDTO);
