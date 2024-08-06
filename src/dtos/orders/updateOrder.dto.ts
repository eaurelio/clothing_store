import z from "zod";

export interface UpdateOrderInputDTO {
  token: string;
  orderId: string;
  status_id?: number;
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

export interface AddOrderItemInputDTO {
  token: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface RemoveOrderItemInputDTO {
  token: string;
  orderId: string;
  productId: string;
}

export const UpdateOrderSchema = z
  .object({
    token: z.string(),
    orderId: z.string(),
    status_id: z.number().optional(),
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
