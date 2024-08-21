import z from 'zod';
import { LoginOutputDTO } from './login';

export interface UpdateUserInputDTO {
  userId: string;
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
    userId: string;
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
  userId: z.string(),
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

//----------------------------------------------------

export interface UpdatePasswordInputDTO {
  userId: string;
  email: string;
  oldPassword: string;
  newPassword: string;
}

export interface UpdatePasswordOutputDTO {
  message: string;
}

export const UpdatePasswordSchema = z.object({
  userId: z.string(),
  email: z.string(),
  oldPassword: z.string().min(8).max(16),
  newPassword: z.string().min(8).max(16)
}).transform(data => data as UpdatePasswordInputDTO)

//----------------------------------------------------

export interface ToggleUserActiveStatusInputDTO {
  email: string;
  password: string;
}

export interface ToggleUserActiveStatusOutputDTO {
  message: string;
}

export const ToggleUserActiveStatusSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
}).transform(data => data as ToggleUserActiveStatusInputDTO);
