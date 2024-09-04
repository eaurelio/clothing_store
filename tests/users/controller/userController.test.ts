import { Request, Response } from "express";
import { UserController } from "../../../src/controller/UserController";
import { UserBusiness } from "../../../src/business/UserBusiness";
import { EntityType, USER_ROLES } from "../../../src/models/User";
import ErrorHandler from "../../../src/errors/ErrorHandler";
import logger from "../../../src/logs/logger";
import { LoginInputDTO } from "../../../src/dtos/users/login";
import {
  ToggleUserActiveStatusInputDTO,
  UpdatePasswordInputDTO,
  UpdateUserInputDTO,
} from "../../../src/dtos/users/updateUser.dto";

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

  test("should handle errors properly in createUser", async () => {
    const error = new Error("Validation Error");

    req.headers = { authorization: "some_token" };
    req.body = {
      personalId: "1378901234",
      entityType: EntityType.PERSONAL,
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

  test("should successfully login", async () => {
    const input: LoginInputDTO = {
      email: "chloe.smith@example.ca",
      password: "CanadaPass",
    };

    const output = {
      message: "Login successful",
      user: {
        id: "user_id",
        name: "Chloe Smith",
        email: "chloe.smith@example.ca",
        createdAt: "2024-08-27T00:00:00.000Z",
        token: "login_token",
      },
    };

    req.body = input;
    mockUserBusiness.login.mockResolvedValue(output);

    await userController.login(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(output);
  });

  test("should handle errors properly in login", async () => {
    const error = new Error("Login Error");

    req.body = {
      email: "chloe.smith@example.ca",
      password: "CanadaPass",
    };

    mockUserBusiness.login.mockRejectedValue(error);

    await userController.login(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });

  test("should successfully get a user by id", async () => {
    const userId = "user_id";

    req.params = { id: userId };

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

  test("should handle errors properly in getUserById", async () => {
    const error = new Error("User Not Found");
    req.params = { id: "user_id" };

    mockUserBusiness.getUserById.mockRejectedValue(error);

    await userController.getUserById(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });

  test("should handle errors properly in getAllUsers", async () => {
    const error = new Error("Error Fetching Users");

    mockUserBusiness.getAllUsers.mockRejectedValue(error);

    req.query = { q: "" };
    req.body = { onlyActive: true };

    await userController.getUsers(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });

  test("should successfully get all users", async () => {
    const mockUsers = [
      {
        id: "8603cc1b-d667-4f4f-a5ec-989c403e560f",
        personal_id: "2218345067",
        entity_type: "BUSINESS",
        name: "Sophia Martinez",
        gender_id: 2,
        gender: "Female",
        email: "sophia.martinez@business.com",
        role: "ADMIN",
        created_at: "2024-08-21T23:36:30.917Z",
        birthdate: "1985-03-12T03:00:00.000Z",
        address: "456 Business Avenue",
        number: "102",
        neighborhood: "Downtown",
        city: "Madrid",
        country: "Spain",
        active: true,
        last_login: null,
        phones: [
          {
            phone_id: "ce5173e6-f0f4-4328-946a-c2cade027e1e",
            user_id: "8603cc1b-d667-4f4f-a5ec-989c403e560f",
            number: "+34-600-123-456",
            type: "Mobile",
          },
          {
            phone_id: "972f2b2c-4bd2-493b-8730-8be229db0358",
            user_id: "8603cc1b-d667-4f4f-a5ec-989c403e560f",
            number: "+34-601-987-654",
            type: "Work",
          },
        ],
      },
      {
        id: "26315a23-2db7-4969-8f76-b975a5bcc5b6",
        personal_id: "4412789654",
        entity_type: "BUSINESS",
        name: "Hannah Kim",
        gender_id: 2,
        gender: "Female",
        email: "hannah.kim@company.co.kr",
        role: "CLIENT",
        created_at: "2024-08-21T23:36:53.972Z",
        birthdate: "1980-11-30T03:00:00.000Z",
        address: "101 Seoul Road",
        number: "75",
        neighborhood: "Gangnam",
        city: "Seoul",
        country: "South Korea",
        active: true,
        last_login: null,
        phones: [
          {
            phone_id: "86fcc4c7-5c81-4c02-b712-0a6d5336f68a",
            user_id: "26315a23-2db7-4969-8f76-b975a5bcc5b6",
            number: "+82-2-345-6789",
            type: "Mobile",
          },
          {
            phone_id: "45df67f6-b195-4e37-9138-03e94fd16ee8",
            user_id: "26315a23-2db7-4969-8f76-b975a5bcc5b6",
            number: "+82-2-987-6543",
            type: "Work",
          },
        ],
      },
    ];

    mockUserBusiness.getAllUsers.mockResolvedValue(mockUsers);

    req.query = { q: "" };
    req.body = { onlyActive: true };

    await userController.getUsers(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(mockUsers);
  });

  test("should successfully edit a user", async () => {
    const input: UpdateUserInputDTO = {
      userId: "user_id",
      name: "Chloe Smith Updated",
      email: "chloe.smith.updated@example.ca",
    };

    req.params = { id: "user_id" };
    req.body = input;

    mockUserBusiness.editUser.mockResolvedValue({
      message: "Editing completed successfully",
      user: {
        userId: "3e3d2458-9de7-4f5a-b56b-8f35732e7380",
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        createdAt: "2024-09-04T05:48:21.359Z",
      },
    });

    await userController.editUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: "Editing completed successfully",
      user: {
        userId: "3e3d2458-9de7-4f5a-b56b-8f35732e7380",
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        createdAt: "2024-09-04T05:48:21.359Z",
      },
    });
  });

  test("should successfully change user password", async () => {
    const input: UpdatePasswordInputDTO = {
      userId: "user_id",
      email: "user_email",
      oldPassword: "OldPassword",
      newPassword: "NewPassword",
    };

    req.body = input;
    mockUserBusiness.changePassword.mockResolvedValue({
      message: "Password updated successfully",
    });

    await userController.changePassword(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: "Password updated successfully",
    });
  });

  test("should handle errors properly in changePassword", async () => {
    const error = new Error("Error Changing Password");

    req.body = {
      userId: "user_id",
      email: "user_email",
      oldPassword: "OldPassword",
      newPassword: "NewPassword",
    };

    mockUserBusiness.changePassword.mockRejectedValue(error);

    await userController.changePassword(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });

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

  test("should handle errors properly in toggleUserActiveStatus", async () => {
    const error = new Error("Error Toggling User Status");

    req.body = {
      email: "usermail@example.com",
      password: "userpassword",
    };

    mockUserBusiness.toggleUserActiveStatus.mockRejectedValue(error);

    await userController.toggleUserActiveStatus(
      req as Request,
      res as Response
    );

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });

  test("should successfully add a phone", async () => {
    const input = {
      number: "1234567890",
      type: "MOBILE",
    };

    req.params = { id: "user_id" };
    req.body = input;
    mockUserBusiness.addPhone.mockResolvedValue({
      message: "Phone added successfully",
      phones: [
        {
          phone_id: "phone_id_1",
          number: "1234567890",
          type: "MOBILE",
        },
      ],
    });

    await userController.addPhone(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      message: "Phone added successfully",
      phones: [
        {
          phone_id: "phone_id_1",
          number: "1234567890",
          type: "MOBILE",
        },
      ],
    });
  });

  test("should handle errors properly in addPhone", async () => {
    const error = new Error("Error Adding Phone");

    req.params = { id: "userId" };
    req.body = {
      number: "1234567890",
      type: "MOBILE",
    };

    mockUserBusiness.addPhone.mockRejectedValue(error);

    await userController.addPhone(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });

  test("should successfully update a phone", async () => {
    req.params = { id: "user_id" };
    req.body = {
      phoneId: "phone_id",
      number: "0987654321",
      type: "work",
    };
    mockUserBusiness.updatePhone.mockResolvedValue({
      message: "Phone updated successfully",
    });

    await userController.updatePhone(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: "Phone updated successfully",
    });
  });

  test("should handle errors properly in updatePhone", async () => {
    const error = new Error("Error Updating Phone");

    req.params = { id: "user_id" };
    req.body = {
      phoneId: "phone_id",
      number: "0987654321",
    };

    mockUserBusiness.updatePhone.mockRejectedValue(error);

    await userController.updatePhone(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });

  test("should successfully delete a phone", async () => {
    req.params = { id: "user_id" };
    req.body = {
      userId: "user_id",
      phoneId: "phone_id",
    };

    mockUserBusiness.deletePhone.mockResolvedValue({
      message: "Phone deleted successfully",
      phones: [
        {
          phone_id: "string",
          number: "string",
          type: "string",
        },
      ],
    });

    await userController.deletePhone(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: "Phone deleted successfully",
      phones: [
        {
          phone_id: "string",
          number: "string",
          type: "string",
        },
      ],
    });
  });

  test("should handle errors properly in deletePhone", async () => {
    const error = new Error("Error Deleting Phone");

    req.params = { id: "user_id" };
    req.body = {
      userId: "user_id",
      phoneId: "phone_id",
    };

    mockUserBusiness.deletePhone.mockRejectedValue(error);

    await userController.deletePhone(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });
});
