// Services
import { IdGenerator } from "../services/idGenerator";

// Database
import { TicketDatabase } from "../database/TicketDatabase";

// Models
import { Ticket, TicketDB } from "../models/Ticket";
import { TicketStatusDB, TicketTypeDB } from "../models/Ticket";

// DTOs
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

// Errors
import { UnauthorizedError, NotFoundError, ConflictError } from "../errors/Errors";
import { UserDatabase } from "../database/UserDatabase";
import TokenService from "../services/TokenService";
import { HashManager } from "../services/HashManager";
import { ErrorHandler } from "../errors/ErrorHandler";

export class TicketBusiness {
  constructor(
    private ticketDatabase: TicketDatabase,
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenService: TokenService,
    private hashManager: HashManager,
    private errorHandler: ErrorHandler

  ) {}

  // --------------------------------------------------------------------
  // TICKETS
  // --------------------------------------------------------------------

  public createTicket = async (
    input: CreateTicketInputDTO
  ): Promise<CreateTicketOutputDTO> => {
    const { user_id, type_id, description, status_id, name, email, phone_number } = input;

    const id = this.idGenerator.generate();
    const created_at = new Date().toISOString();
    const updated_at = created_at;

    const newTicket = new Ticket(
      id,
      user_id,
      type_id,
      description,
      status_id,
      name,
      email,
      phone_number,
      created_at,
      updated_at
    );

    const newTicketDB: TicketDB = {
      id: newTicket.getId(),
      user_id: newTicket.getUserId(),
      type_id: newTicket.getTypeId(),
      description: newTicket.getDescription(),
      status_id: newTicket.getStatusId(),
      name: newTicket.getName(),
      email: newTicket.getEmail(),
      phone_number: newTicket.getPhoneNumber(),
      created_at: newTicket.getCreatedAt(),
      updated_at: newTicket.getUpdatedAt(),
    };

    await this.ticketDatabase.insertTicket(newTicketDB);

    const output: CreateTicketOutputDTO = {
      message: "Ticket created successfully",
      ticket: newTicketDB,
    };

    return output;
  };

  // --------------------------------------------------------------------

  public getTicket = async (
    input: GetTicketInputDTO
  ): Promise<GetTicketOutputDTO> => {
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
      createdAt: ticketDB.created_at,
      updatedAt: ticketDB.updated_at,
      description: ticketDB.description
    };

    return output;
  };

  // --------------------------------------------------------------------

  public getAllTickets = async (
    input: GetAllTicketsInputDTO
): Promise<GetAllTicketsOutputDTO> => {
    const { id, userId, typeId, statusId } = input;

    const ticketsDB = await this.ticketDatabase.findTickets(id, userId, typeId, statusId);

    const tickets = ticketsDB.map(ticket => ({
        ticketId: ticket.id,
        userId: ticket.user_id,
        typeId: ticket.type_id,
        statusId: ticket.status_id,
        createdAt: ticket.created_at,
        updatedAt: ticket.updated_at,
        description: ticket.description,
    }));

    const output: GetAllTicketsOutputDTO = {
        tickets,
        total: ticketsDB.length,
    };

    return output;
};


  // --------------------------------------------------------------------

  public updateTicket = async (
    input: UpdateTicketInputDTO
  ): Promise<UpdateTicketOutputDTO> => {
    const { ticketId, type_id, description, status_id, name, email, phone_number } = input;

    const ticketDB = await this.ticketDatabase.findTicketById(ticketId);
    if (!ticketDB) {
      throw new NotFoundError("Ticket not found");
    }

    const updatedTicketDB: TicketDB = {
      ...ticketDB,
      type_id: type_id ?? ticketDB.type_id,
      description: description ?? ticketDB.description,
      status_id: status_id ?? ticketDB.status_id,
      name: name ?? ticketDB.name,
      email: email ?? ticketDB.email,
      phone_number: phone_number ?? ticketDB.phone_number,
      updated_at: new Date().toISOString(),
    };

    await this.ticketDatabase.updateTicket(ticketId, updatedTicketDB);

    const output: UpdateTicketOutputDTO = {
      message: "Ticket updated successfully",
      ticket: updatedTicketDB,
    };

    return output;
  };

  // --------------------------------------------------------------------
  // AUX FIELDS - TICKETS
  // --------------------------------------------------------------------

  public getAllStatus = async (): Promise<TicketStatusDB[]> => {
    const statuses = await this.ticketDatabase.getAllStatuses();
    return statuses;
  };

  public getAllTypes = async (): Promise<TicketTypeDB[]> => {
    const types = await this.ticketDatabase.getAllTypes();
    return types;
  };
}
