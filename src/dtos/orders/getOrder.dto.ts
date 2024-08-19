import z from "zod";

export interface GetOrdersInputDTO {
  userId: string;
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
    userId: z.string(),
    orderId: z.string().optional()
  })
  .transform((data) => data as GetOrdersInputDTO);

//--------------------------------------------------------------------------

export interface GetAllOrdersInputDTO {
  userId?: string | undefined;
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
    userId: z.string().optional()
  })
  .transform((data) => data as GetAllOrdersInputDTO);
