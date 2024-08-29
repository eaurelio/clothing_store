import z from "zod";

export interface LoginInputDTO {
  email: string;
  password: string;
}

export interface LoginOutputDTO {
  message: string;
  user: {
    userId: string;
    name: string;
    email: string;
    token?: string;
  };
}

export const LoginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8).max(20),
  })
  .transform((data) => data as LoginInputDTO);
