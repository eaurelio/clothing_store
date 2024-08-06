import z from "zod";

export interface CreateOrderInputDTO {
  token: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  status_id: number; // Ajustado para number
  total: number;
}

export interface CreateOrderOutputDTO {
  message: string;
  order: {
    orderId: string;
    userId: string;
    orderDate: string;
    status: number; // Ajustado para number
    total: number;
    items: {
      itemId: string; // Incluído itemId
      productId: string;
      quantity: number;
      price: number;
    }[];
  };
}


export const CreateOrderSchema = z
  .object({
    token: z.string().min(1),
    items: z
      .array(
        z.object({
          productId: z.string().min(1),
          quantity: z.number().min(1),
          price: z.number().min(0),
        })
      )
      .min(1),
    status_id: z.number().int().min(1), // Ajustado para number
    total: z.number().min(0),
  })
  .transform((data) => data as CreateOrderInputDTO);
