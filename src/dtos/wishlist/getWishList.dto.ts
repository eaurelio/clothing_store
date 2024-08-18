import z from 'zod';

export interface GetWishListInputDTO {
  token: string;
}

export interface GetWishListOutputDTO {
  wishlist: {
    wishlist_id: string;
    userId: string;
    created_at: string;
    items: { wishlistId: string; productId: string }[];
  };
}

export const GetWishListSchema = z.object({
  token: z.string(),
}).transform(data => data as GetWishListInputDTO)