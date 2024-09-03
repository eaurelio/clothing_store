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
  DeleteProductImageSchema,
  InsertProductImageSchema,
  ToggleProductActiveStatusSchema,
  UpdateCategorySchema,
  UpdateColorSchema,
  UpdateGenderSchema,
  UpdateProductSchema,
  UpdateSizeSchema,
} from "../dtos/products/updateProduct.dto";
import { GetAllProductsSchema } from "../dtos/products/getProduct.dto";

import ErrorHandler from "../errors/ErrorHandler";

import logger from "../logs/logger";

export class ProductController {
  constructor(private productBusiness: ProductBusiness) {
    this.createProduct = this.createProduct.bind(this);
    this.editProduct = this.editProduct.bind(this);
    this.insertProductImage = this.insertProductImage.bind(this);
    this.deleteProductImage = this.deleteProductImage.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.toggleProductActiveStatus = this.toggleProductActiveStatus.bind(this);
    this.getAllCategories = this.getAllCategories.bind(this);
    this.createCategory = this.createCategory.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
    this.getAllColors = this.getAllColors.bind(this);
    this.createColor = this.createColor.bind(this);
    this.updateColor = this.updateColor.bind(this);
    this.getAllSizes = this.getAllSizes.bind(this);
    this.createSize = this.createSize.bind(this);
    this.updateSize = this.updateSize.bind(this);
    this.getAllGenders = this.getAllGenders.bind(this);
    this.createGender = this.createGender.bind(this);
    this.updateGender = this.updateGender.bind(this);
  }

  public async createProduct(req: Request, res: Response) {
    try {
      const input = CreateProductSchema.parse({
        token: req.headers.authorization as string,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock,
        categoryId: req.body.categoryId,
        colorId: req.body.colorId,
        sizeId: req.body.sizeId,
        genderId: req.body.genderId,
        images: req.body.images,
      });

      const output = await this.productBusiness.createProduct(input);
      res.status(201).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }

  public async editProduct(req: Request, res: Response) {
    try {
      const input = UpdateProductSchema.parse({
        id: req.params.id,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock,
        categoryId: req.body.categoryId,
        colorId: req.body.colorId,
        sizeId: req.body.sizeId,
        genderId: req.body.genderId,
      });

      const output = await this.productBusiness.editProduct(input);

      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }

  public async insertProductImage(req: Request, res: Response) {
    try {
      const input = InsertProductImageSchema.parse({
        productId: req.body.productId,
        url: req.body.url,
        alt: req.body.alt,
      });

      const output = await this.productBusiness.insertProductImage(input);

      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }

  public async deleteProductImage(req: Request, res: Response) {
    try {
      const input = DeleteProductImageSchema.parse({
        id: req.body.id,
        productId: req.body.productId,
      });

      const output = await this.productBusiness.deleteProductImage(input);

      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }

  public async getProducts(req: Request, res: Response) {
    try {
      const input = GetAllProductsSchema.parse({
        id: req.body.id,
        name: req.body.name,
        categoryId: req.body.categoryId,
        colorId: req.body.colorId,
        sizeId: req.body.sizeId,
        genderId: req.body.genderId,
        active: req.body.active,
      });

      const output = await this.productBusiness.getProducts(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }

  public async toggleProductActiveStatus(req: Request, res: Response) {
    try {
      const input = ToggleProductActiveStatusSchema.parse({
        productId: req.params.id,
      });

      const output = await this.productBusiness.toggleProductActiveStatus(
        input
      );
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }

  public async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await this.productBusiness.getAllCategories();

      res.status(201).send(categories);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }

  public async createCategory(req: Request, res: Response) {
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
  }

  public async updateCategory(req: Request, res: Response) {
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
  }

  public async getAllColors(req: Request, res: Response) {
    try {
      const colors = await this.productBusiness.getAllColors();

      res.status(200).send(colors);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }

  public async createColor(req: Request, res: Response) {
    try {
      const input = CreateColorSchema.parse({
        name: req.body.name,
        hexCode: req.body.hexCode,
      });

      const output = await this.productBusiness.createColor(input);
      res.status(201).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }

  public async updateColor(req: Request, res: Response) {
    try {
      const input = UpdateColorSchema.parse({
        id: req.params.id,
        name: req.body.name,
        hexCode: req.body.hexCode,
      });

      const output = await this.productBusiness.updateColor(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }

  public async getAllSizes(req: Request, res: Response) {
    try {
      const sizes = await this.productBusiness.getAllSizes();

      res.status(200).send(sizes);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }

  public async createSize(req: Request, res: Response) {
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
  }

  public async updateSize(req: Request, res: Response) {
    try {
      const input = UpdateSizeSchema.parse({
        id: req.params.id,
        name: req.body.name,
      });

      const output = await this.productBusiness.updateSize(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }

  public async getAllGenders(req: Request, res: Response) {
    try {
      const genders = await this.productBusiness.getAllGenders();

      res.status(200).send(genders);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }

  public async createGender(req: Request, res: Response) {
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
  }

  public async updateGender(req: Request, res: Response) {
    try {
      const input = UpdateGenderSchema.parse({
        id: req.params.id,
        name: req.body.name,
      });

      const output = await this.productBusiness.updateGender(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }
}
