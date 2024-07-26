import z from "zod";

export interface UpdateProductInputDTO {
  token: string;
  id: string;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category_id?: number;
  color_id?: number;
  size_id?: number;
  gender_id?: number;
}

export interface UpdateProductOutputDTO {
  message: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category_id: number;
    color_id: number;
    size_id: number;
    gender_id: number;
    createdAt: string;
  };
}

export const UpdateProductSchema = z
  .object({
    token: z.string(),
    id: z.string(),
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    stock: z.number().optional(),
    category_id: z.number().optional(),
    color_id: z.number().optional(),
    size_id: z.number().optional(),
    gender_id: z.number().optional(),
  })
  .transform((data) => data as UpdateProductInputDTO);


export interface UpdateCategoryInputDTO {
  token: string;
  id: number;
  name?: string;
  description?: string;
}

export interface UpdateCategoryOutputDTO {
  message: string;
  category: {
    name: string;
    description?: string;
  };
}

export const UpdateCategorySchema = z
  .object({
    token: z.string().min(1),
    id: z.number(),
    name: z.string().optional(),
    description: z.string().optional(),
  })
  .transform((data) => data as UpdateCategoryInputDTO);

// DTOs para atualizar cores
export interface UpdateColorInputDTO {
  token: string;
  id: number;
  name?: string; 
}

export interface UpdateColorOutputDTO {
  message: string;
  color: {
    // id: number;
    name: string;
  };
}

export const UpdateColorSchema = z
  .object({
    token: z.string().min(1),
    id: z.number(),
    name: z.string().optional(),
  })
  .transform((data) => data as UpdateColorInputDTO);

// DTOs para atualizar tamanhos
export interface UpdateSizeInputDTO {
  token: string;
  id: number;
  name?: string;
}

export interface UpdateSizeOutputDTO {
  message: string;
  size: {
    // id: number;
    name: string;
  };
}

export const UpdateSizeSchema = z
  .object({
    token: z.string().min(1),
    id: z.number(),
    name: z.string().optional(),
  })
  .transform((data) => data as UpdateSizeInputDTO);

// DTOs para atualizar gêneros
export interface UpdateGenderInputDTO {
  token: string;
  id: number;
  name?: string;
}

export interface UpdateGenderOutputDTO {
  message: string;
  gender: {
    // id: number;
    name: string;
  };
}

export const UpdateGenderSchema = z
  .object({
    token: z.string().min(1),
    id: z.number(),
    name: z.string().optional(),
  })
  .transform((data) => data as UpdateGenderInputDTO);