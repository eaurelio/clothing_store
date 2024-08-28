import express from "express";
import TokenService from "../services/TokenService";
import { UserController } from "../controller/UserController";
import { UserBusiness } from "../business/UserBusiness";
import { UserDatabase } from "../database/UserDatabase";
import { IdGenerator } from "../services/idGenerator";
import { HashManager } from "../services/HashManager";
import ErrorHandler from "../errors/ErrorHandler";
import { authMiddleware } from "../middlewares/authMiddleware";
import { USER_ROLES } from "../models/User";
import { ensureAdmin }  from "../middlewares/ensureAdminMiddleware";

export const userRouter = express.Router();

const userController = new UserController(
  new UserBusiness(
    new UserDatabase(),
    new IdGenerator(),
    new TokenService(),
    new HashManager(),
    new ErrorHandler()
  )
);

userRouter.post("/createUser", userController.createUser);
userRouter.post("/login", userController.login);
userRouter.post("/getUserById/:id", authMiddleware([USER_ROLES.CLIENT, USER_ROLES.ADMIN]), userController.getUserById);
userRouter.post("/getUsers", ensureAdmin(USER_ROLES.ADMIN), userController.getUsers);
userRouter.patch("/editUser/:id", authMiddleware([USER_ROLES.CLIENT, USER_ROLES.ADMIN]), userController.editUser);
userRouter.patch("/changePassword", authMiddleware([USER_ROLES.CLIENT, USER_ROLES.ADMIN]), userController.changePassword);
userRouter.patch("/toggleUserActiveStatus", authMiddleware([USER_ROLES.CLIENT, USER_ROLES.ADMIN]), userController.toggleUserActiveStatus);

userRouter.post("/addPhone", authMiddleware([USER_ROLES.CLIENT, USER_ROLES.ADMIN]), userController.addPhone);
userRouter.patch("/updatePhone", authMiddleware([USER_ROLES.CLIENT, USER_ROLES.ADMIN]), userController.updatePhone);
userRouter.delete("/deletePhone", authMiddleware([USER_ROLES.CLIENT, USER_ROLES.ADMIN]), userController.deletePhone);
