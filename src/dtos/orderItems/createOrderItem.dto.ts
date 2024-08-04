import z from "zod";

export interface CreateOrderInputDTO {
  token: string;
  userId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  status_id: number;
  total: number;
}

export interface CreateOrderOutputDTO {
  message: string;
  order: {
    orderId: string;
    userId: string;
    orderDate: string;
    status: number;
    total: number;
    items: {
      itemId: string;
      productId: string;
      quantity: number;
      price: number;
    }[];
  };
}


export const CreateOrderSchema = z
  .object({
    token: z.string().min(1),
    userId: z.string().min(1),
    items: z
      .array(
        z.object({
          productId: z.string().min(1),
          quantity: z.number().min(1),
          price: z.number().min(0),
        })
      )
      .min(1),
    status_id: z.number().int().min(1),
    total: z.number().min(0),
  })
  .transform((data) => data as CreateOrderInputDTO);
