import z from "zod";
import { ProductDBOutput } from "../../models/Products";

// --------------------------------------------------------------------

export interface GetAllProductsInputDTO {
  id?: string;
  name?: string;
  categoryId?: number;
  colorId?: number;
  sizeId?: number;
  genderId?: number;
  active?: boolean;
}

export interface GetProductOutputDTO {
  product: ProductDBOutput;
}

export interface GetAllProductsOutputDTO {
  products: ProductDBOutput[];
}

export const GetAllProductsSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    categoryId: z.number().optional(),
    colorId: z.number().optional(),
    sizeId: z.number().optional(),
    genderId: z.number().optional(),
    active: z.boolean().optional(),
  })
  .transform((data) => data as GetAllProductsInputDTO);

// --------------------------------------------------------------------

export interface GetCategoryInputDTO {
  id: number;
  token: string;
}

export const GetCategorySchema = z
  .object({
    id: z.number(),
    token: z.string(),
  })
  .transform((data) => data as GetCategoryInputDTO);

export interface GetAllCategoriesInputDTO {
  token: string;
}

export const GetAllCategoriesSchema = z
  .object({
    token: z.string(),
  })
  .transform((data) => data as GetAllCategoriesInputDTO);

// --------------------------------------------------------------------

export interface GetColorInputDTO {
  id: number;
  token: string;
}

export const GetColorSchema = z
  .object({
    id: z.number(),
    token: z.string(),
  })
  .transform((data) => data as GetColorInputDTO);

export interface GetAllColorsInputDTO {
  token: string;
}

export const GetAllColorsSchema = z
  .object({
    token: z.string(),
  })
  .transform((data) => data as GetAllColorsInputDTO);

// --------------------------------------------------------------------

export interface GetSizeInputDTO {
  id: number;
  token: string;
}

export const GetSizeSchema = z
  .object({
    id: z.number(),
    token: z.string(),
  })
  .transform((data) => data as GetSizeInputDTO);

export interface GetAllSizesInputDTO {
  token: string;
}

export const GetAllSizesSchema = z
  .object({
    token: z.string(),
  })
  .transform((data) => data as GetAllSizesInputDTO);

// --------------------------------------------------------------------

export interface GetGenderInputDTO {
  id: number;
  token: string;
}

export const GetGenderSchema = z
  .object({
    id: z.number(),
    token: z.string(),
  })
  .transform((data) => data as GetGenderInputDTO);

export interface GetAllGendersInputDTO {
  token: string;
}

export const GetAllGendersSchema = z
  .object({
    token: z.string(),
  })
  .transform((data) => data as GetAllGendersInputDTO);
