import { ProductBusiness } from "../../../src/business/ProductBusiness";
import { ProductDatabase } from "../../../src/database/ProductDatabase";
import { IdGenerator } from "../../../src/services/idGenerator";
import TokenService from "../../../src/services/TokenService";
import { UserDatabase } from "../../../src/database/UserDatabase";
import ErrorHandler from "../../../src/errors/ErrorHandler";
import { HashManager } from "../../../src/services/HashManager";
import {
  UpdateProductInputDTO,
  UpdateProductOutputDTO,
} from "../../../src/dtos/products/updateProduct.dto";
import { NotFoundError } from "../../../src/errors/Errors";

const mockProductDatabase = {
  findPureProductById: jest.fn(),
  updateProduct: jest.fn(),
  getImagesByProductId: jest.fn(),
};

const mockIdGenerator = {
  generate: jest.fn(),
};

const mockTokenService = {
  generate: jest.fn(),
};

const mockHashManager = {
  generate: jest.fn(),
};

const mockUserDatabase = {
  generate: jest.fn(),
};

const mockErrorHandler = {
  generate: jest.fn(),
};

const productBusiness = new ProductBusiness(
  mockProductDatabase as unknown as ProductDatabase,
  mockIdGenerator as unknown as IdGenerator,
  mockTokenService as unknown as TokenService,
  mockHashManager as unknown as HashManager,
  mockUserDatabase as unknown as UserDatabase,
  mockErrorHandler as unknown as ErrorHandler
);

describe("ProductBusiness - editProduct", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should successfully edit a product", async () => {
    const input: UpdateProductInputDTO = {
      id: "product_id",
      name: "Updated Product Name",
      description: "Updated Description",
      price: 79.99,
      stock: 60,
      categoryId: 2,
      colorId: 3,
      sizeId: 4,
      genderId: 5,
    };

    const existingProductDB = {
      id: "product_id",
      name: "Old Product Name",
      description: "Old Description",
      price: 99.99,
      stock: 100,
      category_id: 1,
      color_id: 2,
      size_id: 3,
      gender_id: 4,
      created_at: "2024-01-01T00:00:00Z",
    };

    const updatedProductDB = {
      ...existingProductDB,
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      category_id: input.categoryId,
      color_id: input.colorId,
      size_id: input.sizeId,
      gender_id: input.genderId,
    };

    mockProductDatabase.findPureProductById
      .mockResolvedValueOnce(existingProductDB)
      .mockResolvedValueOnce(updatedProductDB);

    mockProductDatabase.updateProduct.mockResolvedValue({});
    mockProductDatabase.getImagesByProductId.mockResolvedValue([]);

    const result: UpdateProductOutputDTO = await productBusiness.editProduct(
      input
    );

    expect(result).toEqual({
      message: "Editing completed successfully",
      product: {
        id: "product_id",
        name: "Updated Product Name",
        description: "Updated Description",
        price: 79.99,
        stock: 60,
        createdAt: "2024-01-01T00:00:00Z",
        categoryId: 2,
        colorId: 3,
        sizeId: 4,
        genderId: 5,
        images: [],
      },
    });
  });

  test("should throw NotFoundError if product does not exist", async () => {
    const input: UpdateProductInputDTO = {
      id: "non_existent_product_id",
      name: "Updated Product Name",
      description: "Updated Description",
      price: 79.99,
      stock: 60,
      categoryId: 2,
      colorId: 3,
      sizeId: 4,
      genderId: 5,
    };

    mockProductDatabase.findPureProductById.mockResolvedValue(null);

    await expect(productBusiness.editProduct(input)).rejects.toThrow(
      NotFoundError
    );
  });

  test("should throw NotFoundError if unable to find updated product data", async () => {
    const input: UpdateProductInputDTO = {
      id: "product_id",
      name: "Updated Product Name",
      description: "Updated Description",
      price: 79.99,
      stock: 60,
      categoryId: 2,
      colorId: 3,
      sizeId: 4,
      genderId: 5,
    };

    const existingProductDB = {
      id: "product_id",
      name: "Old Product Name",
      description: "Old Description",
      price: 99.99,
      stock: 100,
      category_id: 1,
      color_id: 2,
      size_id: 3,
      gender_id: 4,
      created_at: "2024-01-01T00:00:00Z",
    };

    mockProductDatabase.findPureProductById.mockResolvedValue(
      existingProductDB
    );
    mockProductDatabase.updateProduct.mockResolvedValue({});
    mockProductDatabase.findPureProductById.mockResolvedValue(null);

    await expect(productBusiness.editProduct(input)).rejects.toThrow(
      NotFoundError
    );
  });
});
