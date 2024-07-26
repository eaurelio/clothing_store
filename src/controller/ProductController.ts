import { Request, Response } from "express";
import { ProductBusiness } from "../business/ProductBusiness";
import { CreateCategorySchema, CreateColorSchema, CreateGenderSchema, CreateProductSchema, CreateSizeSchema } from "../dtos/products/createProduct.dto";
import { UpdateCategorySchema, UpdateColorSchema, UpdateGenderSchema, UpdateProductSchema, UpdateSizeSchema } from "../dtos/products/updateProduct.dto";
import { GetProductSchema, GetAllProductsSchema } from "../dtos/products/getProduct.dto";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { NotFoundError } from "../errors/NotFoundError";
import { BadRequestError } from "../errors/BadRequestError";
import { ZodError } from "zod";

export class ProductController {
  constructor(private productBusiness: ProductBusiness) {}

  // ------------------------------------------------------------------------------------------------------------------
  // PRODUCTS
  // ------------------------------------------------------------------------------------------------------------------

  public createProduct = async (req: Request, res: Response) => {
    try {
      const input = CreateProductSchema.parse({
        token: req.headers.authorization as string,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock,
        category_id: req.body.category_id,
        color_id: req.body.color_id,
        size_id: req.body.size_id,
        gender_id: req.body.gender_id
      });

      const output = await this.productBusiness.createProduct(input);
      res.status(201).send(output);
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      }
      if (
        error instanceof BadRequestError ||
        error instanceof NotFoundError ||
        error instanceof UnauthorizedError
      ) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unexpected error" });
      }
    }
  };

  // ------------------------------------------------------------------------------------------------------------------

  public editProduct = async (req: Request, res: Response) => {
    try {
      const input = UpdateProductSchema.parse({
        token: req.headers.authorization,
        id: req.params.id,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock,
        category_id: req.body.category_id,
        color_id: req.body.color_id,
        size_id: req.body.size_id,
        gender_id: req.body.gender_id,
      });

      const output = await this.productBusiness.editProduct(input);

      res.status(200).send(output);
    
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      }
      if (
        error instanceof BadRequestError ||
        error instanceof NotFoundError ||
        error instanceof UnauthorizedError
      ) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unexpected error" });
      }
    }
  };

  // ------------------------------------------------------------------------------------------------------------------

  public getAllProducts = async (req: Request, res: Response) => {
    try {
      const input = GetAllProductsSchema.parse({
        name: req.body.name as string | undefined,
        category_id: req.body.category_id ? Number(req.body.category_id) : undefined,
        color_id: req.body.color_id ? Number(req.body.color_id) : undefined,
        size_id: req.body.size_id ? Number(req.body.size_id) : undefined,
        gender_id: req.body.gender_id ? Number(req.body.gender_id) : undefined
      });

      const output = await this.productBusiness.getAllProducts(input);
      res.status(200).send(output);
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      }
      if (
        error instanceof BadRequestError ||
        error instanceof NotFoundError ||
        error instanceof UnauthorizedError
      ) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unexpected error" });
      }
    }
  };

  // ------------------------------------------------------------------------------------------------------------------

  public getProduct = async (req: Request, res: Response) => {
    try {
      const input = GetProductSchema.parse({
        id: req.params.id
      });

      const output = await this.productBusiness.getProduct(input);
      res.status(200).send(output);
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      }
      if (
        error instanceof BadRequestError ||
        error instanceof NotFoundError ||
        error instanceof UnauthorizedError
      ) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unexpected error" });
      }
    }
  };

  // ------------------------------------------------------------------------------------------------------------------
  // AUX FIELDS - PRODUCTS
  // ------------------------------------------------------------------------------------------------------------------

  public createCategory = async (req: Request, res: Response) => {
    try {
      const input = CreateCategorySchema.parse({
        token: req.headers.authorization as string,
        name: req.body.name,
        description: req.body.description
      });

      const output = await this.productBusiness.createCategory(input);
      res.status(201).send(output);
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (
        error instanceof BadRequestError ||
        error instanceof NotFoundError ||
        error instanceof UnauthorizedError
      ) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unexpected error" });
      }
    }
  };

  public updateCategory = async (req: Request, res: Response) => {
    try {
      const input = UpdateCategorySchema.parse({
        token: req.headers.authorization as string,
        id: req.params.id,
        name: req.body.name,
        description: req.body.description
      });

      const output = await this.productBusiness.updateCategory(input);
      res.status(200).send(output);
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (
        error instanceof BadRequestError ||
        error instanceof NotFoundError ||
        error instanceof UnauthorizedError
      ) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unexpected error" });
      }
    }
  };

  public createColor = async (req: Request, res: Response) => {
    try {
      const input = CreateColorSchema.parse({
        token: req.headers.authorization as string,
        name: req.body.name
      });

      const output = await this.productBusiness.createColor(input);
      res.status(201).send(output);
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (
        error instanceof BadRequestError ||
        error instanceof NotFoundError ||
        error instanceof UnauthorizedError
      ) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unexpected error" });
      }
    }
  };

  public updateColor = async (req: Request, res: Response) => {
    try {
      const input = UpdateColorSchema.parse({
        token: req.headers.authorization as string,
        id: req.params.id,
        name: req.body.name
      });

      const output = await this.productBusiness.updateColor(input);
      res.status(200).send(output);
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (
        error instanceof BadRequestError ||
        error instanceof NotFoundError ||
        error instanceof UnauthorizedError
      ) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unexpected error" });
      }
    }
  };

  public createSize = async (req: Request, res: Response) => {
    try {
      const input = CreateSizeSchema.parse({
        token: req.headers.authorization as string,
        name: req.body.name
      });

      const output = await this.productBusiness.createSize(input);
      res.status(201).send(output);
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (
        error instanceof BadRequestError ||
        error instanceof NotFoundError ||
        error instanceof UnauthorizedError
      ) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unexpected error" });
      }
    }
  };

  public updateSize = async (req: Request, res: Response) => {
    try {
      const input = UpdateSizeSchema.parse({
        token: req.headers.authorization as string,
        id: req.params.id,
        name: req.body.name
      });

      const output = await this.productBusiness.updateSize(input);
      res.status(200).send(output);
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (
        error instanceof BadRequestError ||
        error instanceof NotFoundError ||
        error instanceof UnauthorizedError
      ) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unexpected error" });
      }
    }
  };

  public createGender = async (req: Request, res: Response) => {
    try {
      const input = CreateGenderSchema.parse({
        token: req.headers.authorization as string,
        name: req.body.name
      });

      const output = await this.productBusiness.createGender(input);
      res.status(201).send(output);
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (
        error instanceof BadRequestError ||
        error instanceof NotFoundError ||
        error instanceof UnauthorizedError
      ) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unexpected error" });
      }
    }
  };

  public updateGender = async (req: Request, res: Response) => {
    try {
      const input = UpdateGenderSchema.parse({
        token: req.headers.authorization as string,
        id: req.params.id,
        name: req.body.name
      });

      const output = await this.productBusiness.updateGender(input);
      res.status(200).send(output);
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (
        error instanceof BadRequestError ||
        error instanceof NotFoundError ||
        error instanceof UnauthorizedError
      ) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unexpected error" });
      }
    }
  };

}
