import express from "express"
import TokenService from "../services/TokenService"
import { IdGenerator } from "../services/idGenerator"
import { HashManager } from "../services/HashManager"
import { ErrorHandler } from "../errors/ErrorHandler";
import { OrderController } from "../controller/OrderController";
import { OrderDatabase } from "../database/OrderDatabase";
import { OrderBusiness } from "../business/OrderBusiness";
import { ProductDatabase } from "../database/ProductDatabase";
import { UserDatabase } from "../database/UserDatabase";

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

orderRouter.get("/getOrder/:id", orderController.getOrders)
orderRouter.get("/getAllOrders", orderController.getAllOrders)
orderRouter.get("/getAllStatus", orderController.getAllStatus)
orderRouter.post("/createOrder", orderController.createOrder)
orderRouter.patch("/updateOrder/:id", orderController.updateOrder)
orderRouter.delete("/deleteOrder/:id", orderController.cancelOrder)