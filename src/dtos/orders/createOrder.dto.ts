import z from "zod";

export interface CreateOrderInputDTO {
  userId: string;
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
    userId: z.string(),
    items: z
      .array(
        z.object({
          productId: z.string().min(1),
          quantity: z.number().min(1),
          price: z.number().min(0),
        })
      )
      .min(1),
    total: z.number().min(0),
  })
  .transform((data) => data as CreateOrderInputDTO);
