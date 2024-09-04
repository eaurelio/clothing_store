import { UserBusiness } from "../../../src/business/UserBusiness";
import { UserDatabase } from "../../../src/database/UserDatabase";
import { IdGenerator } from "../../../src/services/idGenerator";
import { NotFoundError, ForbiddenError } from "../../../src/errors/Errors";

const mockUserDatabase = {
  findUserById: jest.fn(),
  insertPhone: jest.fn(),
  findPhoneById: jest.fn(),
};

const mockIdGenerator = {
  generate: jest.fn(),
};

const userBusiness = new UserBusiness(
  mockUserDatabase as unknown as UserDatabase,
  mockIdGenerator as unknown as IdGenerator,
  {} as any,
  {} as any,
  {} as any
);

describe("UserBusiness - addPhone", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should successfully add a phone to an active user", async () => {
    const input = {
      userId: "existing_user_id",
      number: "1234567890",
      type: "HOME",
    };

    const mockPhoneId = "generated_phone_id";
    const mockPhoneData = {
      phone_id: mockPhoneId,
      user_id: "existing_user_id",
      number: "1234567890",
      type: "HOME",
    };

    mockUserDatabase.findUserById.mockResolvedValue({
      id: "existing_user_id",
      active: true,
    });
    mockIdGenerator.generate.mockResolvedValue(mockPhoneId);
    mockUserDatabase.insertPhone.mockResolvedValue({});
    mockUserDatabase.findPhoneById.mockResolvedValue(mockPhoneData);

    const result = await userBusiness.addPhone(input);

    expect(result).toEqual({
      message: "Phone added successfully",
      phones: [mockPhoneData],
    });
    expect(mockUserDatabase.insertPhone).toHaveBeenCalledWith(mockPhoneData);
    expect(mockUserDatabase.findPhoneById).toHaveBeenCalledWith(mockPhoneId);
  });

  test("should throw NotFoundError if user does not exist", async () => {
    const input = {
      userId: "non_existing_user_id",
      number: "1234567890",
      type: "HOME",
    };

    mockUserDatabase.findUserById.mockResolvedValue(null);

    await expect(userBusiness.addPhone(input)).rejects.toThrow(NotFoundError);
  });

  test("should throw ForbiddenError if user account is deactivated", async () => {
    const input = {
      userId: "existing_user_id",
      number: "1234567890",
      type: "HOME",
    };

    mockUserDatabase.findUserById.mockResolvedValue({
      id: "existing_user_id",
      active: false,
    });

    await expect(userBusiness.addPhone(input)).rejects.toThrow(ForbiddenError);
  });

  test("should throw NotFoundError if phone data cannot be retrieved after insertion", async () => {
    const input = {
      userId: "existing_user_id",
      number: "1234567890",
      type: "HOME",
    };

    const mockPhoneId = "generated_phone_id";

    mockUserDatabase.findUserById.mockResolvedValue({
      id: "existing_user_id",
      active: true,
    });
    mockIdGenerator.generate.mockResolvedValue(mockPhoneId);
    mockUserDatabase.insertPhone.mockResolvedValue({});
    mockUserDatabase.findPhoneById.mockResolvedValue(null); // Phone not found

    await expect(userBusiness.addPhone(input)).rejects.toThrow(NotFoundError);
  });
});
