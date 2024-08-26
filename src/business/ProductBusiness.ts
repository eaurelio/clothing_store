// Services
import { HashManager } from "./../services/HashManager";
import { IdGenerator } from "../services/idGenerator";
import TokenService from "../services/TokenService";

// Database
import { UserDatabase } from "./../database/UserDatabase";
import { ProductDatabase } from "../database/ProductDatabase";

// Models
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

// DTOs
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
  GetProductOutputDTO,
  GetAllProductsInputDTO,
  GetAllProductsOutputDTO,
} from "../dtos/products/getProduct.dto";

// Errors
import {
  BadRequestError,
  NotFoundError,
  ConflictError,
  ForbiddenError,
} from "../errors/Errors";
import { ErrorHandler } from "../errors/ErrorHandler";
import { ProductImageDB, ProductImageDBInput, ProductImageDBOutput, ProductImageOutput } from "../models/ProductImage";

export class ProductBusiness {
  constructor(
    private productDatabase: ProductDatabase,
    private idGenerator: IdGenerator,
    private tokenService: TokenService,
    private HashManager: HashManager,
    private userDatabase: UserDatabase,
    private errorHandler: ErrorHandler
  ) {}

  // --------------------------------------------------------------------
  // PRODUCTS
  // --------------------------------------------------------------------

  // public createProduct = async (
  //   input: CreateProductInputDTO
  // ): Promise<CreateProductOutputDTO> => {
  //   const {
  //     name,
  //     description,
  //     price,
  //     stock,
  //     category_id,
  //     color_id,
  //     size_id,
  //     gender_id,
  //   } = input;

  //   const existingProduct = await this.productDatabase.findProductByName(name);
  //   if (existingProduct) {
  //     throw new ConflictError("'name' already exists");
  //   }

  //   const id = this.idGenerator.generate();
  //   const created_at = new Date().toISOString();

  //   const newProduct = new Product(
  //     id,
  //     name,
  //     description,
  //     price,
  //     stock,
  //     created_at,
  //     category_id,
  //     color_id,
  //     size_id,
  //     gender_id
  //   );

  //   const newProductDB: ProductDB = {
  //     id: newProduct.getId(),
  //     name: newProduct.getName(),
  //     description: newProduct.getDescription(),
  //     price: newProduct.getPrice(),
  //     stock: newProduct.getStock(),
  //     created_at: newProduct.getCreatedAt(),
  //     category_id: newProduct.getCategory() as number,
  //     color_id: newProduct.getColor() as number,
  //     size_id: newProduct.getSize() as number,
  //     gender_id: newProduct.getGender() as number,
  //   };

  //   await this.productDatabase.insertProduct(newProductDB);

  //   const output: CreateProductOutputDTO = {
  //     message: "Product created successfully",
  //     product: {
  //       id: newProduct.getId(),
  //       name: newProduct.getName(),
  //       description: newProduct.getDescription(),
  //       price: newProduct.getPrice(),
  //       stock: newProduct.getStock(),
  //       createdAt: newProduct.getCreatedAt(),
  //       category_id: newProduct.getCategory() as number,
  //       color_id: newProduct.getColor() as number,
  //       size_id: newProduct.getSize() as number,
  //       gender_id: newProduct.getGender() as number,
  //     },
  //   };

  //   return output;
  // };

  public createProduct = async (
    input: CreateProductInputDTO
  ): Promise<CreateProductOutputDTO> => {
    const {
      name,
      description,
      price,
      stock,
      category_id,
      color_id,
      size_id,
      gender_id,
      images, // Adicionando o parâmetro de imagens
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
  
    // Inserção de imagens associadas ao produto
    if (images && images.length > 0) {
      for (const image of images) {
        const imageData: ProductImageDB = {
          id: this.idGenerator.generate(),
          product_id: newProduct.getId(),
          url: image.url,
          alt: image.alt
        };
  
        await this.productDatabase.insertProductImage(imageData);
      }
    }

    const productImages = await this.productDatabase.getImagesByProductId(newProduct.getId());
  
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
        images: productImages
      },
    };
  
    return output;
  };
  

  // --------------------------------------------------------------------

  public getProducts = async (
    input: GetAllProductsInputDTO
  ): Promise<GetAllProductsOutputDTO> => {
    const {
      id,
      name,
      category_id,
      color_id,
      size_id,
      gender_id,
      active = true,
    } = input;

    const products: ProductDBOutput[] = await this.productDatabase.findProducts(
      id,
      name,
      category_id,
      color_id,
      size_id,
      gender_id,
      active
    );


    const output: GetAllProductsOutputDTO = {
      products: await Promise.all(products.map(async (product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        active: product.active,
        price: product.price,
        stock: product.stock,
        created_at: product.created_at,
        category: product.category,
        color: product.color,
        size: product.size,
        gender: product.gender,
        images: await this.productDatabase.getImagesByProductId(product.id),
      }))),
    };
   

    return output;
  };

  // --------------------------------------------------------------------

  public editProduct = async (
    input: UpdateProductInputDTO
  ): Promise<UpdateProductOutputDTO> => {
    const { id } = input;

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
      category_id: input.category_id ?? productDB.category_id,
      color_id: input.color_id ?? productDB.color_id,
      size_id: input.size_id ?? productDB.size_id,
      gender_id: input.gender_id ?? productDB.gender_id,
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

    const productImages = await this.productDatabase.getImagesByProductId(id);

    const output: UpdateProductOutputDTO = {
      message: "Editing completed successfully",
      product: {
        id: updatedProductData.id,
        name: updatedProductData.name,
        description: updatedProductData.description,
        price: updatedProductData.price,
        stock: updatedProductData.stock,
        created_at: updatedProductData.created_at,
        category_id: updatedProductData.category_id,
        color_id: updatedProductData.color_id,
        size_id: updatedProductData.size_id,
        gender_id: updatedProductData.gender_id,
        images: productImages
      },
    };

    return output;
  };

  // --------------------------------------------------------------------

  public async insertProductImage(input: ProductImageDBInput): Promise<ProductImageOutput> {
    const { product_id, url, alt } = input;

    const existingImages = await this.productDatabase.getImagesByProductId(product_id);

    const isDuplicate = existingImages.some(image => image.url === url);
  
    if (isDuplicate) {
      throw new ConflictError("This URL is already associated with the specified product");
    }

    const imageId = this.idGenerator.generate();

    const imageData: ProductImageDB = {
      id: imageId,
      product_id,
      url,
      alt
    };

    await this.productDatabase.insertProductImage(imageData);

    const insertedImage = await this.productDatabase.getImagesByProductId(product_id);

    const output: ProductImageOutput = {
      message: "Image inserted successfully",
      images: insertedImage,
    };

    return output;
  }

  // --------------------------------------------------------------------

  public async deleteProductImage(input: ProductImageDelete): Promise<ProductImageOutput> {
    const { id, product_id } = input;
  
    const image = await this.productDatabase.getImageById(id);
  
    if (!image) {
      throw new NotFoundError("Image not found");
    }
  
    if (image.product_id !== product_id) {
      throw new ForbiddenError("Image does not belong to the specified product");
    }
  
    await this.productDatabase.deleteProductImage(id);
  
    const remainingImages = await this.productDatabase.getImagesByProductId(product_id);
  
    const output: ProductImageOutput = {
      message: "Image deleted successfully",
      images: remainingImages,
    };
  
    return output;
  }

  // --------------------------------------------------------------------

  public toggleProductActiveStatus = async (
    input: ToggleProductActiveStatusInputDTO
  ): Promise<ToggleProductActiveStatusOutputDTO> => {
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
  };

  // --------------------------------------------------------------------
  // AUX FIELDS - PRODUCTS
  // --------------------------------------------------------------------

  public getAllCategories = async (): Promise<CategoryDBOutput[]> => {
    const categories = await this.productDatabase.getAllCategories();

    return categories;
  };

  public createCategory = async (
    input: CreateCategoryInputDTO
  ): Promise<CreateCategoryOutputDTO> => {
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
  };

  // --------------------------------------------------------------------

  public updateCategory = async (
    input: UpdateCategoryInputDTO
  ): Promise<UpdateCategoryOutputDTO> => {
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
  };

  // --------------------------------------------------------------------

  public getAllColors = async (): Promise<ColorDBOutput[]> => {
    const colors = await this.productDatabase.getAllColors();
    return colors;
  };

  public createColor = async (
    input: CreateColorInputDTO
  ): Promise<CreateColorOutputDTO> => {
    const { name, hex_code } = input;

    const existingColor = await this.productDatabase.findColorByName(name);
    if (existingColor) {
      throw new ConflictError("'color' already exists");
    }

    const newColorDB: ColorDB = {
      name,
      hex_code,
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
  };

  // --------------------------------------------------------------------

  public updateColor = async (
    input: UpdateColorInputDTO
  ): Promise<UpdateColorOutputDTO> => {
    const { id, name, hex_code } = input;

    const colorDB = await this.productDatabase.findColorById(id);

    if (!colorDB) {
      throw new NotFoundError("Color not found");
    }

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
  };

  // --------------------------------------------------------------------

  public getAllSizes = async (): Promise<SizeDBOutput[]> => {
    const sizes = await this.productDatabase.getAllSizes();
    return sizes;
  };

  public createSize = async (
    input: CreateSizeInputDTO
  ): Promise<CreateSizeOutputDTO> => {
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
  };

  // --------------------------------------------------------------------

  public updateSize = async (
    input: UpdateSizeInputDTO
  ): Promise<UpdateSizeOutputDTO> => {
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
  };

  // --------------------------------------------------------------------

  public getAllGenders = async (): Promise<GenderDBOutPut[]> => {
    const genders = await this.productDatabase.getAllGenders();
    return genders;
  };

  public createGender = async (
    input: CreateGenderInputDTO
  ): Promise<CreateGenderOutputDTO> => {
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
  };

  // --------------------------------------------------------------------

  public updateGender = async (
    input: UpdateGenderInputDTO
  ): Promise<UpdateGenderOutputDTO> => {
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
  };
}
