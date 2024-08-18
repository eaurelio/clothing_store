import z from 'zod';

export interface DeleteWishListInputDTO {
  token: string;
}

export interface DeleteWishListOutputDTO {
  message: string;
}

export const DeleteWishListSchema = z.object({
  token: z.string(),
}).transform(data => data as DeleteWishListInputDTO)