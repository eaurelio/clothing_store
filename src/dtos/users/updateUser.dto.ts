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
  personal_id: z.string().min(6),
  entity_type: z.string().min(6),
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8).max(12),
  birthdate: z.string(),
  address: z.string().min(2).max(40),
  number: z.string().min(1),
  neighborhood: z.string().min(2).max(20),
  city: z.string().min(2).max(20),
  country: z.string().min(2).max(20),
  gender: z.string().min(1),
}).transform(data => data as UpdateUserInputDTO);
