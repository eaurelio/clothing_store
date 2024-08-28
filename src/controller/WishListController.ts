// Express
import { Request, Response } from "express";

// Business Logic
import { WishlistBusiness } from "../business/WishListBusiness";

// DTOs
import {
  CreateWishListSchema,
} from "../dtos/wishlist/createWishList.dto";
import {
  GetWishListSchema,
} from "../dtos/wishlist/getWishList.dto";
import {
  UpdateWishListSchema,
} from "../dtos/wishlist/updateWishList.dto";
import {
  DeleteWishListSchema,
} from "../dtos/wishlist/deleteWishList.dto";

// Errors
import ErrorHandler from "../errors/ErrorHandler";

// Logging
import logger from "../logs/logger";


export class WishlistController {
  constructor(private wishlistBusiness: WishlistBusiness) {}

  // --------------------------------------------------------------------
  // WISHLIST
  // --------------------------------------------------------------------

  public createWishlist = async (req: Request, res: Response) => {
    try {
      const input = CreateWishListSchema.parse({
        userId: req.params.id,
        items: req.body.items,
      });

      const output = await this.wishlistBusiness.createWishlist(input);
      res.status(201).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  // --------------------------------------------------------------------

  public getWishlist = async (req: Request, res: Response) => {
    try {
      const input = GetWishListSchema.parse({
        userId: req.params.id
      });

      const output = await this.wishlistBusiness.getWishlist(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  // --------------------------------------------------------------------

  public updateWishlist = async (req: Request, res: Response) => {
    try {
      const input = UpdateWishListSchema.parse({
        userId: req.params.id,
        items: req.body.items.map((item: any) => ({ productId: item.productId })),
      });

      const output = await this.wishlistBusiness.updateWishlist(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  // --------------------------------------------------------------------

  public deleteWishlist = async (req: Request, res: Response) => {
    try {
      const input = DeleteWishListSchema.parse({
        userId: req.params.id
      });

      await this.wishlistBusiness.deleteWishlist(input);
      res.status(200).send({ message: "Wishlist deleted successfully" });
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };
}
