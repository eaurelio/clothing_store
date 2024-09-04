import { TicketBusiness } from "../../../src/business/TicketBusiness";
import { TicketDatabase } from "../../../src/database/TicketDatabase";
import { IdGenerator } from "../../../src/services/idGenerator";
import {
  CreateTicketInputDTO,
  CreateTicketOutputDTO,
} from "../../../src/dtos/tickets/createTicketDTO";
import { TicketDB } from "../../../src/models/Ticket";

const mockTicketDatabase = {
  insertTicket: jest.fn(),
};

const mockUserDatabase = {};
const mockIdGenerator = {
  generate: jest.fn(() => "new_ticket_id"),
};

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

describe("TicketBusiness - createTicket", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create a ticket successfully", async () => {
    const input: CreateTicketInputDTO = {
      userId: "user_id_1",
      typeId: 1,
      description: "Test ticket description",
      userName: "Chloe Smith",
      userEmail: "chloe.smith@example.ci",
      userPhoneNumber: "123456789",
    };

    const expectedTicketDB: TicketDB = {
      id: "new_ticket_id",
      user_id: "user_id_1",
      type_id: 1,
      description: "Test ticket description",
      status_id: 1,
      user_name: "Chloe Smith",
      user_email: "chloe.smith@example.ci",
      user_phone_number: "123456789",
      created_at: expect.any(String),
      updated_at: expect.any(String),
    };

    const expectedOutput: CreateTicketOutputDTO = {
      message: "Ticket created successfully",
      ticket: expectedTicketDB,
    };

    const result = await ticketBusiness.createTicket(input);

    expect(result).toEqual(expectedOutput);
    expect(mockIdGenerator.generate).toHaveBeenCalledTimes(1);
    expect(mockTicketDatabase.insertTicket).toHaveBeenCalledWith(
      expectedTicketDB
    );
  });
});
