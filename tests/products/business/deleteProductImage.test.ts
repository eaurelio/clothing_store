import { ProductBusiness } from '../../../src/business/ProductBusiness';
import { ProductDatabase } from '../../../src/database/ProductDatabase';
import { IdGenerator } from '../../../src/services/idGenerator';
import TokenService from '../../../src/services/TokenService';
import { UserDatabase } from '../../../src/database/UserDatabase';
import { ErrorHandler } from '../../../src/errors/ErrorHandler';
import { HashManager } from '../../../src/services/HashManager';
import { ProductImageOutput } from '../../../src/models/ProductImage';
import { ProductImageDelete } from '../../../src/dtos/products/updateProduct.dto'
import { NotFoundError, ForbiddenError } from '../../../src/errors/Errors';

// Mocks
const mockProductDatabase = {
  getImageById: jest.fn(),
  deleteProductImage: jest.fn(),
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

describe('ProductBusiness - deleteProductImage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should successfully delete a product image', async () => {
    const input: ProductImageDelete = {
      id: 'image_id',
      product_id: 'product_id',
    };

    const existingImage = {
      id: 'image_id',
      product_id: 'product_id',
      url: 'http://example.com/old_image.jpg',
      alt: 'Old Image',
    };

    const remainingImages = [
      { id: 'another_image_id', product_id: 'product_id', url: 'http://example.com/another_image.jpg', alt: 'Another Image' },
    ];

    mockProductDatabase.getImageById.mockResolvedValue(existingImage);
    mockProductDatabase.deleteProductImage.mockResolvedValue({});
    mockProductDatabase.getImagesByProductId.mockResolvedValue(remainingImages);

    const result: ProductImageOutput = await productBusiness.deleteProductImage(input);

    expect(result).toEqual({
      message: 'Image deleted successfully',
      images: remainingImages,
    });
  });

  test('should throw NotFoundError if image does not exist', async () => {
    const input: ProductImageDelete = {
      id: 'non_existent_image_id',
      product_id: 'product_id',
    };

    mockProductDatabase.getImageById.mockResolvedValue(null);

    await expect(productBusiness.deleteProductImage(input)).rejects.toThrow(NotFoundError);
  });

  test('should throw ForbiddenError if image does not belong to the specified product', async () => {
    const input: ProductImageDelete = {
      id: 'image_id',
      product_id: 'wrong_product_id',
    };

    const existingImage = {
      id: 'image_id',
      product_id: 'product_id',
      url: 'http://example.com/old_image.jpg',
      alt: 'Old Image',
    };

    mockProductDatabase.getImageById.mockResolvedValue(existingImage);

    await expect(productBusiness.deleteProductImage(input)).rejects.toThrow(ForbiddenError);
  });
});
