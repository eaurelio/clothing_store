import { ProductBusiness } from '../../../src/business/ProductBusiness';
import { ProductDatabase } from '../../../src/database/ProductDatabase';
import { IdGenerator } from '../../../src/services/idGenerator';
import TokenService from '../../../src/services/TokenService';
import { UserDatabase } from '../../../src/database/UserDatabase';
import ErrorHandler from '../../../src/errors/ErrorHandler';
import { HashManager } from '../../../src/services/HashManager';
import { ProductImageOutput } from '../../../src/models/ProductImage';
import { ConflictError } from '../../../src/errors/Errors';
import { ProductImageInsert } from '../../../src/dtos/products/updateProduct.dto';

// Mocks
const mockProductDatabase = {
  getImageByUrl: jest.fn(),
  getImagesByProductId: jest.fn(),
  insertProductImage: jest.fn(),
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

describe('ProductBusiness - insertProductImage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should successfully insert a product image', async () => {
    const input: ProductImageInsert = {
      productId: 'product_id',
      url: 'http://example.com/new_image.jpg',
      alt: 'New Image',
    };

    const existingImages = [
      { id: 'existing_image_id', product_id: 'product_id', url: 'http://example.com/old_image.jpg', alt: 'Old Image' },
    ];

    const newImage = {
      id: 'new_image_id',
      product_id: 'product_id',
      url: 'http://example.com/new_image.jpg',
      alt: 'New Image',
    };

    mockProductDatabase.getImageByUrl.mockResolvedValue(null);
    mockIdGenerator.generate.mockReturnValue('new_image_id');
    mockProductDatabase.insertProductImage.mockResolvedValue({});
    mockProductDatabase.getImagesByProductId.mockResolvedValue([...existingImages, newImage]);

    const result: ProductImageOutput = await productBusiness.insertProductImage(input);

    expect(result).toEqual({
      message: 'Image inserted successfully',
      images: [...existingImages, newImage],
    });
  });

  test('should throw ConflictError if image URL already exists', async () => {
    const input: ProductImageInsert = {
      productId: 'product_id',
      url: 'http://example.com/old_image.jpg',
      alt: 'Duplicate Image',
    };

    const existingImage = {
      id: 'existing_image_id',
      product_id: 'product_id',
      url: 'http://example.com/old_image.jpg',
      alt: 'Old Image',
    };

    mockProductDatabase.getImageByUrl.mockResolvedValue(existingImage);

    await expect(productBusiness.insertProductImage(input)).rejects.toThrow(ConflictError);
  });
});
