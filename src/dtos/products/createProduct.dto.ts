import z from 'zod';

// Product DTOs
export interface CreateProductInputDTO {
  token: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category_id: number;
  color_id: number;
  size_id: number;
  gender_id: number;
}

export interface CreateProductOutputDTO {
  message: string;
  product: {
    id: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    createdAt: string;
    category_id?: number;
    color_id?: number;
    size_id?: number;
    gender_id?: number;
  };
}

export const CreateProductSchema = z.object({
  token: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  stock: z.number().int().min(0),
  category_id: z.number().optional(),
  color_id: z.number().optional(),
  size_id: z.number().optional(),
  gender_id: z.number().optional(),
}).transform(data => data as CreateProductInputDTO);

// Category DTOs
export interface CreateCategoryInputDTO {
  token: string;
  name: string;
  description?: string;
}

export interface CreateCategoryOutputDTO {
  message: string;
  category: {
    // id: number,
    name: string;
    description?: string;
  };
}

export const CreateCategorySchema = z.object({
  token: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
}).transform(data => data as CreateCategoryInputDTO);

// Color DTOs
export interface CreateColorInputDTO {
  token: string;
  name: string;
}

export interface CreateColorOutputDTO {
  message: string;
  color: {
    // id: number;
    name: string;
  };
}

export const CreateColorSchema = z.object({
  token: z.string().min(1),
  name: z.string().min(3),
}).transform(data => data as CreateColorInputDTO);

// Size DTOs
export interface CreateSizeInputDTO {
  token: string;
  name: string;
}

export interface CreateSizeOutputDTO {
  message: string;
  size: {
    // id: number;
    name: string;
  };
}

export const CreateSizeSchema = z.object({
  token: z.string().min(1),
  name: z.string().min(1),
}).transform(data => data as CreateSizeInputDTO);

// Gender DTOs
export interface CreateGenderInputDTO {
  token: string;
  name: string;
}

export interface CreateGenderOutputDTO {
  message: string;
  gender: {
    // id: number;
    name: string;
  };
}

export const CreateGenderSchema = z.object({
  token: z.string().min(1),
  name: z.string().min(1),
}).transform(data => data as CreateGenderInputDTO);
