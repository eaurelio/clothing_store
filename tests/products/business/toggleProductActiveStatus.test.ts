import { ProductBusiness } from "../../../src/business/ProductBusiness";
import { ProductDatabase } from "../../../src/database/ProductDatabase";
import { IdGenerator } from "../../../src/services/idGenerator";
import TokenService from "../../../src/services/TokenService";
import { UserDatabase } from "../../../src/database/UserDatabase";
import ErrorHandler from "../../../src/errors/ErrorHandler";
import { HashManager } from "../../../src/services/HashManager";
import {
  ToggleProductActiveStatusInputDTO,
  ToggleProductActiveStatusOutputDTO,
} from "../../../src/dtos/products/updateProduct.dto";
import { NotFoundError } from "../../../src/errors/Errors";

const mockProductDatabase = {
  findPureProductById: jest.fn(),
  updateProductActiveStatus: jest.fn(),
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

describe("ProductBusiness - toggleProductActiveStatus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should successfully activate a product", async () => {
    const input: ToggleProductActiveStatusInputDTO = {
      productId: "product_id",
    };

    const product = {
      id: "product_id",
      active: false,
    };

    mockProductDatabase.findPureProductById.mockResolvedValue(product);
    mockProductDatabase.updateProductActiveStatus.mockResolvedValue({});

    const result: ToggleProductActiveStatusOutputDTO =
      await productBusiness.toggleProductActiveStatus(input);

    expect(result).toEqual({
      message: "Product activated successfully",
    });
    expect(mockProductDatabase.updateProductActiveStatus).toHaveBeenCalledWith(
      "product_id",
      true
    );
  });

  test("should successfully deactivate a product", async () => {
    const input: ToggleProductActiveStatusInputDTO = {
      productId: "product_id",
    };

    const product = {
      id: "product_id",
      active: true,
    };

    mockProductDatabase.findPureProductById.mockResolvedValue(product);
    mockProductDatabase.updateProductActiveStatus.mockResolvedValue({});

    const result: ToggleProductActiveStatusOutputDTO =
      await productBusiness.toggleProductActiveStatus(input);

    expect(result).toEqual({
      message: "Product deactivated successfully",
    });
    expect(mockProductDatabase.updateProductActiveStatus).toHaveBeenCalledWith(
      "product_id",
      false
    );
  });

  test("should throw NotFoundError if product does not exist", async () => {
    const input: ToggleProductActiveStatusInputDTO = {
      productId: "non_existent_product_id",
    };

    mockProductDatabase.findPureProductById.mockResolvedValue(null);

    await expect(
      productBusiness.toggleProductActiveStatus(input)
    ).rejects.toThrow(NotFoundError);
  });
});
