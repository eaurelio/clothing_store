// import { ProductDatabase } from "../database/ProductDatabase";
// import { CreateProductInputDTO, CreateProductOutputDTO } from "../dtos/products/createProduct.dto";
// import { UpdateProductInputDTO, UpdateProductOutputDTO } from "../dtos/products/updateProduct.dto";
// import { GetProductInputDTO, GetProductOutputDTO, GetAllProductsInputDTO, GetAllProductsOutputDTO } from "../dtos/products/getProduct.dto";
// import { Product, ProductDB } from "../models/Products";
// import { BadRequestError } from "../errors/BadRequestError";
// import { NotFoundError } from "../errors/NotFoundError";
// import { IdGenerator } from "../services/idGenerator";

// export class ProductBusiness {
//   constructor(
//     private productDatabase: ProductDatabase,
//     private idGenerator: IdGenerator
//   ) {}

//   // Create Product
//   public createProduct = async (input: CreateProductInputDTO): Promise<CreateProductOutputDTO> => {
//     const { name, description, price, stock, category_id, color_id, size_id, gender_id } = input;

//     // Check if the product already exists
//     const existingProduct = await this.productDatabase.findProductByName(name);
//     if (existingProduct) {
//       throw new BadRequestError("'name' already exists");
//     }

//     const id = this.idGenerator.generate();
//     const createdAt = new Date().toISOString();

//     const newProduct = new Product(
//       id,
//       name,
//       description,
//       price,
//       stock,
//       createdAt,
//       category_id,
//       color_id,
//       size_id,
//       gender_id
//     );

//     const newProductDB: ProductDB = {
//       id: newProduct.getId(),
//       name: newProduct.getName(),
//       description: newProduct.getDescription(),
//       price: newProduct.getPrice(),
//       stock: newProduct.getStock(),
//       created_at: newProduct.getCreatedAt(),
//       category_id: newProduct.getCategoryId(),
//       color_id: newProduct.getColorId(),
//       size_id: newProduct.getSizeId(),
//       gender_id: newProduct.getGenderId()
//     };

//     await this.productDatabase.insertProduct(newProductDB);

//     const output: CreateProductOutputDTO = {
//       message: "Product created successfully",
//       product: {
//         id: newProduct.getId(),
//         name: newProduct.getName(),
//         description: newProduct.getDescription(),
//         price: newProduct.getPrice(),
//         stock: newProduct.getStock(),
//         createdAt: newProduct.getCreatedAt(),
//         category_id: newProduct.getCategoryId(),
//         color_id: newProduct.getColorId(),
//         size_id: newProduct.getSizeId(),
//         gender_id: newProduct.getGenderId()
//       }
//     };

//     return output;
//   };

//   // Update Product
//   public updateProduct = async (input: UpdateProductInputDTO): Promise<UpdateProductOutputDTO> => {
//     const { id, name, description, price, stock, category_id, color_id, size_id, gender_id } = input;

//     const existingProduct = await this.productDatabase.findProductById(id);
//     if (!existingProduct) {
//       throw new NotFoundError("Product not found");
//     }

//     const updatedProductDB: Partial<ProductDB> = {
//       name,
//       description,
//       price,
//       stock,
//       category_id,
//       color_id,
//       size_id,
//       gender_id
//     };

//     await this.productDatabase.updateProduct(id, updatedProductDB);

//     const updatedProduct = await this.productDatabase.findProductById(id);

//     const output: UpdateProductOutputDTO = {
//       message: "Product updated successfully",
//       product: updatedProduct as ProductDB
//     };

//     return output;
//   };

//   // Get Product by ID
//   public getProduct = async (input: GetProductInputDTO): Promise<GetProductOutputDTO> => {
//     const { id } = input;

//     const product = await this.productDatabase.findProductById(id);
//     if (!product) {
//       throw new NotFoundError("Product not found");
//     }

//     const output: GetProductOutputDTO = {
//       product: product as ProductDB
//     };

//     return output;
//   };

//   // Get All Products
//   public getAllProducts = async (input: GetAllProductsInputDTO): Promise<GetAllProductsOutputDTO[]> => {
//     const { q, category_id, color_id, size_id, gender_id } = input;

//     const products = await this.productDatabase.findProducts(q, category_id, color_id, size_id, gender_id);

//     const output: GetAllProductsOutputDTO[] = products.map(product => ({
//       product: product as ProductDB
//     }));

//     return output;
//   };
// }


// import { ProductDatabase } from "../database/ProductDatabase";
// import { CreateProductInputDTO, CreateProductOutputDTO } from "../dtos/products/createProduct.dto";
// import { UpdateProductInputDTO, UpdateProductOutputDTO } from "../dtos/products/updateProduct.dto";
// import { GetProductInputDTO, GetAllProductsInputDTO } from "../dtos/products/getProduct.dto";
// import { Product, ProductDB } from "../models/Products";
// import { BadRequestError } from "../errors/BadRequestError";
// import { NotFoundError } from "../errors/NotFoundError";
// import { IdGenerator } from "../services/idGenerator";

// export class ProductBusiness {
//   constructor(
//     private productDatabase: ProductDatabase,
//     private idGenerator: IdGenerator
//   ) {}

//   // Create Product
//   public createProduct = async (input: CreateProductInputDTO): Promise<CreateProductOutputDTO> => {
//     const { name, description, price, stock, category_id, color_id, size_id, gender_id } = input;

//     const id = this.idGenerator.generate();
//     const createdAt = new Date().toISOString();

//     const newProduct = new Product(
//       id,
//       name,
//       description,
//       price,
//       stock,
//       createdAt,
//       category_id,
//       color_id,
//       size_id,
//       gender_id
//     );

//     const newProductDB: ProductDB = {
//       id: newProduct.getId(),
//       name: newProduct.getName(),
//       description: newProduct.getDescription(),
//       price: newProduct.getPrice(),
//       stock: newProduct.getStock(),
//       created_at: newProduct.getCreatedAt(),
//       category_id: newProduct.getCategoryId(),
//       color_id: newProduct.getColorId(),
//       size_id: newProduct.getSizeId(),
//       gender_id: newProduct.getGenderId()
//     };

//     await this.productDatabase.insertProduct(newProductDB);

//     const output: CreateProductOutputDTO = {
//       message: "Product created successfully",
//       product: {
//         id: newProduct.getId(),
//         name: newProduct.getName(),
//         description: newProduct.getDescription(),
//         price: newProduct.getPrice(),
//         stock: newProduct.getStock(),
//         createdAt: newProduct.getCreatedAt(),
//         category_id: newProduct.getCategoryId(),
//         color_id: newProduct.getColorId(),
//         size_id: newProduct.getSizeId(),
//         gender_id: newProduct.getGenderId()
//       }
//     };

//     return output;
//   };

//   // Update Product
//   public updateProduct = async (input: UpdateProductInputDTO): Promise<UpdateProductOutputDTO> => {
//     const { id, name, description, price, stock, category_id, color_id, size_id, gender_id } = input;

//     const existingProduct = await this.productDatabase.findProductById(id);
//     if (!existingProduct) {
//       throw new NotFoundError("Product not found");
//     }

//     const updatedProductDB: Partial<ProductDB> = {
//       name,
//       description,
//       price,
//       stock,
//       category_id,
//       color_id,
//       size_id,
//       gender_id
//     };

//     await this.productDatabase.updateProduct(id, updatedProductDB);

//     const updatedProduct = await this.productDatabase.findProductById(id);

//     const output: UpdateProductOutputDTO = {
//       message: "Product updated successfully",
//       product: updatedProduct as ProductDB
//     };

//     return output;
//   };

//   // Get Product by ID
//   public getProduct = async (input: GetProductInputDTO): Promise<GetProductOutputDTO> => {
//     const { id, token } = input;

//     // Validar o token (implementar a validação conforme necessário)

//     const product = await this.productDatabase.findProductById(id);
//     if (!product) {
//       throw new NotFoundError("Product not found");
//     }

//     const output: GetProductOutputDTO = {
//       product: product as ProductDB
//     };

//     return output;
//   };

//   // Get All Products
//   public getAllProducts = async (input: GetAllProductsInputDTO): Promise<GetAllProductsOutputDTO[]> => {
//     const { q, category_id, color_id, size_id, gender_id, token } = input;

//     // Validar o token (implementar a validação conforme necessário)

//     const products = await this.productDatabase.findProducts(q, category_id, color_id, size_id, gender_id);

//     const output: GetAllProductsOutputDTO[] = products.map(product => ({
//       product: product as ProductDB
//     }));

//     return output;
//   };
// }

import { ProductDatabase } from "../database/ProductDatabase";
import { CreateProductInputDTO, CreateProductOutputDTO } from "../dtos/products/createProduct.dto";
import { UpdateProductInputDTO, UpdateProductOutputDTO } from "../dtos/products/updateProduct.dto";
import { GetProductInputDTO, GetProductOutputDTO, GetAllProductsInputDTO, GetAllProductsOutputDTO } from "../dtos/products/getProduct.dto";
import { Product, ProductDB } from "../models/Products";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { IdGenerator } from "../services/idGenerator";
import { TokenService } from "../services/tokenService";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export class ProductBusiness {
  constructor(
    private productDatabase: ProductDatabase,
    private idGenerator: IdGenerator,
    private tokenService: TokenService // Adicione a dependência do TokenService
  ) {}

  // Create Product
  public createProduct = async (input: CreateProductInputDTO): Promise<CreateProductOutputDTO> => {
    const { name, description, price, stock, category_id, color_id, size_id, gender_id } = input;

    // Check if the product already exists
    const existingProduct = await this.productDatabase.findProductByName(name);
    if (existingProduct) {
      throw new BadRequestError("'name' already exists");
    }

    const id = this.idGenerator.generate();
    const createdAt = new Date().toISOString();

    const newProduct = new Product(
      id,
      name,
      description,
      price,
      stock,
      createdAt,
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
      category_id: newProduct.getCategoryId(),
      color_id: newProduct.getColorId(),
      size_id: newProduct.getSizeId(),
      gender_id: newProduct.getGenderId()
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
        category_id: newProduct.getCategoryId(),
        color_id: newProduct.getColorId(),
        size_id: newProduct.getSizeId(),
        gender_id: newProduct.getGenderId()
      }
    };

    return output;
  };

  // Update Product
  public updateProduct = async (input: UpdateProductInputDTO, token: string): Promise<UpdateProductOutputDTO> => {
    const { id, name, description, price, stock, category_id, color_id, size_id, gender_id } = input;

    const productIdFromToken = this.tokenService.getProductIdFromToken(token);

    if (productIdFromToken !== id) {
      throw new UnauthorizedError("You do not have access to update this product");
    }

    const existingProduct = await this.productDatabase.findProductById(id);
    if (!existingProduct) {
      throw new NotFoundError("Product not found");
    }

    const updatedProductDB: Partial<ProductDB> = {
      name: name !== undefined ? name : existingProduct.name,
      description: description !== undefined ? description : existingProduct.description,
      price: price !== undefined ? price : existingProduct.price,
      stock: stock !== undefined ? stock : existingProduct.stock,
      category_id: category_id !== undefined ? category_id : existingProduct.category_id,
      color_id: color_id !== undefined ? color_id : existingProduct.color_id,
      size_id: size_id !== undefined ? size_id : existingProduct.size_id,
      gender_id: gender_id !== undefined ? gender_id : existingProduct.gender_id
    };

    await this.productDatabase.updateProduct(id, updatedProductDB);

    const updatedProduct = await this.productDatabase.findProductById(id);

    const output: UpdateProductOutputDTO = {
      message: "Product updated successfully",
      product: updatedProduct as ProductDB
    };

    return output;
  };

  // Get Product by ID
  public getProduct = async (input: GetProductInputDTO): Promise<GetProductOutputDTO> => {
    const { id } = input;

    const product = await this.productDatabase.findProductById(id);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const output: GetProductOutputDTO = {
      product: product as ProductDB
    };

    return output;
  };

  // Get All Products
  public getAllProducts = async (input: GetAllProductsInputDTO): Promise<GetAllProductsOutputDTO> => {
    const { q, category_id, color_id, size_id, gender_id } = input;

    const products = await this.productDatabase.findProducts(q, category_id, color_id, size_id, gender_id);

    const output: GetAllProductsOutputDTO = {
      products: products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        createdAt: product.created_at,
        category_id: product.category_id,
        color_id: product.color_id,
        size_id: product.size_id,
        gender_id: product.gender_id
      }))
    };

    return output;
  };
}
