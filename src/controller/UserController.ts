// Express
import { Request, Response } from "express";

// Business Logic
import { UserBusiness } from "../business/UserBusiness";

// DTOs
import { CreateUserSchema } from "../dtos/users/createUser.dto";
import { LoginSchema } from "../dtos/users/login";
import {
  ToggleUserActiveStatusSchema,
  UpdatePasswordSchema,
  UpdateUserSchema,
} from "../dtos/users/updateUser.dto";
import { GetUserSchema, GetAllUserSchema } from "../dtos/users/getUser.dto";
import { PhoneDeleteSchema, PhoneInputSchema, PhoneUpdtateInputSchema } from "../dtos/users/phone";

// Errors
import ErrorHandler from "../errors/ErrorHandler";

// Logging
import logger from "../logs/logger";


export class UserController {
  constructor(private userBusiness: UserBusiness) {}

  // --------------------------------------------------------------------
  // USER DATA
  // --------------------------------------------------------------------

  public createUser = async (req: Request, res: Response) => {
    try {
      const input = CreateUserSchema.parse({
        token: req.headers.authorization,
        personalId: req.body.personalId,
        entityType: req.body.entityType,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        birthdate: req.body.birthdate,
        role: req.body.role,
        address: req.body.address,
        number: req.body.number,
        neighborhood: req.body.neighborhood,
        city: req.body.city,
        country: req.body.country,
        gender: req.body.gender,
        phones: req.body.phones,
      });

      const output = await this.userBusiness.createUser(input);
      res.status(201).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  // --------------------------------------------------------------------

  public login = async (req: Request, res: Response) => {
    try {
      const input = LoginSchema.parse({
        email: req.body.email,
        password: req.body.password,
      });

      const output = await this.userBusiness.login(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  // --------------------------------------------------------------------

  public getUserById = async (req: Request, res: Response) => {
    try {
      const input = GetUserSchema.parse({
        userId: req.params.id as string,
      });
  
      const output = await this.userBusiness.getUserById(input);
      res.status(200).json(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  // --------------------------------------------------------------------

  public getUsers = async (req: Request, res: Response) => {
    try {
      const input = GetAllUserSchema.parse({
        q: req.query.q as string,
        onlyActive: req.body.onlyActive
      });

      const output = await this.userBusiness.getAllUsers(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  // --------------------------------------------------------------------

  public editUser = async (req: Request, res: Response) => {
    try {
      const input = UpdateUserSchema.parse({
        userId: req.params.id,
        personalId: req.body.personalId,
        entityType: req.body.entityType,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        birthdate: req.body.birthdate,
        address: req.body.address,
        number: req.body.number,
        neighborhood: req.body.neighborhood,
        city: req.body.city,
        country: req.body.country,
        gender: req.body.gender,
        phones: req.body.phones,
      });

      const output = await this.userBusiness.editUser(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  // --------------------------------------------------------------------

  public changePassword = async (req: Request, res: Response) => {
    try {
      const input = UpdatePasswordSchema.parse({
        userId: req.body.userId,
        email: req.body.email,
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword,
      });

      const output = await this.userBusiness.changePassword(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  public toggleUserActiveStatus = async (req: Request, res: Response) => {
    try {
      const input = ToggleUserActiveStatusSchema.parse({
        email: req.body.email,
        password: req.body.password
      });
  
      const output = await this.userBusiness.toggleUserActiveStatus(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };
  

  // --------------------------------------------------------------------
  // USER PHONE
  // --------------------------------------------------------------------

  public addPhone = async (req: Request, res: Response) => {
    try {
      const input = PhoneInputSchema.parse({
        userId: req.body.userId,
        number: req.body.number,
        type: req.body.type,
      });

      const output = await this.userBusiness.addPhone(input);
      res.status(200).json(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  // --------------------------------------------------------------------

  public updatePhone = async (req: Request, res: Response) => {
    try {
      const input = PhoneUpdtateInputSchema.parse({
        userId: req.body.userId,
        phoneId: req.body.phoneId,
        number: req.body.number,
        type: req.body.type,
      });

      const output = await this.userBusiness.updatePhone(input);
      res.status(200).json(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  // --------------------------------------------------------------------

  public deletePhone = async (req: Request, res: Response) => {
    try {
      const input = PhoneDeleteSchema.parse({
        userId: req.body.userId,
        phoneId: req.body.phoneId
      });

      const output = await this.userBusiness.deletePhone(input);
      res.status(200).json(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };
}
