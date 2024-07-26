import express from "express"
import TokenService from "../services/TokenService"
import { UserController } from "../controller/UserController"
import { UserBusiness } from "../business/UserBusiness"
import { UserDatabase } from "../database/UserDatabase"
import { IdGenerator } from "../services/idGenerator"
import { HashManager } from "../services/HashManager"

export const userRouter = express.Router()

const userController = new UserController(
  new UserBusiness(
    new UserDatabase,
    new IdGenerator,
    new TokenService,
    new HashManager
  )
)

userRouter.post("/createUser", userController.createUser)
userRouter.post("/getUserData/:id", userController.getUserData)
userRouter.post("/getAllUsers", userController.getAllUsers)
userRouter.post("/login", userController.login)
userRouter.patch("/editUser/:id", userController.editUser)
userRouter.patch("/changePassword/:id", userController.changePassword)

userRouter.post("/addPhone/:id", userController.addPhone)
userRouter.patch("/updatePhone/:id", userController.updatePhone)
userRouter.delete("/deletePhone/:id", userController.deletePhone)

