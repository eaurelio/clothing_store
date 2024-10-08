import z from "zod";
import { ProductImageDBOutput } from "../../models/ProductImage";

export interface UpdateProductInputDTO {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: number;
  colorId?: number;
  sizeId?: number;
  genderId?: number;
}

export interface UpdateProductOutputDTO {
  message: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
    colorId: number;
    sizeId: number;
    genderId: number;
    createdAt: string;
    images: ProductImageDBOutput[]
  };
}

export const UpdateProductSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  stock: z.number().optional(),
  categoryId: z.number().optional(),
  colorId: z.number().optional(),
  sizeId: z.number().optional(),
  genderId: z.number().optional()
}).transform((data) => data as UpdateProductInputDTO);

// --------------------------------------------------------------------

export interface ProductImageInsert {
  productId: string;
  url: string;
  alt?: string;
}

export const InsertProductImageSchema = z.object({
  productId: z.string(),
  url: z.string().url(),
  alt: z.string().optional()
}).transform(data => data as ProductImageInsert)

export interface ProductImageDelete {
  id: string,
  productId: string;
}

export const DeleteProductImageSchema = z.object({
  id: z.string(),
  productId: z.string()
}).transform(data => data as ProductImageDelete)

// --------------------------------------------------------------------

export interface ToggleProductActiveStatusInputDTO {
  productId: string;
}

export interface ToggleProductActiveStatusOutputDTO {
  message: string;
}

export const ToggleProductActiveStatusSchema = z.object({
  productId: z.string(),
}).transform(data => data as ToggleProductActiveStatusInputDTO);

// --------------------------------------------------------------------

export interface UpdateCategoryInputDTO {
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
    id: z.string(),
    name: z.string().optional(),
    description: z.string().optional(),
  })
  .transform((data) => data as UpdateCategoryInputDTO);

// --------------------------------------------------------------------

export interface UpdateColorInputDTO {
  id: string;
  name?: string;
  hex_code?: string;
}

export interface UpdateColorOutputDTO {
  message: string;
  color: {
    name: string;
  };
}

export const UpdateColorSchema = z
  .object({
    id: z.string(),
    name: z.string().optional(),
    hex_code: z.string().optional()
  })
  .transform((data) => data as UpdateColorInputDTO);

// --------------------------------------------------------------------

export interface UpdateSizeInputDTO {
  id: string;
  name?: string;
}

export interface UpdateSizeOutputDTO {
  message: string;
  size: {
    name: string;
  };
}

export const UpdateSizeSchema = z
  .object({
    id: z.string(),
    name: z.string().optional(),
  })
  .transform((data) => data as UpdateSizeInputDTO);

// --------------------------------------------------------------------

export interface UpdateGenderInputDTO {
  id: string;
  name?: string;
}

export interface UpdateGenderOutputDTO {
  message: string;
  gender: {
    name: string;
  };
}

export const UpdateGenderSchema = z
  .object({
    id: z.string(),
    name: z.string().optional(),
  })
  .transform((data) => data as UpdateGenderInputDTO);
