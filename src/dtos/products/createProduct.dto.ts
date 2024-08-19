import z from 'zod';

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

// --------------------------------------------------------------------

export interface CreateCategoryInputDTO {
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
  name: z.string().min(1),
  description: z.string().optional(),
}).transform(data => data as CreateCategoryInputDTO);

// --------------------------------------------------------------------

export interface CreateColorInputDTO {
  name: string;
  hex_code?: string;
}

export interface CreateColorOutputDTO {
  message: string;
  color: {
    // id: number;
    name: string;
  };
}

export const CreateColorSchema = z.object({
  name: z.string().min(3),
  hex_code: z.string().min(4)
}).transform(data => data as CreateColorInputDTO);

// --------------------------------------------------------------------

export interface CreateSizeInputDTO {
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
  name: z.string().min(1),
}).transform(data => data as CreateSizeInputDTO);

// --------------------------------------------------------------------

export interface CreateGenderInputDTO {
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
  name: z.string().min(1),
}).transform(data => data as CreateGenderInputDTO);
