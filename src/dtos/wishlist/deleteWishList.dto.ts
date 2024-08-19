import z from 'zod';

export interface DeleteWishListInputDTO {
  userId: string;
}

export interface DeleteWishListOutputDTO {
  message: string;
}

export const DeleteWishListSchema = z.object({
  userId: z.string(),
}).transform(data => data as DeleteWishListInputDTO)