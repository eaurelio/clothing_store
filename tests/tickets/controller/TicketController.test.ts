import { Request, Response } from "express";
import { TicketController } from "../../../src/controller/TicketController";
import { TicketBusiness } from "../../../src/business/TicketBusiness";
import {
  CreateTicketInputDTO,
  CreateTicketOutputDTO,
} from "../../../src/dtos/tickets/createTicketDTO";
import {
  GetTicketInputDTO,
  GetTicketOutputDTO,
  GetAllTicketsInputDTO,
  GetAllTicketsOutputDTO,
} from "../../../src/dtos/tickets/getTicketDTO";
import {
  UpdateTicketInputDTO,
  UpdateTicketOutputDTO,
} from "../../../src/dtos/tickets/updateTicketDTO";
import ErrorHandler from "../../../src/errors/ErrorHandler";
import logger from "../../../src/logs/logger";

const mockTicketBusiness = {
  createTicket: jest.fn(),
  getTicketById: jest.fn(),
  updateTicket: jest.fn(),
  getAllTickets: jest.fn(),
};

const ticketController = new TicketController(
  mockTicketBusiness as unknown as TicketBusiness
);

jest.mock("../../../src/logs/logger", () => ({
  error: jest.fn(),
}));

jest.mock("../../../src/errors/ErrorHandler", () => ({
  handleError: jest.fn(),
}));

describe("TicketController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test("should successfully create a ticket", async () => {
    const input: CreateTicketInputDTO = {
      userId: "user_id",
      typeId: 1,
      description: "Ticket Description",
      userName: "User Name",
      userEmail: "user@example.com",
      userPhoneNumber: "1234567890",
    };

    const output: CreateTicketOutputDTO = {
      message: "Ticket created successfully",
      ticket: {
        id: "ticket_id",
        user_id: "user_id",
        type_id: 1,
        description: "Ticket Description",
        status_id: 1,
        user_name: "User Name",
        user_email: "user@example.com",
        user_phone_number: "1234567890",
        created_at: "2024-08-21T23:22:27.898Z",
        updated_at: "2024-08-21T23:22:27.898Z",
      },
    };

    mockTicketBusiness.createTicket.mockResolvedValue(output);

    req.body = input;
    req.headers = {
      authorization: "Bearer some-token",
    };

    await ticketController.createTicket(req as Request, res as Response);

    expect(mockTicketBusiness.createTicket).toHaveBeenCalledWith(input);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(output);
  });

  test("should handle errors properly in createTicket", async () => {
    const error = new Error("Validation Error");

    req.body = {
      userId: "user_id",
      typeId: 1,
      description: "Ticket Description",
      statusId: 2,
      userName: "User Name",
      userEmail: "user@example.com",
      userPhoneNumber: "1234567890",
    };

    mockTicketBusiness.createTicket.mockRejectedValue(error);

    await ticketController.createTicket(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });

  test("should successfully get a ticket", async () => {
    const input: GetTicketInputDTO = {
      ticketId: "ticket_id",
    };

    const output: GetTicketOutputDTO = {
      ticketId: "ticket_id",
      userId: "user_id",
      typeId: 1,
      statusId: 2,
      description: "Ticket Description",
      solution: "Solution Description",
      analistName: "Analist Name",
      analistEmail: "analist@example.com",
      createdAt: "2024-08-21T23:22:27.898Z",
      updatedAt: "2024-08-22T23:22:27.898Z",
    };

    mockTicketBusiness.getTicketById.mockResolvedValue(output);

    req.params = {
      id: "ticket_id",
    };

    req.headers = {
      authorization: "Bearer some-token",
    };

    await ticketController.getTicketById(req as Request, res as Response);

    expect(mockTicketBusiness.getTicketById).toHaveBeenCalledWith(input);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(output);
  });

  test("should handle errors properly in getTicket", async () => {
    const error = new Error("Error Getting Ticket");

    mockTicketBusiness.getTicketById.mockRejectedValue(error);

    req.params = {
      id: "ticket_id",
    };

    req.headers = {
      authorization: "Bearer some-token",
    };

    await ticketController.getTicketById(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });

  test("should successfully update a ticket", async () => {
    const input: UpdateTicketInputDTO = {
      ticketId: "ticket_id",
      typeId: 2,
      solution: "Updated Solution",
      statusId: 3,
      analistName: "Updated Analist Name",
      analistEmail: "updated.analist@example.com",
    };

    const output: UpdateTicketOutputDTO = {
      message: "Ticket updated successfully",
      ticket: {
        id: "ticket_id",
        user_id: "user_id",
        type_id: 2,
        description: "Ticket Description",
        solution: "Updated Solution",
        status_id: 3,
        user_name: "User Name",
        user_email: "user@example.com",
        user_phone_number: "1234567890",
        analist_name: "Updated Analist Name",
        analist_email: "updated.analist@example.com",
        created_at: "2024-08-21T23:22:27.898Z",
        updated_at: "2024-08-22T23:22:27.898Z",
      },
    };

    req.body = input;

    mockTicketBusiness.updateTicket.mockResolvedValue(output);

    await ticketController.updateTicket(req as Request, res as Response);

    expect(mockTicketBusiness.updateTicket).toHaveBeenCalledWith(input);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(output);
  });

  test("should handle errors properly in updateTicket", async () => {
    const error = new Error("Error Updating Ticket");

    req.body = {
      ticketId: "ticket_id",
      type_id: 2,
    };

    mockTicketBusiness.updateTicket.mockRejectedValue(error);

    await ticketController.updateTicket(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });

  test("should successfully get all tickets", async () => {
    const input: GetAllTicketsInputDTO = {
      statusId: 2,
    };

    const output: GetAllTicketsOutputDTO = {
      tickets: [
        {
          ticketId: "ticket_id_1",
          userId: "user_id_1",
          typeId: 1,
          statusId: 2,
          createdAt: "2024-08-21T23:22:27.898Z",
          updatedAt: "2024-08-22T23:22:27.898Z",
          description: "Description 1",
          solution: "Solution 1",
          analistName: "Analist Name 1",
          analistEmail: "analist1@example.com",
        },
        {
          ticketId: "ticket_id_2",
          userId: "user_id_2",
          typeId: 1,
          statusId: 2,
          createdAt: "2024-08-22T23:22:27.898Z",
          updatedAt: "2024-08-23T23:22:27.898Z",
          description: "Description 2",
          solution: "Solution 2",
          analistName: "Analist Name 2",
          analistEmail: "analist2@example.com",
        },
      ],
      total: 2,
    };

    mockTicketBusiness.getAllTickets.mockResolvedValue(output);

    req.body = {
      statusId: 2,
    };

    req.headers = {
      authorization: "Bearer some-token",
    };

    await ticketController.getAllTickets(req as Request, res as Response);

    expect(mockTicketBusiness.getAllTickets).toHaveBeenCalledWith(input);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(output);
  });
});
