import z from 'zod';

export interface Phone {
  phone_id: string;
  user_id: string;
  number: string;
  type: string;
}

export interface PhoneInputDTO {
  userId: string,
  phoneId: string,
  number: string,
  type: string
}

export interface PhoneOutputDTO {
  message: string,
  phones: Phone[]
}

export const PhoneInputSchema = z.object({
  userId: z.string(),
  phoneId: z.string(),
  number: z.string(),
  type: z.string().optional()
}).transform(data => data as PhoneInputDTO)

// --------------------------------------------------------------------

export interface PhoneDeleteDTO {
  userId: string,
  phoneId: string
}

export const PhoneDeleteSchema = z.object({
  userId: z.string(),
  phoneId: z.string()
}).transform(data => data as PhoneDeleteDTO)