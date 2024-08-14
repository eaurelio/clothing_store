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

// --------------------------------------------------------------------

export interface ToggleProductActiveStatusInputDTO {
  productId: string;
  token: string;
}

export interface ToggleProductActiveStatusOutputDTO {
  message: string;
}

export const ToggleProductActiveStatusSchema = z.object({
  productId: z.string(),
  token: z.string()
}).transform(data => data as ToggleProductActiveStatusInputDTO);

// --------------------------------------------------------------------

export interface UpdateCategoryInputDTO {
  token: string;
  id: string;
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
    id: z.string(),
    name: z.string().optional(),
    description: z.string().optional(),
  })
  .transform((data) => data as UpdateCategoryInputDTO);

// --------------------------------------------------------------------

export interface UpdateColorInputDTO {
  token: string;
  id: string;
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
    id: z.string(),
    name: z.string().optional(),
  })
  .transform((data) => data as UpdateColorInputDTO);

// --------------------------------------------------------------------

export interface UpdateSizeInputDTO {
  token: string;
  id: string;
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
    id: z.string(),
    name: z.string().optional(),
  })
  .transform((data) => data as UpdateSizeInputDTO);

// --------------------------------------------------------------------

export interface UpdateGenderInputDTO {
  token: string;
  id: string;
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
    id: z.string(),
    name: z.string().optional(),
  })
  .transform((data) => data as UpdateGenderInputDTO);
