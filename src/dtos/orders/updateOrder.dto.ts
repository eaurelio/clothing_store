import z from "zod";

export interface UpdateOrderInputDTO {
  orderId: string;
  statusId?: number;
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
    status: string | number;
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
    orderId: z.string(),
    statusId: z.number().optional(),
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


