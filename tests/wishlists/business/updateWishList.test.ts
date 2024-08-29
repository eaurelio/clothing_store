import { WishlistBusiness } from '../../../src/business/WishListBusiness';
import { WishlistDatabase } from '../../../src/database/WishListDatabase';
import { ProductDatabase } from '../../../src/database/ProductDatabase';
import { IdGenerator } from '../../../src/services/idGenerator';
import { UpdateWishListInputDTO, UpdateWishListOutputDTO } from '../../../src/dtos/wishlist/updateWishList.dto';
import { WishlistItemDB } from '../../../src/models/WishList';
import { NotFoundError } from '../../../src/errors/Errors';

// Mocks
const mockWishlistDatabase = {
  findWishlistByUserId: jest.fn(),
  deleteWishlistItemsByWishlistId: jest.fn(),
  insertWishlistItem: jest.fn(),
  findWishlistItemsByWishlistId: jest.fn(),
};

const mockProductDatabase = {
  findPureProductById: jest.fn(),
};

const mockIdGenerator = {
  generate: jest.fn(),
};

const mockTokenService = {};
const mockHashManager = {};
const mockErrorHandler = {};

const wishlistBusiness = new WishlistBusiness(
  mockWishlistDatabase as unknown as WishlistDatabase,
  {} as any, // Mock UserDatabase
  mockProductDatabase as unknown as ProductDatabase,
  mockIdGenerator as unknown as IdGenerator,
  mockTokenService as any,
  mockHashManager as any,
  mockErrorHandler as any
);

describe('WishlistBusiness - updateWishlist', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should update an existing wishlist successfully', async () => {
    const input: UpdateWishListInputDTO = {
      userId: 'user_id_1',
      items: [{ productId: 'product_id_1' }],
    };

    const existingWishlistDB = {
      wishlist_id: 'existing_wishlist_id',
      user_id: 'user_id_1',
      created_at: '2024-08-26T00:00:00Z',
    };

    const updatedWishlistItemsDB: WishlistItemDB[] = [
      { wishlist_id: 'existing_wishlist_id', product_id: 'product_id_1' },
    ];

    const expectedOutput: UpdateWishListOutputDTO = {
      message: 'Wishlist updated successfully',
      wishlist: {
        wishlist_id: 'existing_wishlist_id', // Corrigido para `wishlistId`
        userId: 'user_id_1',
        created_at: '2024-08-26T00:00:00Z',
        items: [{ productId: 'product_id_1' }],
      },
    };

    mockWishlistDatabase.findWishlistByUserId.mockResolvedValue(existingWishlistDB);
    mockWishlistDatabase.deleteWishlistItemsByWishlistId.mockResolvedValue(undefined);
    mockProductDatabase.findPureProductById.mockResolvedValue({ active: true } as any);
    mockWishlistDatabase.insertWishlistItem.mockResolvedValue(undefined);
    mockWishlistDatabase.findWishlistItemsByWishlistId.mockResolvedValue(updatedWishlistItemsDB);

    const result = await wishlistBusiness.updateWishlist(input);

    expect(result).toEqual(expectedOutput);
    expect(mockWishlistDatabase.deleteWishlistItemsByWishlistId).toHaveBeenCalledWith('existing_wishlist_id');
    expect(mockWishlistDatabase.insertWishlistItem).toHaveBeenCalledWith({
      wishlist_id: 'existing_wishlist_id',
      product_id: 'product_id_1',
    });
  });

  test('should throw NotFoundError if wishlist does not exist', async () => {
    const input: UpdateWishListInputDTO = {
      userId: 'user_id_1',
      items: [{ productId: 'product_id_1' }],
    };

    mockWishlistDatabase.findWishlistByUserId.mockResolvedValue(null);

    await expect(wishlistBusiness.updateWishlist(input)).rejects.toThrow(NotFoundError);
  });

  test('should ignore invalid or inactive items', async () => {
    const input: UpdateWishListInputDTO = {
      userId: 'user_id_1',
      items: [{ productId: 'product_id_1' }],
    };
  
    const existingWishlistDB = {
      wishlist_id: 'existing_wishlist_id',
      user_id: 'user_id_1',
      created_at: '2024-08-26T00:00:00Z',
    };
  
    mockWishlistDatabase.findWishlistByUserId.mockResolvedValue(existingWishlistDB);
    mockWishlistDatabase.deleteWishlistItemsByWishlistId.mockResolvedValue(undefined);
    mockProductDatabase.findPureProductById.mockResolvedValue(null);
  
    const result = await wishlistBusiness.updateWishlist(input);
  
    expect(result.wishlist.items.length).toBe(0);
    expect(mockWishlistDatabase.insertWishlistItem).not.toHaveBeenCalled();
  });
  
});
