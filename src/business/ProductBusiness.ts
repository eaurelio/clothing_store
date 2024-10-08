import { HashManager } from "./../services/HashManager";
import { IdGenerator } from "../services/idGenerator";
import TokenService from "../services/TokenService";

import { UserDatabase } from "./../database/UserDatabase";
import { ProductDatabase } from "../database/ProductDatabase";

import {
  CategoryDB,
  ColorDB,
  Product,
  ProductDB,
  ProductDBOutput,
  SizeDB,
} from "../models/Products";
import {
  CategoryDBOutput,
  ColorDBOutput,
  GenderDB,
  GenderDBOutPut,
  SizeDBOutput,
} from "./../models/Products";

import {
  CreateCategoryInputDTO,
  CreateCategoryOutputDTO,
  CreateColorInputDTO,
  CreateColorOutputDTO,
  CreateGenderInputDTO,
  CreateGenderOutputDTO,
  CreateProductInputDTO,
  CreateProductOutputDTO,
  CreateSizeInputDTO,
  CreateSizeOutputDTO,
} from "../dtos/products/createProduct.dto";
import {
  ProductImageDelete,
  ProductImageInsert,
  ToggleProductActiveStatusInputDTO,
  ToggleProductActiveStatusOutputDTO,
  UpdateCategoryInputDTO,
  UpdateCategoryOutputDTO,
  UpdateColorInputDTO,
  UpdateColorOutputDTO,
  UpdateGenderInputDTO,
  UpdateGenderOutputDTO,
  UpdateProductInputDTO,
  UpdateProductOutputDTO,
  UpdateSizeInputDTO,
  UpdateSizeOutputDTO,
} from "../dtos/products/updateProduct.dto";
import {
  GetAllProductsInputDTO,
  GetAllProductsOutputDTO,
} from "../dtos/products/getProduct.dto";

import {
  BadRequestError,
  NotFoundError,
  ConflictError,
  ForbiddenError,
} from "../errors/Errors";
import ErrorHandler from "../errors/ErrorHandler";
import { ProductImageDB, ProductImageOutput } from "../models/ProductImage";

export class ProductBusiness {
  constructor(
    private productDatabase: ProductDatabase,
    private idGenerator: IdGenerator,
    private tokenService: TokenService,
    private HashManager: HashManager,
    private userDatabase: UserDatabase,
    private errorHandler: ErrorHandler
  ) {}

  public async createProduct(
    input: CreateProductInputDTO
  ): Promise<CreateProductOutputDTO> {
    const {
      name,
      description,
      price,
      stock,
      categoryId,
      colorId,
      sizeId,
      genderId,
      images,
    } = input;

    const existingProduct = await this.productDatabase.findProductByName(name);
    if (existingProduct) {
      throw new ConflictError("'name' already exists");
    }

    const id = this.idGenerator.generate();
    const created_at = new Date().toISOString();

    const newProduct = new Product(
      id,
      name,
      description,
      price,
      stock,
      created_at,
      categoryId,
      colorId,
      sizeId,
      genderId
    );

    const newProductDB: ProductDB = {
      id: newProduct.getId(),
      name: newProduct.getName(),
      description: newProduct.getDescription(),
      price: newProduct.getPrice(),
      stock: newProduct.getStock(),
      created_at: newProduct.getCreatedAt(),
      category_id: newProduct.getCategory() as number,
      color_id: newProduct.getColor() as number,
      size_id: newProduct.getSize() as number,
      gender_id: newProduct.getGender() as number,
    };

    await this.productDatabase.insertProduct(newProductDB);

    if (images && images.length > 0) {
      for (const image of images) {
        const imageData: ProductImageDB = {
          id: this.idGenerator.generate(),
          product_id: newProduct.getId(),
          url: image.url,
          alt: image.alt,
        };

        await this.productDatabase.insertProductImage(imageData);
      }
    }

    const productImages = await this.productDatabase.getImagesByProductId(
      newProduct.getId()
    );

    const output: CreateProductOutputDTO = {
      message: "Product created successfully",
      product: {
        id: newProduct.getId(),
        name: newProduct.getName(),
        description: newProduct.getDescription(),
        price: newProduct.getPrice(),
        stock: newProduct.getStock(),
        createdAt: newProduct.getCreatedAt(),
        categoryId: newProduct.getCategory() as number,
        colorId: newProduct.getColor() as number,
        sizeId: newProduct.getSize() as number,
        genderId: newProduct.getGender() as number,
        images: productImages,
      },
    };

    return output;
  }

  public async getProducts(
    input: GetAllProductsInputDTO
  ): Promise<GetAllProductsOutputDTO> {
    const {
      id,
      name,
      categoryId,
      colorId,
      sizeId,
      genderId,
      active = true,
    } = input;

    const products: ProductDBOutput[] = await this.productDatabase.findProducts(
      id,
      name,
      categoryId,
      colorId,
      sizeId,
      genderId,
      active
    );

    const output: GetAllProductsOutputDTO = {
      products: await Promise.all(
        products.map(async (product) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          active: product.active,
          price: product.price,
          stock: product.stock,
          created_at: product.created_at,
          category_id: product.category_id,
          category: product.category,
          color_id: product.color_id,
          color: product.color,
          size_id: product.size_id,
          size: product.size,
          gender_id: product.gender_id,
          gender: product.gender,
          images: await this.productDatabase.getImagesByProductId(product.id),
        }))
      ),
    };

    return output;
  }

  public async editProduct(
    input: UpdateProductInputDTO
  ): Promise<UpdateProductOutputDTO> {
    const { id, categoryId } = input;

    const productDB = await this.productDatabase.findPureProductById(id);

    if (!productDB) {
      throw new NotFoundError("Product not found");
    }

    const updatedProduct: ProductDB = {
      ...productDB,
      name: input.name ?? productDB.name,
      description: input.description ?? productDB.description,
      price: input.price ?? productDB.price,
      stock: input.stock ?? productDB.stock,
      category_id: input.categoryId ?? productDB.category_id,
      color_id: input.colorId ?? productDB.color_id,
      size_id: input.sizeId ?? productDB.size_id,
      gender_id: input.genderId ?? productDB.gender_id,
    };

    console.log(categoryId);

    await this.productDatabase.updateProduct(id, updatedProduct);

    const updatedProductData = await this.productDatabase.findPureProductById(
      id
    );

    if (!updatedProductData) {
      throw new NotFoundError(
        "It was not possible to find the updated product data after editing."
      );
    }

    const productImages = await this.productDatabase.getImagesByProductId(id);

    const output: UpdateProductOutputDTO = {
      message: "Editing completed successfully",
      product: {
        id: updatedProductData.id,
        name: updatedProductData.name,
        description: updatedProductData.description,
        price: updatedProductData.price,
        stock: updatedProductData.stock,
        createdAt: updatedProductData.created_at,
        categoryId: updatedProductData.category_id,
        colorId: updatedProductData.color_id,
        sizeId: updatedProductData.size_id,
        genderId: updatedProductData.gender_id,
        images: productImages,
      },
    };

    return output;
  }

  public async insertProductImage(
    input: ProductImageInsert
  ): Promise<ProductImageOutput> {
    const { productId, url, alt } = input;

    const existingImage = await this.productDatabase.getImageByUrl(url);

    if (existingImage) {
      throw new ConflictError(
        "This URL is already associated with the specified product"
      );
    }

    const imageId = this.idGenerator.generate();

    const imageData: ProductImageDB = {
      id: imageId,
      product_id: productId,
      url,
      alt,
    };

    await this.productDatabase.insertProductImage(imageData);

    const insertedImage = await this.productDatabase.getImagesByProductId(
      productId
    );

    const output: ProductImageOutput = {
      message: "Image inserted successfully",
      images: insertedImage,
    };

    return output;
  }

  public async deleteProductImage(
    input: ProductImageDelete
  ): Promise<ProductImageOutput> {
    const { id, productId } = input;

    const image = await this.productDatabase.getImageById(id);

    if (!image) {
      throw new NotFoundError("Image not found");
    }

    if (image.product_id !== productId) {
      throw new ForbiddenError(
        "Image does not belong to the specified product"
      );
    }

    await this.productDatabase.deleteProductImage(id);

    const remainingImages = await this.productDatabase.getImagesByProductId(
      productId
    );

    const output: ProductImageOutput = {
      message: "Image deleted successfully",
      images: remainingImages,
    };

    return output;
  }

  public async toggleProductActiveStatus(
    input: ToggleProductActiveStatusInputDTO
  ): Promise<ToggleProductActiveStatusOutputDTO> {
    const { productId } = input;

    const product = await this.productDatabase.findPureProductById(productId);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const activate = !product.active;

    await this.productDatabase.updateProductActiveStatus(productId, activate);

    return {
      message: `Product ${activate ? "activated" : "deactivated"} successfully`,
    };
  }

  public async getAllCategories(): Promise<CategoryDBOutput[]> {
    const categories = await this.productDatabase.getAllCategories();

    return categories;
  }

  public async createCategory(
    input: CreateCategoryInputDTO
  ): Promise<CreateCategoryOutputDTO> {
    const { name, description } = input;

    const existingCategory = await this.productDatabase.findCategoryByName(
      name
    );
    if (existingCategory) {
      throw new BadRequestError("'category' already exists");
    }

    const newCategoryDB: CategoryDB = {
      name,
      description,
    };

    await this.productDatabase.insertCategory(newCategoryDB);

    const newCategory = await this.productDatabase.findCategoryByName(
      newCategoryDB.name
    );

    if (!newCategory) {
      throw new Error("Failed to create category");
    }

    const output: CreateCategoryOutputDTO = {
      message: "Category created successfully",
      category: newCategory,
    };

    return output;
  }

  public async updateCategory(
    input: UpdateCategoryInputDTO
  ): Promise<UpdateCategoryOutputDTO> {
    const { id, name, description } = input;

    const categoryDB = await this.productDatabase.findCategoryById(id);

    if (!categoryDB) {
      throw new NotFoundError("category not found");
    }

    const updatedCategory = {
      ...categoryDB,
      name: name ?? categoryDB.name,
      description: description ?? categoryDB.description,
    };

    await this.productDatabase.updateCategory(id, updatedCategory);

    const output: UpdateCategoryOutputDTO = {
      message: "Color updated successfully",
      category: updatedCategory,
    };

    return output;
  }

  public async getAllColors(): Promise<ColorDBOutput[]> {
    const colors = await this.productDatabase.getAllColors();
    return colors;
  }

  public async createColor(
    input: CreateColorInputDTO
  ): Promise<CreateColorOutputDTO> {
    const { name, hexCode } = input;

    const existingColor = await this.productDatabase.findColorByName(name);
    if (existingColor) {
      throw new ConflictError("'color' already exists");
    }

    const newColorDB: ColorDB = {
      name,
      hex_code: hexCode,
    };

    await this.productDatabase.insertColor(newColorDB);

    const newColor = await this.productDatabase.findColorByName(name);

    if (!newColor) {
      throw new Error("Failed to create color");
    }

    const output: CreateColorOutputDTO = {
      message: "Color created successfully",
      color: newColor,
    };

    return output;
  }

  public async updateColor(
    input: UpdateColorInputDTO
  ): Promise<UpdateColorOutputDTO> {
    const { id, name, hex_code } = input;

    const colorDB = await this.productDatabase.findColorById(id);

    if (!colorDB) {
      throw new NotFoundError("Color not found");
    }

    console.log(colorDB);

    const updatedColor = {
      ...colorDB,
      name: name ?? colorDB.name,
      hex_code: hex_code ?? colorDB.hex_code,
    };

    await this.productDatabase.updateColor(id, updatedColor);

    const output: UpdateColorOutputDTO = {
      message: "Color updated successfully",
      color: updatedColor,
    };

    return output;
  }

  public async getAllSizes(): Promise<SizeDBOutput[]> {
    const sizes = await this.productDatabase.getAllSizes();
    return sizes;
  }

  public async createSize(
    input: CreateSizeInputDTO
  ): Promise<CreateSizeOutputDTO> {
    const { name } = input;

    const existingSize = await this.productDatabase.findSizeByName(name);
    if (existingSize) {
      throw new ConflictError("'size' already exists");
    }

    const newSizeDB: SizeDB = {
      name,
    };

    await this.productDatabase.insertSize(newSizeDB);

    const newSize = await this.productDatabase.findSizeByName(name);

    if (!newSize) {
      throw new Error("Failed to create size");
    }

    const output: CreateSizeOutputDTO = {
      message: "Size created successfully",
      size: newSize,
    };

    return output;
  }

  public async updateSize(
    input: UpdateSizeInputDTO
  ): Promise<UpdateSizeOutputDTO> {
    const { id, name } = input;

    const sizeDB = await this.productDatabase.findSizeById(id);

    if (!sizeDB) {
      throw new NotFoundError("Size not found");
    }

    const updatedSize = {
      ...sizeDB,
      name: name ?? sizeDB.name,
    };

    await this.productDatabase.updateSize(id, updatedSize);

    const output: UpdateSizeOutputDTO = {
      message: "Size updated successfully",
      size: updatedSize,
    };

    return output;
  }

  public async getAllGenders(): Promise<GenderDBOutPut[]> {
    const genders = await this.productDatabase.getAllGenders();
    return genders;
  }

  public async createGender(
    input: CreateGenderInputDTO
  ): Promise<CreateGenderOutputDTO> {
    const { name } = input;

    const existingGender = await this.productDatabase.findGenderByName(name);
    if (existingGender) {
      throw new ConflictError("'name' already exists");
    }

    const newGenderDB: GenderDB = {
      name,
    };

    await this.productDatabase.insertGender(newGenderDB);

    const newGender = await this.productDatabase.findGenderByName(name);

    if (!newGender) {
      throw new Error("Failed to create gender");
    }

    const output: CreateGenderOutputDTO = {
      message: "Gender created successfully",
      gender: newGender,
    };

    return output;
  }

  public async updateGender(
    input: UpdateGenderInputDTO
  ): Promise<UpdateGenderOutputDTO> {
    const { id, name } = input;

    const genderDB = await this.productDatabase.findGenderById(id);

    if (!genderDB) {
      throw new NotFoundError("Gender not found");
    }

    const updatedGender = {
      ...genderDB,
      name: name ?? genderDB.name,
    };

    await this.productDatabase.updateGender(id, updatedGender);

    const output: UpdateGenderOutputDTO = {
      message: "Gender updated successfully",
      gender: updatedGender,
    };

    return output;
  }
}
