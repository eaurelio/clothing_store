import express from "express"
import TokenService from "../services/TokenService"
import { UserController } from "../controller/UserController"
import { UserBusiness } from "../business/UserBusiness"
import { UserDatabase } from "../database/UserDatabase"
import { IdGenerator } from "../services/idGenerator"
import { HashManager } from "../services/HashManager"
import { ProductController } from "../controller/ProductController"
import { ProductBusiness } from "../business/ProductBusiness"

export const productRouter = express.Router()

const productController = new ProductController(
  new ProductBusiness(
    new UserDatabase,
    new IdGenerator,
    new TokenService,
    new HashManager
  )
)

// userRouter.post("/createUser", userController.createUser)
// userRouter.post("/getUserData/:id", userController.getUserData)
// userRouter.post("/getAllUsers", userController.getAllUsers)
// userRouter.post("/login", userController.login)
// userRouter.patch("/editUser/:id", userController.editUser)

// userRouter.post("/addPhone/:id", userController.addPhone)
// userRouter.patch("/updatePhone/:id", userController.updatePhone)
// userRouter.delete("/deletePhone/:id", userController.deletePhone)