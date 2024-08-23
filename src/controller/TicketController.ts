// Express
import { Request, Response } from "express";

// Business Logic
import { TicketBusiness } from "../business/TicketBusiness";

// DTOs
import {
  CreateTicketSchema,
} from "../dtos/tickets/createTicketDTO";
import {
  GetTicketSchema,
  GetAllTicketsSchema,
} from "../dtos/tickets/getTicketDTO";
import {
  UpdateTicketSchema,
} from "../dtos/tickets/updateTicketDTO";

// Errors
import { ErrorHandler } from "../errors/ErrorHandler";

// Logging
import logger from "../logs/logger";

export class TicketController {
  constructor(private ticketBusiness: TicketBusiness) {}

  // --------------------------------------------------------------------
  // CREATE TICKET
  // --------------------------------------------------------------------

  public createTicket = async (req: Request, res: Response) => {
    try {
      const input = CreateTicketSchema.parse({
        userId: req.body.userId,
        typeId: req.body.typeId,
        description: req.body.description,
        statusId: req.body.statusId,
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        userPhoneNumber: req.body.userPhoneNumber
      });

      const output = await this.ticketBusiness.createTicket(
        input
      );
      res.status(201).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  // --------------------------------------------------------------------
  // GET TICKET BY ID
  // --------------------------------------------------------------------

  public getTicket = async (req: Request, res: Response) => {
    try {
      const input = GetTicketSchema.parse({
        ticketId: req.params.id,
      });

      const output = await this.ticketBusiness.getTicket(
        input
      );
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  // --------------------------------------------------------------------
  // GET ALL TICKETS
  // --------------------------------------------------------------------

  public getAllTickets = async (req: Request, res: Response) => {
    try {
      const input = GetAllTicketsSchema.parse({
        id: req.body.id,
        userId: req.body.userId,
        typeId: req.body.typeId,
        statusId: req.body.statusId
      });

      const output = await this.ticketBusiness.getAllTickets(
        input
      );
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  // --------------------------------------------------------------------
  // UPDATE TICKET
  // --------------------------------------------------------------------

  public updateTicket = async (req: Request, res: Response) => {
    try {
      const input = UpdateTicketSchema.parse({
        ticketId: req.params.id,
        type_id: req.body.type_id,
        solution: req.body.solution,
        status_id: req.body.status_id,
        analist_name: req.body.analist_name,
        analist_email: req.body.analist_email
      });

      const output = await this.ticketBusiness.updateTicket(
        input
      );
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  // --------------------------------------------------------------------
  // GET ALL STATUSES
  // --------------------------------------------------------------------

  public getAllStatus = async (req: Request, res: Response) => {
    try {
      const output = await this.ticketBusiness.getAllStatus();
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  // --------------------------------------------------------------------
  // GET ALL TYPES
  // --------------------------------------------------------------------

  public getAllTypes = async (req: Request, res: Response) => {
    try {
      const output = await this.ticketBusiness.getAllTypes();
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };
}
