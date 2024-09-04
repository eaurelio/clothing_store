import { UserBusiness } from "../../../src/business/UserBusiness";
import { UserDatabase } from "../../../src/database/UserDatabase";
import { HashManager } from "../../../src/services/HashManager";
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "../../../src/errors/Errors";

const mockUserDatabase = {
  findUserById: jest.fn(),
  updatePassword: jest.fn(),
};

const mockHashManager = {
  compare: jest.fn(),
  hash: jest.fn(),
};

const userBusiness = new UserBusiness(
  mockUserDatabase as unknown as UserDatabase,
  {} as any,
  {} as any,
  mockHashManager as unknown as HashManager,
  {} as any
);

describe("UserBusiness - changePassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should successfully change the password", async () => {
    const input = {
      userId: "existing_user_id",
      email: "user@example.com",
      oldPassword: "OldPass123",
      newPassword: "NewPass123",
    };

    mockUserDatabase.findUserById.mockResolvedValue({
      id: "existing_user_id",
      email: "user@example.com",
      password: "hashed_old_password",
      active: true,
    });
    mockHashManager.compare
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);
    mockHashManager.hash.mockResolvedValue("hashed_new_password");
    mockUserDatabase.updatePassword.mockResolvedValue({});

    const result = await userBusiness.changePassword(input);

    expect(result).toEqual({
      message: "Password updated successfully",
    });
    expect(mockUserDatabase.updatePassword).toHaveBeenCalledWith(
      "existing_user_id",
      "hashed_new_password"
    );
  });

  test("should throw NotFoundError if user does not exist", async () => {
    const input = {
      userId: "non_existing_user_id",
      email: "user@example.com",
      oldPassword: "OldPass123",
      newPassword: "NewPass123",
    };

    mockUserDatabase.findUserById.mockResolvedValue(null);

    await expect(userBusiness.changePassword(input)).rejects.toThrow(
      NotFoundError
    );
  });

  test("should throw ForbiddenError if user account is deactivated", async () => {
    const input = {
      userId: "existing_user_id",
      email: "user@example.com",
      oldPassword: "OldPass123",
      newPassword: "NewPass123",
    };

    mockUserDatabase.findUserById.mockResolvedValue({
      id: "existing_user_id",
      email: "user@example.com",
      password: "hashed_old_password",
      active: false,
    });

    await expect(userBusiness.changePassword(input)).rejects.toThrow(
      ForbiddenError
    );
  });

  test("should throw BadRequestError if email does not match", async () => {
    const input = {
      userId: "existing_user_id",
      email: "different_email@example.com",
      oldPassword: "OldPass123",
      newPassword: "NewPass123",
    };

    mockUserDatabase.findUserById.mockResolvedValue({
      id: "existing_user_id",
      email: "user@example.com",
      password: "hashed_old_password",
      active: true,
    });

    await expect(userBusiness.changePassword(input)).rejects.toThrow(
      BadRequestError
    );
  });

  test("should throw BadRequestError if old password is incorrect", async () => {
    const input = {
      userId: "existing_user_id",
      email: "user@example.com",
      oldPassword: "WrongOldPass",
      newPassword: "NewPass123",
    };

    mockUserDatabase.findUserById.mockResolvedValue({
      id: "existing_user_id",
      email: "user@example.com",
      password: "hashed_old_password",
      active: true,
    });
    mockHashManager.compare.mockResolvedValueOnce(false);

    await expect(userBusiness.changePassword(input)).rejects.toThrow(
      BadRequestError
    );
  });

  test("should throw BadRequestError if new password is the same as old password", async () => {
    const input = {
      userId: "existing_user_id",
      email: "user@example.com",
      oldPassword: "OldPass123",
      newPassword: "OldPass123",
    };

    mockUserDatabase.findUserById.mockResolvedValue({
      id: "existing_user_id",
      email: "user@example.com",
      password: "hashed_old_password",
      active: true,
    });
    mockHashManager.compare
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true);

    await expect(userBusiness.changePassword(input)).rejects.toThrow(
      BadRequestError
    );
  });
});
