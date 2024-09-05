import { Request, Response } from "express";

import { TicketBusiness } from "../business/TicketBusiness";

import { CreateTicketSchema } from "../dtos/tickets/createTicketDTO";
import {
  GetTicketSchema,
  GetAllTicketsSchema,
  GetTicketsByUserIdSchema,
} from "../dtos/tickets/getTicketDTO";
import { UpdateTicketSchema } from "../dtos/tickets/updateTicketDTO";

import ErrorHandler from "../errors/ErrorHandler";

import logger from "../logs/logger";

export class TicketController {
  constructor(private ticketBusiness: TicketBusiness) {
    this.createTicket = this.createTicket.bind(this);
    this.getTicketById = this.getTicketById.bind(this);
    this.getTicketsByUserId = this.getTicketsByUserId.bind(this);
    this.getAllTickets = this.getAllTickets.bind(this);
    this.updateTicket = this.updateTicket.bind(this);
    this.getAllStatus = this.getAllStatus.bind(this);
    this.getAllTypes = this.getAllTypes.bind(this);
  }

  public async createTicket(req: Request, res: Response) {
    try {
      const input = CreateTicketSchema.parse({
        userId: req.body.userId,
        typeId: req.body.typeId,
        description: req.body.description,
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        userPhoneNumber: req.body.userPhoneNumber,
      });

      const output = await this.ticketBusiness.createTicket(input);
      res.status(201).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }

  public async getTicketById(req: Request, res: Response) {
    try {
      const input = GetTicketSchema.parse({
        ticketId: req.params.id,
      });

      const output = await this.ticketBusiness.getTicketById(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }

  public async getTicketsByUserId(req: Request, res: Response) {
    try {
      const input = GetTicketsByUserIdSchema.parse({
        userId: req.params.id
      });

      const output = await this.ticketBusiness.getTicketsByUserId(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }

  public async getAllTickets(req: Request, res: Response) {
    try {
      const input = GetAllTicketsSchema.parse({
        id: req.body.id,
        userId: req.body.userId,
        typeId: req.body.typeId,
        statusId: req.body.statusId,
      });

      const output = await this.ticketBusiness.getAllTickets(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }

  public async updateTicket(req: Request, res: Response) {
    try {
      const input = UpdateTicketSchema.parse({
        ticketId: req.body.ticketId,
        typeId: req.body.typeId,
        solution: req.body.solution,
        statusId: req.body.statusId,
        analistName: req.body.analistName,
        analistEmail: req.body.analistEmail,
      });

      const output = await this.ticketBusiness.updateTicket(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }

  public async getAllStatus(req: Request, res: Response) {
    try {
      const output = await this.ticketBusiness.getAllStatus();
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }

  public async getAllTypes(req: Request, res: Response) {
    try {
      const output = await this.ticketBusiness.getAllTypes();
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  }
}
