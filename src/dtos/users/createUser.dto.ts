import z from 'zod';
import { USER_ROLES } from '../../models/User';

export interface CreateUserInputDTO {
  token?: string;
  personalId: string;
  entityType: string;
  name: string;
  gender: string; 
  email: string;
  password: string;
  birthdate: string; 
  role?: USER_ROLES;
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
  token: z.string().optional(),
  personalId: z.string().min(2).max(16),
  entityType: z.string().min(8),
  name: z.string().min(2),
  gender: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8).max(16),
  role: z.string().optional(),
  birthdate: z.string(),
  address: z.string().min(2).max(40),
  number: z.string().min(1),
  neighborhood: z.string().min(2).max(20),
  city: z.string().min(2).max(20),
  country: z.string().min(2).max(20),
  phones: z.array(
    z.object({
      number: z.string(),
      type: z.string()
    })
  )
}).transform(data => data as CreateUserInputDTO);

