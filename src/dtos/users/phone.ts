import z from 'zod';

export interface PhoneInputDTO {
  userId: string,
  token: string,
  phoneId: string,
  number: string,
  type: string
}

export interface Phone {
  phone_id: string;
  user_id: string;
  number: string;
  type: string;
}

export interface PhoneOutputDTO {
  message: string,
  phones: Phone[]
}

export const PhoneInputSchema = z.object({
  userId: z.string(),
  token: z.string(),
  phoneId: z.string(),
  number: z.string(),
  type: z.string().optional()
}).transform(data => data as PhoneInputDTO)