import express from "express"
import TokenService from "../services/TokenService"
import { ProductDatabase } from './../database/ProductDatabase';
import { IdGenerator } from "../services/idGenerator"
import { HashManager } from "../services/HashManager"
import { ProductController } from "../controller/ProductController"
import { ProductBusiness } from "../business/ProductBusiness"
import { UserDatabase } from "../database/UserDatabase";
import { ErrorHandler } from "../errors/ErrorHandler";
import { ensureAdmin } from "../middlewares/ensureAdminMiddleware";
import { USER_ROLES } from "../models/User";

export const productRouter = express.Router()

const productController = new ProductController(
  new ProductBusiness(
    new ProductDatabase,
    new IdGenerator,
    new TokenService,
    new HashManager,
    new UserDatabase,
    new ErrorHandler
  )
)

productRouter.get("/getProducts", productController.getProducts)
productRouter.post("/createProduct", ensureAdmin(USER_ROLES.ADMIN), productController.createProduct)
productRouter.patch("/editProduct/:id", ensureAdmin(USER_ROLES.ADMIN), productController.editProduct)
productRouter.patch("/toggleProductActiveStatus/:id", ensureAdmin(USER_ROLES.ADMIN), productController.toggleProductActiveStatus)

productRouter.post("/insertProductImage", ensureAdmin(USER_ROLES.ADMIN), productController.insertProductImage)
productRouter.delete("/deleteProductImage", ensureAdmin(USER_ROLES.ADMIN), productController.deleteProductImage)

productRouter.post("/createCategory", ensureAdmin(USER_ROLES.ADMIN), productController.createCategory)
productRouter.post("/createColor", ensureAdmin(USER_ROLES.ADMIN), productController.createColor)
productRouter.post("/createSize", ensureAdmin(USER_ROLES.ADMIN), productController.createSize)
productRouter.post("/createGender", ensureAdmin(USER_ROLES.ADMIN), productController.createGender)

productRouter.patch("/updateCategory/:id", ensureAdmin(USER_ROLES.ADMIN), productController.updateCategory)
productRouter.patch("/updateColor/:id", ensureAdmin(USER_ROLES.ADMIN), productController.updateColor)
productRouter.patch("/updateSize/:id", ensureAdmin(USER_ROLES.ADMIN), productController.updateSize)
productRouter.patch("/updateGender/:id", ensureAdmin(USER_ROLES.ADMIN), productController.updateGender)

productRouter.get('/getAllCategories', productController.getAllCategories)
productRouter.get('/getAllColors', productController.getAllColors)
productRouter.get('/getAllSizes', productController.getAllSizes)
productRouter.get('/getAllGenders', productController.getAllGenders)