import express from "express"
import TokenService from "../services/TokenService"
import { ProductDatabase } from './../database/ProductDatabase';
import { IdGenerator } from "../services/idGenerator"
import { HashManager } from "../services/HashManager"
import { ProductController } from "../controller/ProductController"
import { ProductBusiness } from "../business/ProductBusiness"
import { UserDatabase } from "../database/UserDatabase";

export const productRouter = express.Router()

const productController = new ProductController(
  new ProductBusiness(
    new ProductDatabase,
    new IdGenerator,
    new TokenService,
    new HashManager,
    new UserDatabase
  )
)

productRouter.get("/getProduct/:id", productController.getProduct)
productRouter.get("/getAllProducts", productController.getAllProducts)
productRouter.post("/createProduct", productController.createProduct)
productRouter.patch("/updateProduct/:id", productController.editProduct)

productRouter.post("/createCategory", productController.createCategory)
productRouter.post("/createColor", productController.createColor)
productRouter.post("/createSize", productController.createSize)
productRouter.post("/createGender", productController.createGender)

productRouter.patch("/updateCategory/:id", productController.updateCategory)
productRouter.patch("/updateColor/:id", productController.updateColor)
productRouter.patch("/updateSize/:id", productController.updateSize)
productRouter.patch("/updateGender/:id", productController.updateGender)