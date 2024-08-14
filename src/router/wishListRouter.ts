import express from "express"
import TokenService from "../services/TokenService"
import { IdGenerator } from "../services/idGenerator"
import { HashManager } from "../services/HashManager"
import { ErrorHandler } from "../errors/ErrorHandler";
import { WishlistController } from "../controller/WishListController";
import { WishlistDatabase } from "../database/WishListDatabase";
import { WishlistBusiness } from "../business/WishListBusiness";
import { ProductDatabase } from "../database/ProductDatabase";
import { UserDatabase } from "../database/UserDatabase";

export const wishListRouter = express.Router()

const wishListController = new WishlistController(
  new WishlistBusiness(
    new WishlistDatabase,
    new UserDatabase,
    new ProductDatabase,
    new IdGenerator,
    new TokenService,
    new HashManager,
    new ErrorHandler
  )
)

wishListRouter.get('/getWishList', wishListController.getWishlist)
wishListRouter.post('/createWishList', wishListController.createWishlist)
wishListRouter.patch('/updateWishList', wishListController.updateWishlist)
wishListRouter.delete('/deleteWishList', wishListController.deleteWishlist)
