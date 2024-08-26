import { ProductBusiness } from '../../../src/business/ProductBusiness';
import { ProductDatabase } from '../../../src/database/ProductDatabase';
import { IdGenerator } from '../../../src/services/idGenerator';
import TokenService from '../../../src/services/TokenService';
import { UserDatabase } from '../../../src/database/UserDatabase';
import { ErrorHandler } from '../../../src/errors/ErrorHandler';
import { HashManager } from '../../../src/services/HashManager';
import { ProductImageDBInput, ProductImageOutput } from '../../../src/models/ProductImage';
import { ConflictError } from '../../../src/errors/Errors';

// Mock implementations
const mockProductDatabase = {
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

// Initialize the ProductBusiness instance
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
    const input: ProductImageDBInput = {
      product_id: 'product_id',
      url: 'http://example.com/new_image.jpg',
      alt: 'New Image',
    };
  
    // Imagens existentes que não incluem a nova URL
    const existingImages = [
      { id: 'image_id_1', product_id: 'product_id', url: 'http://example.com/old_image.jpg', alt: 'Old Image' }
    ];
  
    // ID gerado para a nova imagem
    const imageId = 'new_image_id';
  
    // Imagens após a inserção
    const insertedImages = [
      ...existingImages,
      { id: imageId, product_id: input.product_id, url: input.url, alt: input.alt },
    ];
  
    // Mock para retornar imagens existentes que não contêm a nova URL
    mockProductDatabase.getImagesByProductId.mockResolvedValue(existingImages);
  
    // Mock para gerar um novo ID para a imagem
    mockIdGenerator.generate.mockReturnValue(imageId);
  
    // Mock para a inserção da imagem ser bem-sucedida
    mockProductDatabase.insertProductImage.mockResolvedValue({});
  
    // Mock para retornar todas as imagens, incluindo a nova imagem inserida
    mockProductDatabase.getImagesByProductId.mockResolvedValue(insertedImages);
  
    // Executar o método e verificar o resultado
    const result: ProductImageOutput = await productBusiness.insertProductImage(input);
  
    expect(result).toEqual({
      message: 'Image inserted successfully',
      images: insertedImages,
    });
  });
  
  

  test('should throw ConflictError if the image URL already exists', async () => {
    const input: ProductImageDBInput = {
      product_id: 'product_id',
      url: 'http://example.com/old_image.jpg',
      alt: 'Duplicate Image',
    };

    const existingImages = [
      { id: 'image_id_1', product_id: 'product_id', url: 'http://example.com/old_image.jpg', alt: 'Old Image' }
    ];

    mockProductDatabase.getImagesByProductId.mockResolvedValue(existingImages);

    await expect(productBusiness.insertProductImage(input)).rejects.toThrow(ConflictError);
  });
});
