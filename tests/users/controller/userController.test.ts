import { Request, Response } from "express";
import { UserController } from "../../../src/controller/UserController";
import { UserBusiness } from "../../../src/business/UserBusiness";
import { CreateUserInputDTO } from "../../../src/dtos/users/createUser.dto";
import { LoginInputDTO } from "../../../src/dtos/users/login";
import {
  UpdateUserInputDTO,
  UpdatePasswordInputDTO,
  ToggleUserActiveStatusInputDTO,
} from "../../../src/dtos/users/updateUser.dto";
import {
  PhoneInputDTO,
  PhoneUpdateInputDTO,
  PhoneDeleteDTO,
} from "../../../src/dtos/users/phone";
import ErrorHandler from "../../../src/errors/ErrorHandler";
import logger from "../../../src/logs/logger";
import { USER_ROLES } from "../../../src/models/User";
import { NotFoundError } from "../../../src/errors/Errors";

const mockUserBusiness = {
  createUser: jest.fn(),
  login: jest.fn(),
  getUserById: jest.fn(),
  getAllUsers: jest.fn(),
  editUser: jest.fn(),
  changePassword: jest.fn(),
  toggleUserActiveStatus: jest.fn(),
  addPhone: jest.fn(),
  updatePhone: jest.fn(),
  deletePhone: jest.fn(),
};

const userController = new UserController(
  mockUserBusiness as unknown as UserBusiness
);

jest.mock("../../../src/logs/logger", () => ({
  error: jest.fn(),
}));

jest.mock("../../../src/errors/ErrorHandler", () => ({
  handleError: jest.fn(),
}));

describe("UserController", () => {
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

  // --------------------------------------------------------------------

  test("should successfully create a user", async () => {
    const input: CreateUserInputDTO = {
      token: "some_token",
      personalId: "1378901234",
      entityType: "PERSONAL",
      name: "Chloe Smith",
      email: "chloe.smith@example.ca",
      password: "CanadaPass",
      birthdate: "1996-04-18",
      role: USER_ROLES.CLIENT,
      address: "101 Toronto Street",
      number: "456",
      neighborhood: "Downtown",
      city: "Toronto",
      country: "Canada",
      gender: "FEMALE",
      phones: [],
    };

    req.body = input;
    req.headers = { authorization: "some_token" };

    mockUserBusiness.createUser.mockResolvedValue({
      message: "User created successfully",
      user: {
        id: "new_id",
        name: "Chloe Smith",
        email: "chloe.smith@example.ca",
        createdAt: "2024-08-27T00:00:00.000Z",
        token: "new_token",
      },
    });

    await userController.createUser(req as Request, res as Response);

    expect(mockUserBusiness.createUser).toHaveBeenCalledWith({
      token: "some_token",
      personalId: "1378901234",
      entityType: "PERSONAL",
      name: "Chloe Smith",
      email: "chloe.smith@example.ca",
      password: "CanadaPass",
      birthdate: "1996-04-18",
      role: USER_ROLES.CLIENT,
      address: "101 Toronto Street",
      number: "456",
      neighborhood: "Downtown",
      city: "Toronto",
      country: "Canada",
      gender: "FEMALE",
      phones: [],
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      message: "User created successfully",
      user: {
        id: "new_id",
        name: "Chloe Smith",
        email: "chloe.smith@example.ca",
        createdAt: expect.any(String),
        token: "new_token",
      },
    });
  });

  // --------------------------------------------------------------------

  test("should handle errors properly in createUser", async () => {
    const error = new Error("Validation Error");

    req.headers = { authorization: "some_token" };
    req.body = {
      personalId: "1378901234",
      entityType: "PERSONAL",
      name: "Chloe Smith",
      email: "chloe.smith@example.ca",
      password: "CanadaPass",
      birthdate: "1996-04-18",
      role: USER_ROLES.CLIENT,
      address: "101 Toronto Street",
      number: "456",
      neighborhood: "Downtown",
      city: "Toronto",
      country: "Canada",
      gender: "FEMALE",
      phones: [],
    };

    mockUserBusiness.createUser.mockRejectedValue(error);

    await userController.createUser(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });

  // --------------------------------------------------------------------

  test("should successfully login", async () => {
    const input: LoginInputDTO = {
      email: "chloe.smith@example.ca",
      password: "CanadaPass",
    };

    req.body = input;
    mockUserBusiness.login.mockResolvedValue({
      token: "new_token",
    });

    await userController.login(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      token: "new_token",
    });
  });

  // --------------------------------------------------------------------

  test("should handle errors properly in login", async () => {
    const error = new Error("Login Error");

    req.body = {
      email: "chloe.smith@example.ca",
      password: "CanadaPass",
    };

    req.headers = {};

    mockUserBusiness.login.mockRejectedValue(error);

    await userController.login(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });

  // --------------------------------------------------------------------

  test("should successfully get a user by id", async () => {
    const userId = "user_id";

    const req = {
      params: { id: userId },
    } as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    mockUserBusiness.getUserById.mockResolvedValue({
      id: "user_id",
      name: "Chloe Smith",
      email: "chloe.smith@example.ca",
    });

    await userController.getUserById(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      id: "user_id",
      name: "Chloe Smith",
      email: "chloe.smith@example.ca",
    });
  });

  // --------------------------------------------------------------------

  test("should handle errors properly in getUserById", async () => {
    const error = new Error("User Not Found");
    req.params = { id: "user_id" };

    mockUserBusiness.getUserById.mockRejectedValue(error);

    await userController.getUserById(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });

  // --------------------------------------------------------------------

  test("should successfully get all users", async () => {
    mockUserBusiness.getAllUsers.mockResolvedValue([
      { id: "user_id1", name: "Chloe Smith", email: "chloe.smith@example.ca" },
      { id: "user_id2", name: "John Doe", email: "john.doe@example.ca" },
    ]);

    const req = {
      query: { q: "" },
      body: { onlyActive: true },
    } as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as Partial<Response>;

    await userController.getUsers(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.send).toHaveBeenCalledWith([
      { id: "user_id1", name: "Chloe Smith", email: "chloe.smith@example.ca" },
      { id: "user_id2", name: "John Doe", email: "john.doe@example.ca" },
    ]);
  });

  // --------------------------------------------------------------------

  test("should handle errors properly in getAllUsers", async () => {
    const error = new Error("Error Fetching Users");

    mockUserBusiness.getAllUsers.mockRejectedValue(error);

    const req = {
      query: { q: "" },
      body: { onlyActive: true },
    } as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as Partial<Response>;

    await userController.getUsers(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);

    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });

  // --------------------------------------------------------------------

  test("should successfully edit a user", async () => {
    const input: UpdateUserInputDTO = {
      userId: "user_id",
      name: "Chloe Smith Updated",
      email: "chloe.smith.updated@example.ca",
    };

    req.params = { id: "user_id" };
    req.body = input;
    mockUserBusiness.editUser.mockResolvedValue({
      message: "User updated successfully",
    });

    await userController.editUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: "User updated successfully",
    });
  });

  // --------------------------------------------------------------------

  test("should successfully change user password", async () => {
    const input: UpdatePasswordInputDTO = {
      userId: "user_id",
      email: "user_email",
      oldPassword: "OldPassword",
      newPassword: "NewPassword",
    };

    mockUserBusiness.changePassword.mockResolvedValue({
      message: "Password updated successfully",
    });

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    req.body = input;

    await userController.changePassword(req as Request, res as Response);

    expect(res.status).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith({
      message: "Password updated successfully",
    });
  });

  // --------------------------------------------------------------------

  test("should handle errors properly in changePassword", async () => {
    const error = new Error("Error Changing Password");
    mockUserBusiness.changePassword.mockRejectedValue(error);

    req.body = {
      userId: "user_id",
      email: "user_email",
      oldPassword: "OldPassword",
      newPassword: "NewPassword",
    };

    await userController.changePassword(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });

  // --------------------------------------------------------------------

  test("should successfully toggle user active status", async () => {
    const input: ToggleUserActiveStatusInputDTO = {
      email: "chloe.smith@example.ca",
      password: "CanadaPass",
    };

    req.params = { id: "user_id" };
    req.body = input;
    mockUserBusiness.toggleUserActiveStatus.mockResolvedValue({
      message: "User active status updated successfully",
    });

    await userController.toggleUserActiveStatus(
      req as Request,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: "User active status updated successfully",
    });
  });

  // --------------------------------------------------------------------

  test("should handle errors properly in toggleUserActiveStatus", async () => {
    const error = new Error("Error Updating Active Status");
    mockUserBusiness.toggleUserActiveStatus.mockRejectedValue(error);

    req.body = {
      email: "user@example.com",
      password: "password123",
    };

    await userController.toggleUserActiveStatus(
      req as Request,
      res as Response
    );

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });

  // --------------------------------------------------------------------

  test("should successfully add a phone to a user", async () => {
    const input: PhoneInputDTO = {
      userId: "user_id",
      number: "1234567890",
      type: "MOBILE",
    };

    req.body = input;
    mockUserBusiness.addPhone.mockResolvedValue({
      message: "Phone added successfully",
    });

    await userController.addPhone(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Phone added successfully",
    });
  });

  // --------------------------------------------------------------------

  test("should handle errors properly in addPhone", async () => {
    const error = new Error("Error Adding Phone");
    mockUserBusiness.addPhone.mockRejectedValue(error);

    req.body = {
      userId: "user_id",
      number: "1234567890",
      type: "MOBILE",
    };

    await userController.addPhone(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });

  // --------------------------------------------------------------------

  test("should successfully update a phone for a user", async () => {
    const input: PhoneUpdateInputDTO = {
      userId: "user_id",
      phoneId: "phone_id",
      number: "0987654321",
      type: "HOME",
    };

    req.body = input;
    mockUserBusiness.updatePhone.mockResolvedValue({
      message: "Phone updated successfully",
    });

    await userController.updatePhone(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Phone updated successfully",
    });
  });

  // --------------------------------------------------------------------

  test("should handle errors properly in updatePhone", async () => {
    const input: PhoneUpdateInputDTO = {
      userId: "non_existent_user_id",
      phoneId: "phone_id",
      number: "0987654321",
      type: "HOME",
    };

    req.body = input;

    mockUserBusiness.updatePhone.mockRejectedValue(
      new NotFoundError("User not found")
    );

    await userController.updatePhone(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(
      new NotFoundError("User not found")
    );
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(
      new NotFoundError("User not found"),
      res
    );
  });

  // --------------------------------------------------------------------

  test("should successfully delete a phone from a user", async () => {
    const input: PhoneDeleteDTO = {
      userId: "user_id",
      phoneId: "phone_id",
    };

    req.body = input;
    mockUserBusiness.deletePhone.mockResolvedValue({
      message: "Phone deleted successfully",
    });

    await userController.deletePhone(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Phone deleted successfully",
    });
  });

  // --------------------------------------------------------------------

  test("should handle errors properly in deletePhone", async () => {
    const input: PhoneDeleteDTO = {
      userId: "user_id",
      phoneId: "phone_id",
    };

    req.body = input;
    const error = new Error("Error Deleting Phone");
    mockUserBusiness.deletePhone.mockRejectedValue(error);

    await userController.deletePhone(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });
});
