import { Wishlist, WishlistDB } from './../../models/WishList';
import z from 'zod';
import { WishlistItemDB } from "../../models/WishList";
import { GetWishListOutputDTO } from './getWishList.dto';

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
    items: { wishlistId: string; productId: string }[];
  };
}

export const UpdateWishListSchema = z.object({
  userId: z.string(),
  items: z.array(
    z.object({
      productId: z.string()
    })
  )
}).transform(data => data as UpdateWishListInputDTO);
