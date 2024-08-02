import { GenderDB } from "./../models/Products";
import { UserDatabase } from "./../database/UserDatabase";
import { HashManager } from "./../services/HashManager";
import { ProductDatabase } from "../database/ProductDatabase";
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
  GetProductInputDTO,
  GetProductOutputDTO,
  GetAllProductsInputDTO,
  GetAllProductsOutputDTO,
} from "../dtos/products/getProduct.dto";
import {
  CategoryDB,
  ColorDB,
  Product,
  ProductDB,
  ProductDBOutput,
  SizeDB,
} from "../models/Products";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { IdGenerator } from "../services/idGenerator";
import TokenService from "../services/TokenService";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { USER_ROLES } from "../models/User";
import { ConflictError } from "../errors/ConflictError";
import { ErrorHandler } from "../errors/ErrorHandler";

export class ProductBusiness {
  constructor(
    private productDatabase: ProductDatabase,
    private idGenerator: IdGenerator,
    private tokenService: TokenService,
    private HashManager: HashManager,
    private userDatabase: UserDatabase,
    private errorHandler: ErrorHandler
  ) {}

  // ------------------------------------------------------------------------------------------------------------------
  // PRODUCTS
  // ------------------------------------------------------------------------------------------------------------------

  public createProduct = async (
    input: CreateProductInputDTO
  ): Promise<CreateProductOutputDTO> => {
    const {
      token,
      name,
      description,
      price,
      stock,
      category_id,
      color_id,
      size_id,
      gender_id,
    } = input;

    const userId = this.tokenService.getUserIdFromToken(token);
    const userDB = await this.userDatabase.findUserById(userId as string);

    if (!userDB) {
      throw new NotFoundError("User not found");
    }

    if (userDB.role !== USER_ROLES.ADMIN) {
      throw new UnauthorizedError("Unauthorized user");
    }

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
      category_id,
      color_id,
      size_id,
      gender_id
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

    const output: CreateProductOutputDTO = {
      message: "Product created successfully",
      product: {
        id: newProduct.getId(),
        name: newProduct.getName(),
        description: newProduct.getDescription(),
        price: newProduct.getPrice(),
        stock: newProduct.getStock(),
        createdAt: newProduct.getCreatedAt(),
        category_id: newProduct.getCategory() as number,
        color_id: newProduct.getColor() as number,
        size_id: newProduct.getSize() as number,
        gender_id: newProduct.getGender() as number,
      },
    };

    return output;
  };

  // ------------------------------------------------------------------------------------------------------------------

  public editProduct = async (
    input: UpdateProductInputDTO
  ): Promise<UpdateProductOutputDTO> => {
    const { id, token } = input;
    const userId = this.tokenService.getUserIdFromToken(token);
    const userDB = await this.userDatabase.findUserById(userId as string);

    if (!userDB) {
      throw new NotFoundError("User not found");
    }

    if (userDB.role !== USER_ROLES.ADMIN) {
      throw new UnauthorizedError("Unauthorized user");
    }

    const productDB = await this.productDatabase.findPureProductById(id);

    if (!productDB) {
      throw new NotFoundError("Product not found");
    }

    const updatedProduct: ProductDB = {
      ...productDB,
      name: input.name !== undefined ? input.name : productDB.name,
      description:
        input.description !== undefined
          ? input.description
          : productDB.description,
      price: input.price !== undefined ? input.price : productDB.price,
      stock: input.stock !== undefined ? input.stock : productDB.stock,
      category_id:
        input.category_id !== undefined
          ? input.category_id
          : productDB.category_id,
      color_id:
        input.color_id !== undefined ? input.color_id : productDB.color_id,
      size_id: input.size_id !== undefined ? input.size_id : productDB.size_id,
      gender_id:
        input.gender_id !== undefined ? input.gender_id : productDB.gender_id,
    };

    await this.productDatabase.updateProduct(id, updatedProduct);

    const updatedProductData = await this.productDatabase.findPureProductById(
      id
    );

    if (!updatedProductData) {
      throw new NotFoundError(
        "It was not possible to find the updated product data after editing."
      );
    }

    const output: UpdateProductOutputDTO = {
      message: "Editing completed successfully",
      product: {
        id: updatedProductData.id,
        name: updatedProductData.name,
        description: updatedProductData.description,
        price: updatedProductData.price,
        stock: updatedProductData.stock,
        createdAt: updatedProductData.createdAt,
        category_id: updatedProductData.category,
        color_id: updatedProductData.color,
        size_id: updatedProductData.size,
        gender_id: updatedProductData.gender,
      },
    };

    return output;
  };

  // ------------------------------------------------------------------------------------------------------------------

  public getProduct = async (
    input: GetProductInputDTO
  ): Promise<GetProductOutputDTO> => {
    const { id } = input;

    const product = await this.productDatabase.findProductById(id);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const output: GetProductOutputDTO = {
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        createdAt: product.createdAt,
        category: product.category,
        color: product.color,
        size: product.size,
        gender: product.gender,
      },
    };

    return output;
  };

  // ------------------------------------------------------------------------------------------------------------------

  public getAllProducts = async (
    input: GetAllProductsInputDTO
  ): Promise<GetAllProductsOutputDTO> => {
    const { name, category_id, color_id, size_id, gender_id } = input;

    const products: ProductDBOutput[] = await this.productDatabase.findProducts(
      name,
      category_id,
      color_id,
      size_id,
      gender_id
    );

    const output: GetAllProductsOutputDTO = {
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        createdAt: product.createdAt,
        category: product.category,
        color: product.color,
        size: product.size,
        gender: product.gender,
      })),
    };

    return output;
  };

  // ------------------------------------------------------------------------------------------------------------------
  // AUX FIELDS - PRODUCTS
  // ------------------------------------------------------------------------------------------------------------------

  public createCategory = async (
    input: CreateCategoryInputDTO
  ): Promise<CreateCategoryOutputDTO> => {
    const { token, name, description } = input;

    const userId = this.tokenService.getUserIdFromToken(token);
    const userDB = await this.userDatabase.findUserById(userId as string);

    if (!userDB) {
      throw new NotFoundError("User not found");
    }

    if (userDB.role !== USER_ROLES.ADMIN) {
      throw new UnauthorizedError("Unauthorized user");
    }

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

    console.log(newCategory);

    const output: CreateCategoryOutputDTO = {
      message: "Category created successfully",
      category: newCategory,
    };

    return output;
  };

  // ------------------------------------------------------------------------------------------------------------------

  public updateCategory = async (
    input: UpdateCategoryInputDTO
  ): Promise<UpdateCategoryOutputDTO> => {
    const { token, id, name, description } = input;

    const userId = this.tokenService.getUserIdFromToken(token);
    const userDB = await this.userDatabase.findUserById(userId as string);

    if (!userDB) {
      throw new NotFoundError("User not found");
    }

    if (userDB.role !== USER_ROLES.ADMIN) {
      throw new UnauthorizedError("Unauthorized user");
    }

    const categoryDB = await this.productDatabase.findCategoryById(id);

    if (!categoryDB) {
      throw new NotFoundError("category not found");
    }

    const updatedCategory = {
      ...categoryDB,
      name: name !== undefined ? name : categoryDB.name,
      description:
        description !== undefined ? description : categoryDB.description,
    };

    await this.productDatabase.updateCategory(id, updatedCategory);

    const output: UpdateCategoryOutputDTO = {
      message: "Color updated successfully",
      category: updatedCategory,
    };

    return output;
  };

  public createColor = async (
    input: CreateColorInputDTO
  ): Promise<CreateColorOutputDTO> => {
    const { token, name } = input;

    const userId = this.tokenService.getUserIdFromToken(token);
    const userDB = await this.userDatabase.findUserById(userId as string);

    if (!userDB) {
      throw new NotFoundError("User not found");
    }

    if (userDB.role !== USER_ROLES.ADMIN) {
      throw new UnauthorizedError("Unauthorized user");
    }

    const existingColor = await this.productDatabase.findColorByName(name);
    if (existingColor) {
      throw new ConflictError("'color' already exists");
    }

    const newColorDB: ColorDB = {
      name,
    };

    await this.productDatabase.insertColor(newColorDB);

    // Buscando o registro da nova cor criada
    const newColor = await this.productDatabase.findColorByName(name);

    if (!newColor) {
      throw new Error("Failed to create color");
    }

    const output: CreateColorOutputDTO = {
      message: "Color created successfully",
      color: newColor,
    };

    return output;
  };

  // ------------------------------------------------------------------------------------------------------------------

  public updateColor = async (
    input: UpdateColorInputDTO
  ): Promise<UpdateColorOutputDTO> => {
    const { token, id, name } = input;

    const userId = this.tokenService.getUserIdFromToken(token);
    const userDB = await this.userDatabase.findUserById(userId as string);

    if (!userDB) {
      throw new NotFoundError("User not found");
    }

    if (userDB.role !== USER_ROLES.ADMIN) {
      throw new UnauthorizedError("Unauthorized user");
    }

    const colorDB = await this.productDatabase.findColorById(id);

    if (!colorDB) {
      throw new NotFoundError("Color not found");
    }

    const updatedColor = {
      ...colorDB,
      name: name !== undefined ? name : colorDB.name,
    };

    await this.productDatabase.updateColor(id, updatedColor);

    const output: UpdateColorOutputDTO = {
      message: "Color updated successfully",
      color: updatedColor,
    };

    return output;
  };

  public createSize = async (
    input: CreateSizeInputDTO
  ): Promise<CreateSizeOutputDTO> => {
    const { token, name } = input;

    const userId = this.tokenService.getUserIdFromToken(token);
    const userDB = await this.userDatabase.findUserById(userId as string);

    if (!userDB) {
      throw new NotFoundError("User not found");
    }

    if (userDB.role !== USER_ROLES.ADMIN) {
      throw new UnauthorizedError("Unauthorized user");
    }

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
  };

  // ------------------------------------------------------------------------------------------------------------------

  public updateSize = async (
    input: UpdateSizeInputDTO
  ): Promise<UpdateSizeOutputDTO> => {
    const { token, id, name } = input;

    const userId = this.tokenService.getUserIdFromToken(token);
    const userDB = await this.userDatabase.findUserById(userId as string);

    if (!userDB) {
      throw new NotFoundError("User not found");
    }

    if (userDB.role !== USER_ROLES.ADMIN) {
      throw new UnauthorizedError("Unauthorized user");
    }

    const sizeDB = await this.productDatabase.findSizeById(id);

    if (!sizeDB) {
      throw new NotFoundError("Size not found");
    }

    const updatedSize = {
      ...sizeDB,
      name: name !== undefined ? name : sizeDB.name,
    };

    await this.productDatabase.updateSize(id, updatedSize);

    const output: UpdateSizeOutputDTO = {
      message: "Size updated successfully",
      size: updatedSize,
    };

    return output;
  };

  public createGender = async (
    input: CreateGenderInputDTO
  ): Promise<CreateGenderOutputDTO> => {
    const { token, name } = input;

    const userId = this.tokenService.getUserIdFromToken(token);
    const userDB = await this.userDatabase.findUserById(userId as string);

    if (!userDB) {
      throw new NotFoundError("User not found");
    }

    if (userDB.role !== USER_ROLES.ADMIN) {
      throw new UnauthorizedError("Unauthorized user");
    }

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
  };

  // ------------------------------------------------------------------------------------------------------------------

  public updateGender = async (
    input: UpdateGenderInputDTO
  ): Promise<UpdateGenderOutputDTO> => {
    const { token, id, name } = input;

    const userId = this.tokenService.getUserIdFromToken(token);
    const userDB = await this.userDatabase.findUserById(userId as string);

    if (!userDB) {
      throw new NotFoundError("User not found");
    }

    if (userDB.role !== USER_ROLES.ADMIN) {
      throw new UnauthorizedError("Unauthorized user");
    }

    const genderDB = await this.productDatabase.findGenderById(id);

    if (!genderDB) {
      throw new NotFoundError("Gender not found");
    }

    const updatedGender = {
      ...genderDB,
      name: name !== undefined ? name : genderDB.name,
    };

    await this.productDatabase.updateGender(id, updatedGender);

    const output: UpdateGenderOutputDTO = {
      message: "Gender updated successfully",
      gender: updatedGender,
    };

    return output;
  };
}
