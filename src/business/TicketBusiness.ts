import { IdGenerator } from "../services/idGenerator";

import { TicketDatabase } from "../database/TicketDatabase";

import { Ticket, TicketDB } from "../models/Ticket";
import { TicketStatusDB, TicketTypeDB } from "../models/Ticket";

import {
  CreateTicketInputDTO,
  CreateTicketOutputDTO,
} from "../dtos/tickets/createTicketDTO";
import {
  UpdateTicketInputDTO,
  UpdateTicketOutputDTO,
} from "../dtos/tickets/updateTicketDTO";
import {
  GetTicketInputDTO,
  GetTicketOutputDTO,
  GetAllTicketsInputDTO,
  GetAllTicketsOutputDTO,
} from "../dtos/tickets/getTicketDTO";

import { NotFoundError } from "../errors/Errors";
import { UserDatabase } from "../database/UserDatabase";
import TokenService from "../services/TokenService";
import { HashManager } from "../services/HashManager";
import ErrorHandler from "../errors/ErrorHandler";

export class TicketBusiness {
  constructor(
    private ticketDatabase: TicketDatabase,
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenService: TokenService,
    private hashManager: HashManager,
    private errorHandler: ErrorHandler
  ) {}

  public async createTicket(
    input: CreateTicketInputDTO
  ): Promise<CreateTicketOutputDTO> {
    const {
      userId,
      typeId,
      description,
      userName,
      userEmail,
      userPhoneNumber,
    } = input;

    const id = this.idGenerator.generate();
    const created_at = new Date().toISOString();
    const updated_at = created_at;
    const statusId = 1;

    const newTicket = new Ticket(
      id,
      userId,
      typeId,
      description,
      statusId,
      userName,
      userEmail,
      userPhoneNumber,
      created_at,
      updated_at
    );

    const newTicketDB: TicketDB = {
      id: newTicket.getId(),
      user_id: newTicket.getUserId(),
      type_id: newTicket.getTypeId(),
      description: newTicket.getDescription(),
      status_id: newTicket.getStatusId(),
      user_name: newTicket.getName(),
      user_email: newTicket.getEmail(),
      user_phone_number: newTicket.getPhoneNumber(),
      created_at: newTicket.getCreatedAt(),
      updated_at: newTicket.getUpdatedAt(),
    };

    await this.ticketDatabase.insertTicket(newTicketDB);

    const output: CreateTicketOutputDTO = {
      message: "Ticket created successfully",
      ticket: newTicketDB,
    };

    return output;
  }

  public async getTicket(
    input: GetTicketInputDTO
  ): Promise<GetTicketOutputDTO> {
    const { ticketId } = input;

    const ticketDB = await this.ticketDatabase.findTicketById(ticketId);
    if (!ticketDB) {
      throw new NotFoundError("Ticket not found");
    }

    const output: GetTicketOutputDTO = {
      ticketId: ticketDB.id,
      userId: ticketDB.user_id,
      typeId: ticketDB.type_id,
      statusId: ticketDB.status_id,
      description: ticketDB.description,
      solution: ticketDB.solution,
      analistName: ticketDB.analist_name,
      analistEmail: ticketDB.analist_email,
      createdAt: ticketDB.created_at,
      updatedAt: ticketDB.updated_at,
    };

    return output;
  }

  public async getAllTickets(
    input: GetAllTicketsInputDTO
  ): Promise<GetAllTicketsOutputDTO> {
    const { id, userId, typeId, statusId } = input;

    const ticketsDB = await this.ticketDatabase.findTickets(
      id,
      userId,
      typeId,
      statusId
    );

    const tickets = ticketsDB.map((ticket) => ({
      ticketId: ticket.id,
      userId: ticket.user_id,
      typeId: ticket.type_id,
      typeName: ticket.type_name,
      statusId: ticket.status_id,
      statusName: ticket.status_name,
      description: ticket.description,
      name: ticket.name,
      email: ticket.email,
      solution: ticket.solution,
      analist_name: ticket.analist_name,
      analist_email: ticket.analist_email,
      createdAt: ticket.created_at,
      updatedAt: ticket.updated_at,
    }));

    const output: GetAllTicketsOutputDTO = {
      tickets,
      total: ticketsDB.length,
    };

    return output;
  }

  public async updateTicket(
    input: UpdateTicketInputDTO
  ): Promise<UpdateTicketOutputDTO> {
    const { ticketId, typeId, solution, statusId, analistName, analistEmail } =
      input;

    const ticketDB = await this.ticketDatabase.findTicketById(ticketId);
    if (!ticketDB) {
      throw new NotFoundError("Ticket not found");
    }

    const updatedTicketDB: Partial<TicketDB> = {
      id: ticketId,
      type_id: typeId ?? ticketDB.type_id,
      solution: solution ?? ticketDB.solution,
      status_id: statusId ?? ticketDB.status_id,
      analist_name: analistName ?? ticketDB.analist_name,
      analist_email: analistEmail ?? ticketDB.analist_email,
      updated_at: new Date().toISOString(),
    };

    await this.ticketDatabase.updateTicket(updatedTicketDB);

    const output: UpdateTicketOutputDTO = {
      message: "Ticket updated successfully",
      ticket: { ...ticketDB, ...updatedTicketDB },
    };

    return output;
  }

  public async getAllStatus(): Promise<TicketStatusDB[]> {
    const statuses = await this.ticketDatabase.getAllStatus();
    return statuses;
  }

  public async getAllTypes(): Promise<TicketTypeDB[]> {
    const types = await this.ticketDatabase.getAllTypes();
    return types;
  }
}
