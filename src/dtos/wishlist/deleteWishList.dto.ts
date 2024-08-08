import z from 'zod';

export interface DeleteWishListInputDTO {
  token: string;
  wishlistId: string;
}

export interface DeleteWishListOutputDTO {
  message: string;
}

export const DeleteWishListSchema = z.object({
  token: z.string(),
  wishlistId: z.string().min(1)
}).transform(data => data as DeleteWishListInputDTO)