import z from 'zod';
import { WishlistDB } from "../../models/WishList";

export interface GetWishListInputDTO {
  token: string;
}

export interface GetWishListOutputDTO {
  wishlist: {
    id: string;
    userId: string;
    createdAt: string;
    items: { wishlistId: string; productId: string }[];
  };
}

export const GetWishListSchema = z.object({
  token: z.string(),
}).transform(data => data as GetWishListInputDTO)