import z from "zod";
import { USER_ROLES } from "../../models/User";

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
  personalId?: string;
  genderId?: number;
  email?: string;
  role?: USER_ROLES;
  onlyActive?: boolean;
}

export const GetAllUserSchema = z.object({
  q: z.string().optional(),
  personalId: z.string().optional(),
  genderId: z.number().optional(),
  email: z.string().optional(),
  role: z.enum([USER_ROLES.ADMIN, USER_ROLES.CLIENT]).optional(),
  onlyActive: z.boolean().optional()
})
.transform((data) => data as GetAllUserInputDTO);
