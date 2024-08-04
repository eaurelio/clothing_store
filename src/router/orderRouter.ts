import express from "express"
import TokenService from "../services/TokenService"
import { ProductDatabase } from './../database/ProductDatabase';
import { IdGenerator } from "../services/idGenerator"
import { HashManager } from "../services/HashManager"
import { ProductController } from "../controller/ProductController"
import { ProductBusiness } from "../business/ProductBusiness"
import { UserDatabase } from "../database/UserDatabase";
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

// productRouter.get("/getProduct/:id", productController.getProduct)
// productRouter.get("/getAllProducts", productController.getAllProducts)
// productRouter.post("/createProduct", productController.createProduct)
// productRouter.patch("/updateProduct/:id", productController.editProduct)

// productRouter.post("/createCategory", productController.createCategory)
// productRouter.post("/createColor", productController.createColor)
// productRouter.post("/createSize", productController.createSize)
// productRouter.post("/createGender", productController.createGender)

// productRouter.patch("/updateCategory/:id", productController.updateCategory)
// productRouter.patch("/updateColor/:id", productController.updateColor)
// productRouter.patch("/updateSize/:id", productController.updateSize)
// productRouter.patch("/updateGender/:id", productController.updateGender)