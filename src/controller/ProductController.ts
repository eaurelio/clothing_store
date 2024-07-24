import { Request, Response } from "express";
import { ProductBusiness } from "../business/ProductBusiness";
import { CreateProductSchema } from "../dtos/products/createProduct.dto";
import { UpdateProductSchema } from "../dtos/products/updateProduct.dto";
import { GetProductSchema, GetAllProductsSchema } from "../dtos/products/getProduct.dto";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { NotFoundError } from "../errors/NotFoundError";
import { BadRequestError } from "../errors/BadRequestError";

export class ProductController {
  constructor(private productBusiness: ProductBusiness) {}

  // public createProduct = async (req: Request, res: Response) => {
  //   try {
  //     const input = CreateProductSchema.parse({
  //       name: req.body.name,
  //       description: req.body.description,
  //       price: req.body.price,
  //       stock: req.body.stock,
  //       category_id: req.body.category_id,
  //       color_id: req.body.color_id,
  //       size_id: req.body.size_id,
  //       gender_id: req.body.gender_id,
  //       token: req.headers.authorization // Assumindo que o token está no header Authorization
  //     });

  //     const output = await this.productBusiness.createProduct(input);
  //     res.status(201).send(output);
  //   } catch (error) {
  //     console.log(error);
  //     if (
  //       error instanceof BadRequestError ||
  //       error instanceof NotFoundError ||
  //       error instanceof UnauthorizedError
  //     ) {
  //       res.status(error.statusCode).json({ message: error.message });
  //     } else {
  //       res.status(500).json({ message: "Unexpected error" });
  //     }
  //   }
  // };

  // public updateProduct = async (req: Request, res: Response) => {
  //   try {
  //     const input = UpdateProductSchema.parse({
  //       id: req.params.id,
  //       name: req.body.name,
  //       description: req.body.description,
  //       price: req.body.price,
  //       stock: req.body.stock,
  //       category_id: req.body.category_id,
  //       color_id: req.body.color_id,
  //       size_id: req.body.size_id,
  //       gender_id: req.body.gender_id,
  //       token: req.headers.authorization // Assumindo que o token está no header Authorization
  //     });

  //     const output = await this.productBusiness.updateProduct(input, req.headers.authorization);
  //     res.status(200).send(output);
  //   } catch (error) {
  //     console.log(error);
  //     if (
  //       error instanceof BadRequestError ||
  //       error instanceof NotFoundError ||
  //       error instanceof UnauthorizedError
  //     ) {
  //       res.status(error.statusCode).json({ message: error.message });
  //     } else {
  //       res.status(500).json({ message: "Unexpected error" });
  //     }
  //   }
  // };

  public getProduct = async (req: Request, res: Response) => {
    try {
      const input = GetProductSchema.parse({
        id: req.params.id,
        token: req.headers.authorization // Assumindo que o token está no header Authorization
      });

      const output = await this.productBusiness.getProduct(input);
      res.status(200).send(output);
    } catch (error) {
      console.log(error);
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

  public getAllProducts = async (req: Request, res: Response) => {
    try {
      const input = GetAllProductsSchema.parse({
        q: req.query.q as string | undefined,
        category_id: req.body.category_id ? Number(req.body.category_id) : undefined,
        color_id: req.body.color_id ? Number(req.body.color_id) : undefined,
        size_id: req.body.size_id ? Number(req.body.size_id) : undefined,
        gender_id: req.body.gender_id ? Number(req.body.gender_id) : undefined,
        token: req.headers.authorization // Assumindo que o token está no header Authorization
      });

      const output = await this.productBusiness.getAllProducts(input);
      res.status(200).send(output);
    } catch (error) {
      console.log(error);
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
}
