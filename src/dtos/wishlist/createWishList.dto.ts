import z from "zod";
import { WishlistItemDB } from "../../models/WishList";

export interface CreateWishListInputDTO {
  userId: string;
  items: { productId: string }[];
}

export interface CreateWishListOutputDTO {
  message: string;
  wishlistId: string;
  items: WishlistItemDB[];
}

export const CreateWishListSchema = z
  .object({
    userId: z.string(),
    items: z.array(
      z.object({
        productId: z.string(),
      })
    ),
  })
  .transform((data) => data as CreateWishListInputDTO);
