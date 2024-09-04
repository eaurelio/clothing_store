import { Request, Response } from "express";

import { UserBusiness } from "../business/UserBusiness";

import { CreateUserSchema } from "../dtos/users/createUser.dto";
import { LoginSchema } from "../dtos/users/login";
import {
  ResetPasswordSchema,
  ToggleUserActiveStatusSchema,
  UpdatePasswordSchema,
  UpdateUserSchema,
} from "../dtos/users/updateUser.dto";
import { GetUserSchema, GetAllUserSchema } from "../dtos/users/getUser.dto";
import {
  PhoneDeleteSchema,
  PhoneInputSchema,
  PhoneUpdtateInputSchema,
} from "../dtos/users/phone";

import ErrorHandler from "../errors/ErrorHandler";

import logger from "../logs/logger";

export class UserController {
  constructor(private userBusiness: UserBusiness) {
    this.createUser = this.createUser.bind(this);
    this.login = this.login.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.editUser = this.editUser.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.toggleUserActiveStatus = this.toggleUserActiveStatus.bind(this);
    this.addPhone = this.addPhone.bind(this);
    this.updatePhone = this.updatePhone.bind(this);
    this.deletePhone = this.deletePhone.bind(this);
  }

  public async createUser(req: Request, res: Response) {
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
  }

  public async login(req: Request, res: Response) {
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
  }

  public async getUserById(req: Request, res: Response) {
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
  }

  public async getUsers(req: Request, res: Response) {
    try {
      const input = GetAllUserSchema.parse({
        q: req.query.q as string,
        onlyActive: req.body.onlyActive,
        personalId: req.body.personalId,
        genderId: req.body.genderId,
        email: req.body.email,
        role: req.body.role,
      });

      const output = await this.userBusiness.getAllUsers(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }

  public async editUser(req: Request, res: Response) {
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
  }

  public async changePassword(req: Request, res: Response) {
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
  }

  public async resetPassword(req: Request, res: Response) {
    try {
      const input = ResetPasswordSchema.parse({
        userId: req.body.userId,
        email: req.body.email,
        newPassword: req.body.newPassword,
      });

      const output = await this.userBusiness.resetPassword(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }

  public async toggleUserActiveStatus(req: Request, res: Response) {
    try {
      const input = ToggleUserActiveStatusSchema.parse({
        email: req.body.email,
        password: req.body.password,
      });

      const output = await this.userBusiness.toggleUserActiveStatus(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }

  public async addPhone(req: Request, res: Response) {
    try {
      const input = PhoneInputSchema.parse({
        userId: req.params.id,
        number: req.body.number,
        type: req.body.type,
      });

      const output = await this.userBusiness.addPhone(input);
      res.status(201).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }

  public async updatePhone(req: Request, res: Response) {
    try {
      const input = PhoneUpdtateInputSchema.parse({
        userId: req.params.id,
        phoneId: req.body.phoneId,
        number: req.body.number,
        type: req.body.type,
      });

      const output = await this.userBusiness.updatePhone(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }

  public async deletePhone(req: Request, res: Response) {
    try {
      const input = PhoneDeleteSchema.parse({
        userId: req.params.id,
        phoneId: req.body.phoneId,
      });

      const output = await this.userBusiness.deletePhone(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }
}
