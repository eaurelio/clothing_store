import z from 'zod';

export interface GetWishListInputDTO {
  userId: string;
}

export interface GetWishListOutputDTO {
  wishlist: {
    wishlist_id: string;
    userId: string;
    created_at: string;
    items: { productId: string }[];
  };
}

export const GetWishListSchema = z.object({
  userId: z.string(),
}).transform(data => data as GetWishListInputDTO)