// External library imports
import express from "express";

// Internal service imports
import TokenService from "../services/TokenService";
import { IdGenerator } from "../services/idGenerator";
import { HashManager } from "../services/HashManager";
import ErrorHandler from "../errors/ErrorHandler";

// Local file imports
import { TicketController } from "../controller/TicketController";
import { TicketBusiness } from "../business/TicketBusiness";
import { TicketDatabase } from "../database/TicketDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { authMiddleware } from "../middlewares/authMiddleware";
import { USER_ROLES } from "../models/User";
import { ensureAdmin } from "../middlewares/ensureAdminMiddleware";


export const ticketRouter = express.Router();

const ticketController = new TicketController(
  new TicketBusiness(
    new TicketDatabase(),
    new UserDatabase(),
    new IdGenerator(),
    new TokenService(),
    new HashManager(),
    new ErrorHandler()
  )
);

ticketRouter.post("/createTicket", authMiddleware([USER_ROLES.CLIENT, USER_ROLES.ADMIN]), ticketController.createTicket);
ticketRouter.get("/getTicket/:id", authMiddleware([USER_ROLES.CLIENT, USER_ROLES.ADMIN]), ticketController.getTicket);
ticketRouter.post("/getAllTickets", ensureAdmin(USER_ROLES.ADMIN), ticketController.getAllTickets);
ticketRouter.patch("/updateTicket", ensureAdmin(USER_ROLES.ADMIN), ticketController.updateTicket);
ticketRouter.get("/getAllStatus", ticketController.getAllStatus);
ticketRouter.get("/getAllTypes", ticketController.getAllTypes);
