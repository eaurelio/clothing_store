import { CreateWishListInputDTO, CreateWishListOutputDTO } from './../dtos/wishlist/createWishList.dto';

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
} from "./../dtos/wishlist/deleteWishList.dto";

import { Wishlist, WishlistDB, WishlistDBOutput } from "../models/WishList";
import { WishlistDatabase } from "../database/WishListDatabase";
import TokenService from "../services/TokenService";
import { IdGenerator } from "../services/idGenerator";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { NotFoundError } from "../errors/NotFoundError";
import { ErrorHandler } from "../errors/ErrorHandler";
import { WishlistItemDB } from "../models/WishList";
import { HashManager } from '../services/HashManager';

export class WishlistBusiness {
  constructor(
    private wishlistDatabase: WishlistDatabase,
    private idGenerator: IdGenerator,
    private tokenService: TokenService,
    private hashmanager: HashManager, 
    private errorHandler: ErrorHandler
  ) {}

  public createWishlist = async (
    input: CreateWishListInputDTO
  ): Promise<CreateWishListOutputDTO> => {
    const { token, items } = input;

    const userId = this.tokenService.getUserIdFromToken(token);
    if (!userId) {
      throw new UnauthorizedError("Invalid token");
    }
    const id = this.idGenerator.generate();
    const createdAt = new Date().toISOString();
    const newWishlist = new Wishlist(id, userId, createdAt);
    const newWishlistDB: WishlistDB = {
      id: newWishlist.getId(),
      user_id: newWishlist.getUserId(),
      createdAt: newWishlist.getCreatedAt(),
      items: []
    };
  
    await this.wishlistDatabase.insertWishlist(newWishlistDB);
  
    const wishlistItems: WishlistItemDB[] = [];
    if (items && items.length > 0) {
      for (const item of items) {
        const itemData: WishlistItemDB = {
          wishlist_id: id,
          product_id: item.productId,
        };
  
        await this.wishlistDatabase.insertWishlistItem(itemData);
  
        wishlistItems.push(itemData);
      }
    }
  
    const output: CreateWishListOutputDTO = {
      message: "Wishlist created successfully",
      wishlistId: newWishlist.getId(),
      items: wishlistItems,
    };
  
    return output;
  };
  

  public getWishlist = async (
    input: { token: string }
  ): Promise<GetWishListOutputDTO> => {
    const { token } = input;
  
    const userId = this.tokenService.getUserIdFromToken(token);
    if (!userId) {
      throw new UnauthorizedError("Invalid token");
    }
  
    const wishlistDB = await this.wishlistDatabase.findWishlistByUserId(userId);
  
    if (!wishlistDB) {
      throw new NotFoundError("Wishlist not found");
    }
  
    const wishlistItemsDB = await this.wishlistDatabase.findWishlistItemsByWishlistId(wishlistDB.id);
  
    const items = wishlistItemsDB.map((item: WishlistItemDB) => ({
      wishlistId: item.wishlist_id,
      productId: item.product_id,
    }));
  
    const output: GetWishListOutputDTO = {
      wishlist: {
        id: wishlistDB.id,
        userId: wishlistDB.user_id,
        createdAt: wishlistDB.createdAt,
        items: items,
      },
    };
  
    return output;
  };
  
  public updateWishlist = async (
    input: UpdateWishListInputDTO
  ): Promise<UpdateWishListOutputDTO> => {
    const { token, items } = input;
  
    const userId = this.tokenService.getUserIdFromToken(token);
    if (!userId) {
      throw new UnauthorizedError("Invalid token");
    }
  
    const wishlistDB = await this.wishlistDatabase.findWishlistByUserId(userId);
    if (!wishlistDB) {
      throw new NotFoundError("Wishlist not found");
    }
  
    await this.wishlistDatabase.deleteWishlistItemsByWishlistId(wishlistDB.id);

    if (items) {
      for (const item of items) {
        const newWishlistItemDB: WishlistItemDB = {
          wishlist_id: wishlistDB.id,
          product_id: item.productId,
        };
        await this.wishlistDatabase.insertWishlistItem(newWishlistItemDB);
      }
    }
  
    const updatedItemsDB = await this.wishlistDatabase.findWishlistItemsByWishlistId(wishlistDB.id);
    const updatedItems = updatedItemsDB.map((item: WishlistItemDB) => ({
      wishlistId: item.wishlist_id,
      productId: item.product_id,
    }));
  
    const output: UpdateWishListOutputDTO = {
      message: "Wishlist updated successfully",
      wishlist: {
        id: wishlistDB.id,
        userId: wishlistDB.user_id,
        createdAt: wishlistDB.createdAt,
        items: updatedItems,
      },
    };
  
    return output;
  };

  public deleteWishlist = async (
    input: DeleteWishListInputDTO
  ): Promise<void> => {
    const { token, wishlistId } = input;

    const userId = this.tokenService.getUserIdFromToken(token);
    if (!userId) {
      throw new UnauthorizedError("Invalid token");
    }

    const wishlistDB = await this.wishlistDatabase.findWishlistById(wishlistId);
    if (!wishlistDB || wishlistDB.user_id !== userId) {
      throw new NotFoundError("Wishlist not found");
    }

    await this.wishlistDatabase.deleteWishlistItemsByWishlistId(wishlistId);
    await this.wishlistDatabase.deleteWishlist(wishlistId);
  };
}