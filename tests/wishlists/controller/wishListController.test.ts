import { Request, Response } from "express";
import { WishlistController } from "../../../src/controller/WishListController";
import { WishlistBusiness } from "../../../src/business/WishListBusiness";
import { CreateWishListInputDTO } from "../../../src/dtos/wishlist/createWishList.dto";
import { GetWishListInputDTO } from "../../../src/dtos/wishlist/getWishList.dto";
import ErrorHandler from "../../../src/errors/ErrorHandler";
import logger from "../../../src/logs/logger";

const mockWishlistBusiness = {
  createWishlist: jest.fn(),
  getWishlist: jest.fn(),
  updateWishlist: jest.fn(),
  deleteWishlist: jest.fn(),
};

const wishlistController = new WishlistController(
  mockWishlistBusiness as unknown as WishlistBusiness
);

jest.mock("../../../src/logs/logger", () => ({
  error: jest.fn(),
}));

jest.mock("../../../src/errors/ErrorHandler", () => ({
  handleError: jest.fn(),
}));

describe("WishlistController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test("should successfully create a wishlist", async () => {
    const input: CreateWishListInputDTO = {
      userId: "user_id",
      items: [{ productId: "product_id_1" }, { productId: "product_id_2" }],
    };

    const output = {
      message: "Wishlist created successfully",
      wishlistId: "wishlist_id",
      items: [
        { wishlist_id: "wishlist_id", product_id: "product_id_1" },
        { wishlist_id: "wishlist_id", product_id: "product_id_2" },
      ],
    };

    mockWishlistBusiness.createWishlist.mockResolvedValue(output);

    req.body = {
      userId: "user_id",
      items: [{ productId: "product_id_1" }, { productId: "product_id_2" }],
    };
    req.headers = {
      authorization: "Bearer some-token",
    };

    await wishlistController.createWishlist(req as Request, res as Response);

    expect(mockWishlistBusiness.createWishlist).toHaveBeenCalledWith(input);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(output);
  });

  test("should handle errors properly in createWishlist", async () => {
    const error = new Error("Validation Error");

    req.body = {
      userId: "user_id",
      items: [{ productId: "product_id_1" }],
    };

    mockWishlistBusiness.createWishlist.mockRejectedValue(error);

    await wishlistController.createWishlist(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });

  test("should successfully get a wishlist", async () => {
    const input: GetWishListInputDTO = {
      userId: "user_id",
    };

    const output = {
      wishlist: {
        wishlist_id: "wishlist_id",
        userId: "user_id",
        created_at: "2024-08-21T23:22:27.898Z",
        items: [{ productId: "product_id_1" }, { productId: "product_id_2" }],
      },
    };

    mockWishlistBusiness.getWishlist.mockResolvedValue(output);

    req.params = {
      id: "user_id",
    };

    req.headers = {
      authorization: "Bearer some-token",
    };

    await wishlistController.getWishlist(req as Request, res as Response);

    expect(mockWishlistBusiness.getWishlist).toHaveBeenCalledWith(input);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(output);
  });

  test("should handle errors properly in getWishlist", async () => {
    const error = new Error("Error Getting Wishlist");

    mockWishlistBusiness.getWishlist.mockRejectedValue(error);

    req.params = {
      id: "user_id",
    };

    req.headers = {
      authorization: "Bearer some-token",
    };

    await wishlistController.getWishlist(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });  

  test("should successfully delete a wishlist", async () => {
    req.params = { userId: "user_id" };
    const output = {
      message: "Wishlist deleted successfully",
    };

    mockWishlistBusiness.deleteWishlist.mockResolvedValue(output);

    await wishlistController.deleteWishlist(req as Request, res as Response);

    expect(mockWishlistBusiness.deleteWishlist).toHaveBeenCalledWith({
      userId: "user_id",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(output);
  });

  test("should handle errors properly in deleteWishlist", async () => {
    const error = new Error("Error Deleting Wishlist");

    req.params = { userId: "user_id" };

    mockWishlistBusiness.deleteWishlist.mockRejectedValue(error);

    await wishlistController.deleteWishlist(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });
});
