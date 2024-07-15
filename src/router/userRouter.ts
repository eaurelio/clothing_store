import express from "express"
import { UserController } from "../controller/UserController"
import { UserBusiness } from "../business/UserBusiness"
import { UserDatabase } from "../database/UserDatabase"
import { IdGenerator } from "../services/idGenerator"
import TokenService from "../services/TokenService"
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
userRouter.post("/getUsers", userController.getUsers)
userRouter.post("/login", userController.login)
userRouter.patch("/:id", userController.editUser)
// userRouter.delete("/:id", userController.deleteUser)
