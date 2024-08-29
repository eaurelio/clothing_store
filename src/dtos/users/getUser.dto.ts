import z from "zod";

export interface GetUserInputDTO {
  userId: string;
}

export const GetUserSchema = z
  .object({
    userId: z.string(),
  })
  .transform((data) => data as GetUserInputDTO);

// --------------------------------------------------------------------

export interface GetAllUserInputDTO {
  q: string;
  onlyActive?: boolean;
}

export const GetAllUserSchema = z
  .object({
    q: z.string().optional(),
    onlyActive: z.boolean().optional(),
  })
  .transform((data) => data as GetAllUserInputDTO);
