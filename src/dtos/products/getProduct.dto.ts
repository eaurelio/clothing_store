import z from 'zod';
import { ProductDB, ProductDBOutput } from '../../models/Products';

// DTOs para obter produtos
export interface GetProductInputDTO {
  id: string;
}

export interface GetAllProductsInputDTO {
  name?: string; 
  category_id?: number;
  color_id?: number;
  size_id?: number;
  gender_id?: number;
}

export interface GetProductOutputDTO {
  product: ProductDBOutput;
}

export interface GetAllProductsOutputDTO {
  products: ProductDBOutput[];
}

export const GetProductSchema = z.object({
  id: z.string()
}).transform(data => data as GetProductInputDTO);

export const GetAllProductsSchema = z.object({
  q: z.string().optional(),
  category_id: z.number().optional(),
  color_id: z.number().optional(),
  size_id: z.number().optional(),
  gender_id: z.number().optional()
}).transform(data => data as GetAllProductsInputDTO);


// DTOs para obter categorias
export interface GetCategoryInputDTO {
  id: number;
  token: string;
}

export interface GetAllCategoriesInputDTO {
  token: string;
}

export const GetCategorySchema = z.object({
  id: z.number(),
  token: z.string()
}).transform(data => data as GetCategoryInputDTO);

export const GetAllCategoriesSchema = z.object({
  token: z.string()
}).transform(data => data as GetAllCategoriesInputDTO);


// DTOs para obter cores
export interface GetColorInputDTO {
  id: number;
  token: string;
}

export interface GetAllColorsInputDTO {
  token: string;
}

export const GetColorSchema = z.object({
  id: z.number(),
  token: z.string()
}).transform(data => data as GetColorInputDTO);

export const GetAllColorsSchema = z.object({
  token: z.string()
}).transform(data => data as GetAllColorsInputDTO);


// DTOs para obter tamanhos
export interface GetSizeInputDTO {
  id: number;
  token: string;
}

export interface GetAllSizesInputDTO {
  token: string; 
}

export const GetSizeSchema = z.object({
  id: z.number(),
  token: z.string()
}).transform(data => data as GetSizeInputDTO);

export const GetAllSizesSchema = z.object({
  token: z.string()
}).transform(data => data as GetAllSizesInputDTO);


// DTOs para obter gêneros
export interface GetGenderInputDTO {
  id: number;
  token: string;
}

export interface GetAllGendersInputDTO {
  token: string;
}

export const GetGenderSchema = z.object({
  id: z.number(),
  token: z.string()
}).transform(data => data as GetGenderInputDTO);

export const GetAllGendersSchema = z.object({
  token: z.string()
}).transform(data => data as GetAllGendersInputDTO);
