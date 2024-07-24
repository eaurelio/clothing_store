import express from "express"
import TokenService from "../services/TokenService"
import { ProductDatabase } from './../database/ProductDatabase';
import { IdGenerator } from "../services/idGenerator"
import { HashManager } from "../services/HashManager"
import { ProductController } from "../controller/ProductController"
import { ProductBusiness } from "../business/ProductBusiness"

export const productRouter = express.Router()

const productController = new ProductController(
  new ProductBusiness(
    new ProductDatabase,
    new IdGenerator,
    new TokenService,
    new HashManager
  )
)

productRouter.get("/getProduct/:id", productController.getProduct)
productRouter.get("/getAllProducts", productController.getAllProducts)


// userRouter.post("/createUser", userController.createUser)
// userRouter.post("/getUserData/:id", userController.getUserData)
// userRouter.post("/getAllUsers", userController.getAllUsers)
// userRouter.post("/login", userController.login)
// userRouter.patch("/editUser/:id", userController.editUser)

// userRouter.post("/addPhone/:id", userController.addPhone)
// userRouter.patch("/updatePhone/:id", userController.updatePhone)
// userRouter.delete("/deletePhone/:id", userController.deletePhone)