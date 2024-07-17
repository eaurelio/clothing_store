import z from 'zod';

export interface UpdateUserInputDTO {
  id: string;
  personal_id?: string;
  entity_type?: string;
  name?: string;
  email?: string;
  password?: string;
  birthdate?: string; 
  address?: string; 
  number?: string; 
  neighborhood?: string; 
  city?: string; 
  country?: string; 
  gender?: string; 
  phones?: {
    number: string;
    type: string;
  }[];
}


export interface UpdateUserOutputDTO {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    token?: string;
    birthdate?: string;
    address?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    country?: string;
    gender?: string;
  };
}

export const UpdateUserSchema = z.object({
  id: z.string(),
  personal_id: z.string().min(6).optional(),
  entity_type: z.string().min(6).optional(),
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).max(12).optional(),
  birthdate: z.string().optional(),
  address: z.string().min(2).max(40).optional(),
  number: z.string().min(1).optional(),
  neighborhood: z.string().min(2).max(20).optional(),
  city: z.string().min(2).max(20).optional(),
  country: z.string().min(2).max(20).optional(),
  gender: z.string().min(1).optional(),
}).transform(data => data as UpdateUserInputDTO);
