import z from 'zod';

export interface CreateUserInputDTO {
  personal_id: string;
  entity_type: string;
  name: string;
  gender: string; 
  email: string;
  password: string;
  birthdate: string; 
  address: string; 
  number: string; 
  neighborhood: string; 
  city: string; 
  country: string; 
  phones?: {
    number: string;
    type: string;
  }[];
}

export interface CreateUserOutputDTO {
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

export const CreateUserSchema = z.object({
  personal_id: z.string().min(2).max(16),
  entity_type: z.string().min(8),
  name: z.string().min(2),
  gender: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8).max(16),
  birthdate: z.string(),
  address: z.string().min(2).max(40),
  number: z.string().min(1),
  neighborhood: z.string().min(2).max(20),
  city: z.string().min(2).max(20),
  country: z.string().min(2).max(20),
}).transform(data => data as CreateUserInputDTO);

