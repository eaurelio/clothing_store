import z from 'zod';
import { WishlistItemDB } from "../../models/WishList";

export interface CreateWishListInputDTO {
  token: string;
  items: { productId: string }[];
}

export interface CreateWishListOutputDTO {
  message: string;
  wishlistId: string;
  items: WishlistItemDB[]
}

export const CreateWishListSchema = z.object({
  token: z.string(),
  items: z.array(
    z.object({
      productId: z.string()
    })
  )
}).transform(data => data as CreateWishListInputDTO)
