import {
  CreateWishListInputDTO,
  CreateWishListOutputDTO,
} from "./../dtos/wishlist/createWishList.dto";

import {
  GetWishListInputDTO,
  GetWishListOutputDTO,
} from "./../dtos/wishlist/getWishList.dto";
import {
  UpdateWishListInputDTO,
  UpdateWishListOutputDTO,
} from "./../dtos/wishlist/updateWishList.dto";
import {
  DeleteWishListInputDTO,
  DeleteWishListOutputDTO,
} from "./../dtos/wishlist/deleteWishList.dto";

import {
  WishlistDBInput,
  WishlistDBOutput,
} from "../models/WishList";
import { WishlistDatabase } from "../database/WishListDatabase";
import TokenService from "../services/TokenService";
import { IdGenerator } from "../services/idGenerator";
import { NotFoundError } from "../errors/NotFoundError";
import { ErrorHandler } from "../errors/ErrorHandler";
import { WishlistItemDB } from "../models/WishList";
import { HashManager } from "../services/HashManager";
import { ForbiddenError } from "../errors/ForbiddenError";
import { UserDatabase } from "../database/UserDatabase";
import { ProductDatabase } from "../database/ProductDatabase";

export class WishlistBusiness {
  constructor(
    private wishlistDatabase: WishlistDatabase,
    private userDatabase: UserDatabase,
    private productDatabase: ProductDatabase,
    private idGenerator: IdGenerator,
    private tokenService: TokenService,
    private hashmanager: HashManager,
    private errorHandler: ErrorHandler
  ) {}

  public createWishlist = async (
    input: CreateWishListInputDTO
  ): Promise<CreateWishListOutputDTO> => {
    const { userId, items } = input;

    const wishlist_id = this.idGenerator.generate();
    const created_at = new Date().toISOString();

    const newWishlistDB: WishlistDBInput = {
      wishlist_id,
      user_id: userId,
      created_at,
    };

    await this.wishlistDatabase.insertWishlist(newWishlistDB);

    const wishlistItems: WishlistItemDB[] = [];
    if (items && items.length > 0) {
      for (const item of items) {
        const productDB = await this.productDatabase.findPureProductById(
          item.productId
        );
        if (!productDB) {
          throw new NotFoundError(`Product id ${productDB.id} not found`);
        }

        if (!productDB.active) {
          console.log(productDB)
          throw new ForbiddenError(`Product id ${productDB.id} is deactivated`);
        }

        const itemData: WishlistItemDB = {
          wishlist_id,
          product_id: item.productId,
        };

        await this.wishlistDatabase.insertWishlistItem(itemData);

        wishlistItems.push(itemData);
      }
    }

    const output: CreateWishListOutputDTO = {
      message: "Wishlist created successfully",
      wishlistId: wishlist_id,
      items: wishlistItems,
    };

    return output;
  };

  // --------------------------------------------------------------------

  public getWishlist = async (
    input: GetWishListInputDTO
  ): Promise<GetWishListOutputDTO> => {
    const { userId } = input;

    const wishlistDB = await this.wishlistDatabase.findWishlistByUserId(userId);

    if (!wishlistDB) {
      throw new NotFoundError("Wishlist not found");
    }

    const wishlistItemsDB =
      await this.wishlistDatabase.findWishlistItemsByWishlistId(
        wishlistDB.wishlist_id
      );

    const items = await Promise.all(
      wishlistItemsDB.map(async (item: WishlistItemDB) => {
        const productDB = await this.productDatabase.findPureProductById(
          item.product_id
        );
        if (!productDB) {
          throw new NotFoundError(
            `Product with ID ${item.product_id} not found`
          );
        }

        if (!productDB.active) {
          throw new ForbiddenError(
            `Product with ID ${item.product_id} is deactivated`
          );
        }

        return {
          wishlistId: item.wishlist_id,
          productId: item.product_id,
        };
      })
    );

    const output: GetWishListOutputDTO = {
      wishlist: {
        wishlist_id: wishlistDB.wishlist_id,
        userId: wishlistDB.user_id,
        created_at: wishlistDB.created_at,
        items: items,
      },
    };

    return output;
  };


  // --------------------------------------------------------------------

  public updateWishlist = async (
    input: UpdateWishListInputDTO
  ): Promise<UpdateWishListOutputDTO> => {
    const { userId, items } = input;

    const wishlistDB = await this.wishlistDatabase.findWishlistByUserId(userId);
    if (!wishlistDB) {
      throw new NotFoundError("Wishlist not found");
    }

    await this.wishlistDatabase.deleteWishlistItemsByWishlistId(
      wishlistDB.wishlist_id
    );

    if (items) {
      for (const item of items) {
        const productDB = await this.productDatabase.findPureProductById(
          item.productId
        );
        if (!productDB) {
          throw new NotFoundError(
            `Product with ID ${item.productId} not found`
          );
        }

        if (!productDB.active) {
          throw new ForbiddenError(
            `Product with ID ${item.productId} is deactivated`
          );
        }

        const newWishlistItemDB: WishlistItemDB = {
          wishlist_id: wishlistDB.wishlist_id,
          product_id: item.productId,
        };
        await this.wishlistDatabase.insertWishlistItem(newWishlistItemDB);
      }
    }

    const updatedItemsDB =
      await this.wishlistDatabase.findWishlistItemsByWishlistId(
        wishlistDB.wishlist_id
      );
    const updatedItems = updatedItemsDB.map((item: WishlistItemDB) => ({
      wishlistId: item.wishlist_id,
      productId: item.product_id,
    }));

    const output: UpdateWishListOutputDTO = {
      message: "Wishlist updated successfully",
      wishlist: {
        wishlist_id: wishlistDB.wishlist_id,
        userId: wishlistDB.user_id,
        created_at: wishlistDB.created_at,
        items: updatedItems,
      },
    };

    return output;
  };

  // --------------------------------------------------------------------

  public deleteWishlist = async (
    input: DeleteWishListInputDTO
  ): Promise<DeleteWishListOutputDTO> => {
    const { userId } = input;

    const wishlistDB = await this.wishlistDatabase.findWishlistByUserId(userId);
    if (!wishlistDB) {
      throw new NotFoundError("Wishlist not found");
    }

    await this.wishlistDatabase.deleteWishlistItemsByWishlistId(
      wishlistDB.wishlist_id
    );
    await this.wishlistDatabase.deleteWishlist(wishlistDB.wishlist_id);

    return {
      message: "Wish List deleted sussessfully",
    };
  };
}
