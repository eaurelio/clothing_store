import { Request, Response } from "express";

import { WishlistBusiness } from "../business/WishListBusiness";

import { CreateWishListSchema } from "../dtos/wishlist/createWishList.dto";
import { GetWishListSchema } from "../dtos/wishlist/getWishList.dto";
import { UpdateWishListSchema } from "../dtos/wishlist/updateWishList.dto";
import { DeleteWishListSchema } from "../dtos/wishlist/deleteWishList.dto";

import ErrorHandler from "../errors/ErrorHandler";

import logger from "../logs/logger";

export class WishlistController {
  constructor(private wishlistBusiness: WishlistBusiness) {
    this.createWishlist = this.createWishlist.bind(this);
    this.getWishlist = this.getWishlist.bind(this);
    this.updateWishlist = this.updateWishlist.bind(this);
    this.deleteWishlist = this.deleteWishlist.bind(this);
  }

  public async createWishlist(req: Request, res: Response) {
    try {
      const input = CreateWishListSchema.parse({
        userId: req.body.userId,
        items: req.body.items,
      });

      const output = await this.wishlistBusiness.createWishlist(input);
      res.status(201).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }

  public async getWishlist(req: Request, res: Response) {
    try {
      const input = GetWishListSchema.parse({
        userId: req.params.id,
      });

      const output = await this.wishlistBusiness.getWishlist(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }

  public async updateWishlist(req: Request, res: Response) {
    try {
      const input = UpdateWishListSchema.parse({
        userId: req.body.userId,
        items: req.body.items,
      });

      const output = await this.wishlistBusiness.updateWishlist(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }

  public async deleteWishlist(req: Request, res: Response) {
    try {
      const input = DeleteWishListSchema.parse({
        userId: req.body.userId,
      });

      await this.wishlistBusiness.deleteWishlist(input);
      res.status(200).send({ message: "Wishlist deleted successfully" });
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }
}
