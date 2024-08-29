import z from "zod";
import { ProductImageDB } from "../../models/ProductImage";

export interface CreateProductInputDTO {
  token: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: number;
  colorId: number;
  sizeId: number;
  genderId: number;
  images?: ProductImageDB[];
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
    categoryId?: number;
    colorId?: number;
    sizeId?: number;
    genderId?: number;
    images?: ProductImageDB[];
  };
}

const ProductImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
});

export const CreateProductSchema = z
  .object({
    token: z.string(),
    name: z.string().min(1),
    description: z.string().optional(),
    price: z.number().min(0),
    stock: z.number().int().min(0),
    categoryId: z.number().optional(),
    colorId: z.number().optional(),
    sizeId: z.number().optional(),
    genderId: z.number().optional(),
    images: z.array(ProductImageSchema).optional(),
  })
  .transform((data) => data as CreateProductInputDTO);

// --------------------------------------------------------------------

export interface CreateCategoryInputDTO {
  name: string;
  description?: string;
}

export interface CreateCategoryOutputDTO {
  message: string;
  category: {
    name: string;
    description?: string;
  };
}

export const CreateCategorySchema = z
  .object({
    name: z.string().min(1),
    description: z.string().optional(),
  })
  .transform((data) => data as CreateCategoryInputDTO);

// --------------------------------------------------------------------

export interface CreateColorInputDTO {
  name: string;
  hexCode?: string;
}

export interface CreateColorOutputDTO {
  message: string;
  color: {
    name: string;
  };
}

export const CreateColorSchema = z
  .object({
    name: z.string().min(3),
    hexCode: z.string().min(4),
  })
  .transform((data) => data as CreateColorInputDTO);

// --------------------------------------------------------------------

export interface CreateSizeInputDTO {
  name: string;
}

export interface CreateSizeOutputDTO {
  message: string;
  size: {
    name: string;
  };
}

export const CreateSizeSchema = z
  .object({
    name: z.string().min(1),
  })
  .transform((data) => data as CreateSizeInputDTO);

// --------------------------------------------------------------------

export interface CreateGenderInputDTO {
  name: string;
}

export interface CreateGenderOutputDTO {
  message: string;
  gender: {
    name: string;
  };
}

export const CreateGenderSchema = z
  .object({
    name: z.string().min(1),
  })
  .transform((data) => data as CreateGenderInputDTO);
