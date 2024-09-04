import { WishlistBusiness } from "../../../src/business/WishListBusiness";
import { WishlistDatabase } from "../../../src/database/WishListDatabase";
import { ProductDatabase } from "../../../src/database/ProductDatabase";
import { IdGenerator } from "../../../src/services/idGenerator";
import {
  CreateWishListInputDTO,
  CreateWishListOutputDTO,
} from "../../../src/dtos/wishlist/createWishList.dto";
import { WishlistItemDB } from "../../../src/models/WishList";

const mockWishlistDatabase = {
  findWishlistByUserId: jest.fn(),
  deleteWishlistItemsByWishlistId: jest.fn(),
  insertWishlist: jest.fn(),
  insertWishlistItem: jest.fn(),
};

const mockProductDatabase = {
  findPureProductById: jest.fn(),
};

const mockIdGenerator = {
  generate: jest.fn(() => "new_wishlist_id"),
};

const mockTokenService = {};
const mockHashManager = {};
const mockErrorHandler = {};

const wishlistBusiness = new WishlistBusiness(
  mockWishlistDatabase as unknown as WishlistDatabase,
  {} as any,
  mockProductDatabase as unknown as ProductDatabase,
  mockIdGenerator as unknown as IdGenerator,
  mockTokenService as any,
  mockHashManager as any,
  mockErrorHandler as any
);

describe("WishlistBusiness - createWishlist", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create a new wishlist successfully", async () => {
    const input: CreateWishListInputDTO = {
      userId: "user_id_1",
      items: [{ productId: "product_id_1" }],
    };

    const expectedWishlistDB = {
      wishlist_id: "new_wishlist_id",
      user_id: "user_id_1",
      created_at: expect.any(String),
    };

    const expectedWishlistItemDB: WishlistItemDB = {
      wishlist_id: "new_wishlist_id",
      product_id: "product_id_1",
    };

    const expectedOutput: CreateWishListOutputDTO = {
      message: "Wishlist created successfully",
      wishlistId: "new_wishlist_id",
      items: [expectedWishlistItemDB],
    };

    mockWishlistDatabase.findWishlistByUserId.mockResolvedValue(null);
    mockIdGenerator.generate.mockReturnValue("new_wishlist_id");
    mockWishlistDatabase.insertWishlist.mockResolvedValue(undefined);
    mockProductDatabase.findPureProductById.mockResolvedValue({
      active: true,
    } as any);
    mockWishlistDatabase.insertWishlistItem.mockResolvedValue(undefined);

    const result = await wishlistBusiness.createWishlist(input);

    expect(result).toEqual(expectedOutput);
    expect(mockIdGenerator.generate).toHaveBeenCalledTimes(1);
    expect(mockWishlistDatabase.insertWishlist).toHaveBeenCalledWith(
      expectedWishlistDB
    );
    expect(mockWishlistDatabase.insertWishlistItem).toHaveBeenCalledWith(
      expectedWishlistItemDB
    );
  });

  test("should update an existing wishlist and remove old items", async () => {
    const input: CreateWishListInputDTO = {
      userId: "user_id_1",
      items: [{ productId: "product_id_1" }],
    };

    const existingWishlist = { wishlist_id: "existing_wishlist_id" };

    const expectedWishlistItemDB: WishlistItemDB = {
      wishlist_id: "existing_wishlist_id",
      product_id: "product_id_1",
    };

    const expectedOutput: CreateWishListOutputDTO = {
      message: "Wishlist updated successfully",
      wishlistId: "existing_wishlist_id",
      items: [expectedWishlistItemDB],
    };

    mockWishlistDatabase.findWishlistByUserId.mockResolvedValue(
      existingWishlist
    );
    mockWishlistDatabase.deleteWishlistItemsByWishlistId.mockResolvedValue(
      undefined
    );
    mockProductDatabase.findPureProductById.mockResolvedValue({
      active: true,
    } as any);
    mockWishlistDatabase.insertWishlistItem.mockResolvedValue(undefined);

    const result = await wishlistBusiness.createWishlist(input);

    expect(result).toEqual(expectedOutput);
    expect(
      mockWishlistDatabase.deleteWishlistItemsByWishlistId
    ).toHaveBeenCalledWith("existing_wishlist_id");
    expect(mockWishlistDatabase.insertWishlistItem).toHaveBeenCalledWith(
      expectedWishlistItemDB
    );
  });

  test("should ignore invalid or inactive items", async () => {
    const input: CreateWishListInputDTO = {
      userId: "user_id_1",
      items: [{ productId: "product_id_1" }],
    };

    mockWishlistDatabase.findWishlistByUserId.mockResolvedValue(null);
    mockIdGenerator.generate.mockReturnValue("new_wishlist_id");
    mockWishlistDatabase.insertWishlist.mockResolvedValue(undefined);
    mockProductDatabase.findPureProductById.mockResolvedValue(null);

    const result = await wishlistBusiness.createWishlist(input);

    expect(result.items.length).toBe(0);
    expect(mockWishlistDatabase.insertWishlistItem).not.toHaveBeenCalled();
  });
});
