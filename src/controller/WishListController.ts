import { Request, Response } from "express";
import { WishlistBusiness } from "../business/WishListBusiness";
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
import { ErrorHandler } from "../errors/ErrorHandler";
import logger from "../logs/logger";

export class WishlistController {
  constructor(private wishlistBusiness: WishlistBusiness) {}

  public createWishlist = async (req: Request, res: Response) => {
    try {
      const input = CreateWishListSchema.parse({
        token: req.headers.authorization as string,
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
        token: req.headers.authorization as string,
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
        token: req.headers.authorization as string,
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
        token: req.headers.authorization as string
      });

      await this.wishlistBusiness.deleteWishlist(input);
      res.status(200).send({ message: "Wishlist deleted successfully" });
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };
}
