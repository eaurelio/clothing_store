import z from "zod";

export interface GetOrderItemsInputDTO {
  token: string;
  orderId: string;
}

export interface GetOrderItemsOutputDTO {
  orderItems: {
    itemId: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
  }[];
}

export const GetOrderItemsSchema = z
  .object({
    token: z.string(),
    orderId: z.string(),
  })
  .transform((data) => data as GetOrderItemsInputDTO);
