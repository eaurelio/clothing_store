import { ProductBusiness } from '../../../src/business/ProductBusiness';
import { ProductDatabase } from '../../../src/database/ProductDatabase';
import { IdGenerator } from '../../../src/services/idGenerator';
import { ConflictError } from '../../../src/errors/Errors';
import TokenService from '../../../src/services/TokenService';
import { UserDatabase } from '../../../src/database/UserDatabase';
import { ErrorHandler } from '../../../src/errors/ErrorHandler';
import { HashManager } from '../../../src/services/HashManager';
import { ProductImageDB } from '../../../src/models/ProductImage';

const mockProductDatabase = {
  findProductByName: jest.fn(),
  insertProduct: jest.fn(),
  insertProductImage: jest.fn(),
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

describe('ProductBusiness - createProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should successfully create a product with images', async () => {
    const input = {
      token: 'example-token', // Adicione o token aqui
      name: 'New Product',
      description: 'Product Description',
      price: 99.99,
      stock: 100,
      category_id: 1,
      color_id: 2,
      size_id: 3,
      gender_id: 4,
      images: [
        { id: 'image_id_1', product_id: 'new_product_id', url: 'http://example.com/image1.jpg', alt: 'Image 1' },
        { id: 'image_id_2', product_id: 'new_product_id', url: 'http://example.com/image2.jpg', alt: 'Image 2' },
      ] as ProductImageDB[], // Certifique-se de que está usando o tipo correto
    };

    mockProductDatabase.findProductByName.mockResolvedValue(null);
    mockIdGenerator.generate.mockReturnValueOnce('new_product_id').mockReturnValueOnce('image_id_1').mockReturnValueOnce('image_id_2');
    mockProductDatabase.insertProduct.mockResolvedValue({});
    mockProductDatabase.insertProductImage.mockResolvedValue({});
    mockProductDatabase.getImagesByProductId.mockResolvedValue(input.images);

    const result = await productBusiness.createProduct(input);

    expect(result).toEqual({
      message: 'Product created successfully',
      product: {
        id: 'new_product_id',
        name: 'New Product',
        description: 'Product Description',
        price: 99.99,
        stock: 100,
        createdAt: expect.any(String),
        category_id: 1,
        color_id: 2,
        size_id: 3,
        gender_id: 4,
        images: input.images,
      },
    });
  });

  test('should throw ConflictError if product name already exists', async () => {
    const input = {
      token: 'example-token', // Adicione o token aqui
      name: 'Existing Product',
      description: 'Product Description',
      price: 99.99,
      stock: 100,
      category_id: 1,
      color_id: 2,
      size_id: 3,
      gender_id: 4,
      images: [] as ProductImageDB[], // Certifique-se de que está usando o tipo correto
    };

    mockProductDatabase.findProductByName.mockResolvedValue({ id: 'existing_product_id' });

    await expect(productBusiness.createProduct(input)).rejects.toThrow(ConflictError);
  });

  test('should create a product without images', async () => {
    const input = {
      token: 'example-token', // Adicione o token aqui
      name: 'Product Without Images',
      description: 'Product Description',
      price: 49.99,
      stock: 50,
      category_id: 1,
      color_id: 2,
      size_id: 3,
      gender_id: 4,
      images: [] as ProductImageDB[], // Certifique-se de que está usando o tipo correto
    };

    mockProductDatabase.findProductByName.mockResolvedValue(null);
    mockIdGenerator.generate.mockReturnValue('new_product_id');
    mockProductDatabase.insertProduct.mockResolvedValue({});
    mockProductDatabase.getImagesByProductId.mockResolvedValue([]);

    const result = await productBusiness.createProduct(input);

    expect(result).toEqual({
      message: 'Product created successfully',
      product: {
        id: 'new_product_id',
        name: 'Product Without Images',
        description: 'Product Description',
        price: 49.99,
        stock: 50,
        createdAt: expect.any(String),
        category_id: 1,
        color_id: 2,
        size_id: 3,
        gender_id: 4,
        images: [],
      },
    });
  });
});
