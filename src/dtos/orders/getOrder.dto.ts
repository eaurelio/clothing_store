import z from "zod";

export interface GetOrdersInputDTO {
  token: string;
  orderId?: string;
}

export interface GetOrdersOutputDTO {
  order: {
    orderId: string;
    userId: string;
    status_name: string;
    total: number;
    orderDate: string;
    items: {
      itemId: string;
      productId: string;
      quantity: number;
      price: number;
    }[];
  };
}

export const GetOrdersSchema = z
  .object({
    token: z.string(),
    orderId: z.string().optional()
  })
  .transform((data) => data as GetOrdersInputDTO);

//--------------------------------------------------------------------------

export interface GetAllOrdersInputDTO {
  userId?: string | undefined;
  token: string;
}

export interface GetAllOrdersOutputDTO {
  orders: {
    orderId: string;
    userId: string;
    status: string;
    total: number;
    orderDate: string;
    items: {
      itemId: string;
      productId: string;
      quantity: number;
      price: number;
    }[];
  }[];
}

export const GetAllOrdersSchema = z
  .object({
    userId: z.string().optional(),
    token: z.string(),
  })
  .transform((data) => data as GetAllOrdersInputDTO);
