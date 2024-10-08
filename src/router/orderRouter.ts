import express from "express";

import TokenService from "../services/TokenService";
import { IdGenerator } from "../services/idGenerator";
import { HashManager } from "../services/HashManager";
import ErrorHandler from "../errors/ErrorHandler";

import { OrderController } from "../controller/OrderController";
import { OrderDatabase } from "../database/OrderDatabase";
import { OrderBusiness } from "../business/OrderBusiness";
import { ProductDatabase } from "../database/ProductDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { authMiddleware } from "../middlewares/authMiddleware";
import { USER_ROLES } from "../models/User";
import { ensureAdmin } from "../middlewares/ensureAdminMiddleware";


export const orderRouter = express.Router()

const orderController = new OrderController(
  new OrderBusiness(
    new OrderDatabase,
    new ProductDatabase,
    new UserDatabase,
    new IdGenerator,
    new TokenService,
    new HashManager,
    new ErrorHandler
  )
)

orderRouter.get("/getUserOrders", authMiddleware([USER_ROLES.CLIENT, USER_ROLES.ADMIN]), orderController.getUserOrders)
orderRouter.get("/getAllOrders", ensureAdmin(USER_ROLES.ADMIN), orderController.getAllOrders)
orderRouter.get("/getAllStatus", orderController.getAllStatus)
orderRouter.post("/createOrder", authMiddleware([USER_ROLES.CLIENT, USER_ROLES.ADMIN]), orderController.createOrder)
orderRouter.patch("/updateOrder/:id", ensureAdmin(USER_ROLES.ADMIN), orderController.updateOrder)
orderRouter.patch("/cancelOrder/:id", authMiddleware([USER_ROLES.CLIENT, USER_ROLES.ADMIN]), orderController.cancelOrder)
orderRouter.delete("/deleteOrder/:id", ensureAdmin(USER_ROLES.ADMIN), orderController.deleteOrder)