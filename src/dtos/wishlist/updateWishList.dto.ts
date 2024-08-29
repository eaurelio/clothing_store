import z from "zod";

export interface UpdateWishListInputDTO {
  userId: string;
  items: { productId: string }[];
}

export interface UpdateWishListOutputDTO {
  message: string;
  wishlist: {
    wishlist_id: string;
    userId: string;
    created_at: string;
    items: { productId: string }[];
  };
}

export const UpdateWishListSchema = z
  .object({
    userId: z.string(),
    items: z.array(
      z.object({
        productId: z.string(),
      })
    ),
  })
  .transform((data) => data as UpdateWishListInputDTO);
