import express from "express"
import TokenService from "../services/TokenService"
import { IdGenerator } from "../services/idGenerator"
import { HashManager } from "../services/HashManager"
import { ErrorHandler } from "../errors/ErrorHandler";
import { OrderController } from "../controller/OrderController";
import { OrderDatabase } from "../database/OrderDatabase";
import { OrderBusiness } from "../business/OrderBusiness";

export const orderRouter = express.Router()

const orderController = new OrderController(
  new OrderBusiness(
    new OrderDatabase,
    new IdGenerator,
    new TokenService,
    new HashManager,
    new ErrorHandler
  )
)

orderRouter.get("/getOrder/:id", orderController.getOrder)
orderRouter.get("/getAllOrders", orderController.getAllOrders)
orderRouter.post("/createOrder", orderController.createOrder)
orderRouter.patch("/updateOrder/:id", orderController.updateOrder)
orderRouter.delete("/deleteOrder/:id", orderController.deleteOrder)