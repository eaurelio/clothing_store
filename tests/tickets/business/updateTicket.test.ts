import { TicketBusiness } from "../../../src/business/TicketBusiness";
import { TicketDatabase } from "../../../src/database/TicketDatabase";
import { IdGenerator } from "../../../src/services/idGenerator";
import {
  UpdateTicketInputDTO,
  UpdateTicketOutputDTO,
} from "../../../src/dtos/tickets/updateTicketDTO";
import { TicketDB } from "../../../src/models/Ticket";
import { NotFoundError } from "../../../src/errors/Errors";

const mockTicketDatabase = {
  findTicketById: jest.fn(),
  updateTicket: jest.fn(),
};

const mockUserDatabase = {};
const mockIdGenerator = {};
const mockTokenService = {};
const mockHashManager = {};
const mockErrorHandler = {};

const ticketBusiness = new TicketBusiness(
  mockTicketDatabase as unknown as TicketDatabase,
  mockUserDatabase as any,
  mockIdGenerator as unknown as IdGenerator,
  mockTokenService as any,
  mockHashManager as any,
  mockErrorHandler as any
);

describe("TicketBusiness - updateTicket", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should update a ticket successfully", async () => {
    const input: UpdateTicketInputDTO = {
      ticketId: "ticket_id_1",
      typeId: 2,
      solution: "Updated solution",
      statusId: 3,
      analistName: "Chloe Smith",
      analistEmail: "chloe.smith@example.ci",
    };

    const existingTicketDB: TicketDB = {
      id: "ticket_id_1",
      user_id: "user_id_1",
      type_id: 1,
      description: "Original description",
      status_id: 1,
      user_name: "John Doe",
      user_email: "johndoe@example.com",
      user_phone_number: "123456789",
      created_at: "2024-08-24T00:00:00.000Z",
      updated_at: "2024-08-24T00:00:00.000Z",
    };

    const updatedTicketDB: Partial<TicketDB> = {
      id: "ticket_id_1",
      type_id: 2,
      solution: "Updated solution",
      status_id: 3,
      analist_name: "Chloe Smith",
      analist_email: "chloe.smith@example.ci",
      updated_at: expect.any(String),
    };

    const expectedOutput: UpdateTicketOutputDTO = {
      message: "Ticket updated successfully",
      ticket: { ...existingTicketDB, ...updatedTicketDB },
    };

    mockTicketDatabase.findTicketById.mockResolvedValue(existingTicketDB);
    mockTicketDatabase.updateTicket.mockResolvedValue(undefined);

    const result = await ticketBusiness.updateTicket(input);

    expect(result).toEqual(expectedOutput);
    expect(mockTicketDatabase.findTicketById).toHaveBeenCalledWith(
      input.ticketId
    );
    expect(mockTicketDatabase.updateTicket).toHaveBeenCalledWith(
      updatedTicketDB
    );
  });

  test("should throw NotFoundError if ticket is not found", async () => {
    const input: UpdateTicketInputDTO = {
      ticketId: "non_existing_ticket_id",
      typeId: 2,
      solution: "Updated solution",
      statusId: 3,
      analistName: "Chloe Smith",
      analistEmail: "chloe.smith@example.ci",
    };

    mockTicketDatabase.findTicketById.mockResolvedValue(null);

    await expect(ticketBusiness.updateTicket(input)).rejects.toThrowError(
      new NotFoundError("Ticket not found")
    );

    expect(mockTicketDatabase.findTicketById).toHaveBeenCalledWith(
      input.ticketId
    );
    expect(mockTicketDatabase.updateTicket).not.toHaveBeenCalled();
  });
});
