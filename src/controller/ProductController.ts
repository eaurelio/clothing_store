import { Request, Response } from "express";
import { ProductBusiness } from "../business/ProductBusiness";
import {
  CreateCategorySchema,
  CreateColorSchema,
  CreateGenderSchema,
  CreateProductSchema,
  CreateSizeSchema,
} from "../dtos/products/createProduct.dto";
import {
  ToggleProductActiveStatusSchema,
  UpdateCategorySchema,
  UpdateColorSchema,
  UpdateGenderSchema,
  UpdateProductSchema,
  UpdateSizeSchema,
} from "../dtos/products/updateProduct.dto";
import {
  GetProductSchema,
  GetAllProductsSchema,
} from "../dtos/products/getProduct.dto";
import { ErrorHandler } from "../errors/ErrorHandler";
import logger from "../logs/logger";

export class ProductController {
  constructor(private productBusiness: ProductBusiness) {}

  // --------------------------------------------------------------------
  // PRODUCTS
  // --------------------------------------------------------------------

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
        gender_id: req.body.gender_id,
      });

      const output = await this.productBusiness.createProduct(input);
      res.status(201).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  // --------------------------------------------------------------------

  public editProduct = async (req: Request, res: Response) => {
    try {
      const input = UpdateProductSchema.parse({
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
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

   // --------------------------------------------------------------------

   public getProduct = async (req: Request, res: Response) => {
    try {
      const input = GetProductSchema.parse({
        id: req.params.id,
      });

      const output = await this.productBusiness.getProduct(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  // --------------------------------------------------------------------

  // public getAllProducts = async (req: Request, res: Response) => {
  //   try {
  //     const input = GetAllProductsSchema.parse({
  //       name: req.body.name ? String(req.body.name).trim() : undefined,
  //       category_id: req.body.category_id
  //         ? Number(req.body.category_id)
  //         : undefined,
  //       color_id: req.body.color_id ? Number(req.body.color_id) : undefined,
  //       size_id: req.body.size_id ? Number(req.body.size_id) : undefined,
  //       gender_id: req.body.gender_id ? Number(req.body.gender_id) : undefined,
  //       onlyActive: req.body.onlyActive
  //     });

  //     console.log(input);

  //     const output = await this.productBusiness.getAllProducts(input);
  //     res.status(200).send(output);
  //   } catch (error) {
  //     logger.error(error);
  //     ErrorHandler.handleError(error, res);
  //   }
  // };

  public getAllProducts = async (req: Request, res: Response) => {
    try {
      const input = GetAllProductsSchema.parse({
        name: req.body.name,
        category_id: req.body.category_id,
        color_id: req.body.color_id,
        size_id: req.body.size_id,
        gender_id: req.body.gender_id,
        onlyActive: req.body.onlyActive
      });

      const output = await this.productBusiness.getAllProducts(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  // --------------------------------------------------------------------

  public toggleProductActiveStatus = async (req: Request, res: Response) => {
    try {
      const input = ToggleProductActiveStatusSchema.parse({
        productId: req.params.id
      });

      const output = await this.productBusiness.toggleProductActiveStatus(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  // --------------------------------------------------------------------
  // AUX FIELDS - PRODUCTS
  // --------------------------------------------------------------------

  public getAllCategories = async (req: Request, res: Response) => {
    try {
      const categories = await this.productBusiness.getAllCategories()

      res.status(201).send(categories);
    } catch (error) {
      logger.error(error)
      ErrorHandler.handleError(error, res);
    }
  }

  public createCategory = async (req: Request, res: Response) => {
    try {
      const input = CreateCategorySchema.parse({
        name: req.body.name,
        description: req.body.description,
      });

      const output = await this.productBusiness.createCategory(input);
      res.status(201).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  public updateCategory = async (req: Request, res: Response) => {
    try {
      const input = UpdateCategorySchema.parse({
        id: req.params.id,
        name: req.body.name,
        description: req.body.description,
      });

      const output = await this.productBusiness.updateCategory(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };
  
  // --------------------------------------------------------------------

  public getAllColors = async (req: Request, res: Response) => {
    try{
      const colors = await this.productBusiness.getAllColors()

      res.status(200).send(colors);
    } catch (error) {
      logger.error(error)
      ErrorHandler.handleError(error, res);
    }
  }

  public createColor = async (req: Request, res: Response) => {
    try {
      const input = CreateColorSchema.parse({
        name: req.body.name,
        hex_code: req.body.hex_code
      });

      const output = await this.productBusiness.createColor(input);
      res.status(201).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  public updateColor = async (req: Request, res: Response) => {
    try {
      const input = UpdateColorSchema.parse({
        id: req.params.id,
        name: req.body.name,
        hex_code: req.body.hex_code,
      });

      const output = await this.productBusiness.updateColor(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  // --------------------------------------------------------------------

  public getAllSizes = async (req: Request, res: Response) => {
    try {
      const sizes = await this.productBusiness.getAllSizes();

      res.status(200).send(sizes);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  public createSize = async (req: Request, res: Response) => {
    try {
      const input = CreateSizeSchema.parse({
        name: req.body.name,
      });

      const output = await this.productBusiness.createSize(input);
      res.status(201).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  public updateSize = async (req: Request, res: Response) => {
    try {
      const input = UpdateSizeSchema.parse({
        token: req.headers.authorization as string,
        id: req.params.id,
        name: req.body.name,
      });

      const output = await this.productBusiness.updateSize(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  // --------------------------------------------------------------------

  public getAllGenders = async (req: Request, res: Response) => {
    try {
      const genders = await this.productBusiness.getAllGenders();

      res.status(200).send(genders);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  public createGender = async (req: Request, res: Response) => {
    try {
      const input = CreateGenderSchema.parse({
        name: req.body.name,
      });

      const output = await this.productBusiness.createGender(input);
      res.status(201).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  public updateGender = async (req: Request, res: Response) => {
    try {
      const input = UpdateGenderSchema.parse({
        token: req.headers.authorization as string,
        id: req.params.id,
        name: req.body.name,
      });

      const output = await this.productBusiness.updateGender(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };
}
