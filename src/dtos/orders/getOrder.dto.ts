import z from "zod";

export interface GetOrdersInputDTO {
  token: string;
  orderId: string;
}

export interface GetOrdersOutputDTO {
  order: {
    orderId: string;
    userId: string;
    status: number;
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
    token: z.string().min(1),
    orderId: z.string().min(1)
  })
  .transform((data) => data as GetOrdersInputDTO);

//--------------------------------------------------------------------------

export interface GetAllOrdersInputDTO {
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
    token: z.string().min(1),
  })
  .transform((data) => data as GetOrdersInputDTO);
