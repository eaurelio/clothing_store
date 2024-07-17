import z from 'zod';

export interface GetUserInputDTO {
  id: string,
  token: string,
}

export interface GetAllUserInputDTO {
  q: string,
  token: string,
}

export const GetUserSchema = z.object({
  id: z.string(),
  token: z.string()
}).transform(data => data as GetUserInputDTO);

export const GetAllUserSchema = z.object({
  q: z.string().optional(),
  token: z.string()
}).transform(data => data as GetAllUserInputDTO);
