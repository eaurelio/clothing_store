import { HashManager } from "../services/HashManager";
import { UserDatabase } from "../database/UserDatabase";
import {
  CreateUserInputDTO,
  CreateUserOutputDTO,
} from "../dtos/users/createUser.dto";
import { LoginInputDTO, LoginOutputDTO } from "../dtos/users/login";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import {
  User,
  UserDB,
  USER_ROLES,
  EntityType,
  UserDBOutput,
} from "../models/User";
import { IdGenerator } from "../services/idGenerator";
import {
  UpdatePasswordInputDTO,
  UpdatePasswordOutputDTO,
  UpdateUserInputDTO,
  UpdateUserOutputDTO,
} from "../dtos/users/updateUser.dto";
import {
  PhoneDeleteDTO,
  PhoneInputDTO,
  PhoneOutputDTO,
} from "../dtos/users/phone";
import TokenService from "../services/TokenService";

export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenService: TokenService,
    private hashManager: HashManager
  ) {}

  // ------------------------------------------------------------------------------------------------------------------
  // USER DATA
  // ------------------------------------------------------------------------------------------------------------------

  public createUser = async (
    input: CreateUserInputDTO
  ): Promise<CreateUserOutputDTO> => {
    const {
      personal_id,
      entity_type,
      name,
      email,
      password,
      birthdate,
      address,
      number,
      neighborhood,
      city,
      country,
      gender,
      phones,
    } = input;

    const userDBExists = await this.userDatabase.findUserByEmail(email);

    if (userDBExists) {
      throw new BadRequestError("'email' already exists");
    }

    const id = this.idGenerator.generate();
    const hashedPassword = await this.hashManager.hash(password);

    const newUser = new User(
      id,
      personal_id,
      entity_type as EntityType,
      name,
      email,
      hashedPassword,
      birthdate,
      USER_ROLES.ADMIN,
      new Date().toISOString(),
      address,
      number,
      neighborhood,
      city,
      country,
      gender
    );

    const newUserDB: UserDB = {
      id: newUser.getId(),
      personal_id: newUser.getPersonalId(),
      entity_type: newUser.getEntityType(),
      name: newUser.getName(),
      email: newUser.getEmail(),
      password: newUser.getPassword(),
      birthdate: newUser.getBirthdate(),
      role: newUser.getRole(),
      created_at: newUser.getCreatedAt(),
      address: newUser.getAddress(),
      number: newUser.getNumber(),
      neighborhood: newUser.getNeighborhood(),
      city: newUser.getCity(),
      country: newUser.getCountry(),
      gender: newUser.getGender(),
    };

    await this.userDatabase.insertUser(newUserDB);

    if (phones && phones.length > 0) {
      for (const phone of phones) {
        const phone_id = await this.idGenerator.generate();
        const { number, type } = phone;
        await this.userDatabase.insertPhone(phone_id, newUser.getId(), {
          number,
          type,
        });
      }
    }

    const token = this.tokenService.generateToken(
      newUser.getId(),
      newUser.getRole()
    );

    const output: CreateUserOutputDTO = {
      message: "User created successfully",
      user: {
        id: newUser.getId(),
        name: newUser.getName(),
        email: newUser.getEmail(),
        createdAt: newUser.getCreatedAt(),
        token: token,
      },
    };

    return output;
  };

  // ------------------------------------------------------------------------------------------------------------------

  public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
    const { email, password } = input;

    const userDB = await this.userDatabase.findUserByEmail(email);

    if (!userDB) {
      throw new NotFoundError("'User' not registered");
    }

    const hashedPassword = userDB.password;
    const isPasswordCorrect = await this.hashManager.compare(
      password,
      hashedPassword
    );

    if (!isPasswordCorrect) {
      throw new BadRequestError("incorrect 'email' or 'password'");
    }

    const token = this.tokenService.generateToken(userDB.id, userDB.role);

    const output: LoginOutputDTO = {
      message: "Login has been successfully",
      user: {
        userId: userDB.id,
        name: userDB.name,
        email: userDB.email,
        token: token,
      },
    };

    return output;
  };

  // ------------------------------------------------------------------------------------------------------------------

  public editUser = async (
    input: UpdateUserInputDTO
  ): Promise<UpdateUserOutputDTO> => {
    const { userId, token } = input;
    const userIdFromToken = this.tokenService.getUserIdFromToken(token);

    if (userIdFromToken !== userId) {
      throw new UnauthorizedError("You have not access to change this user");
    }

    const userDB = await this.userDatabase.findUserById(userId);

    if (!userDB) {
      throw new NotFoundError("'UserId' not found");
    }

    const hashedPassword = input.password
      ? await this.hashManager.hash(input.password)
      : userDB.password;

    const updatedUser: UserDB = {
      ...userDB,
      personal_id:
        input.personal_id !== undefined
          ? input.personal_id
          : userDB.personal_id,
      entity_type:
        input.entity_type !== undefined
          ? (input.entity_type as EntityType)
          : userDB.entity_type,
      name: input.name !== undefined ? input.name : userDB.name,
      email: input.email !== undefined ? input.email : userDB.email,
      password: hashedPassword,
      birthdate:
        input.birthdate !== undefined ? input.birthdate : userDB.birthdate,
      address: input.address !== undefined ? input.address : userDB.address,
      number: input.number !== undefined ? input.number : userDB.number,
      neighborhood:
        input.neighborhood !== undefined
          ? input.neighborhood
          : userDB.neighborhood,
      city: input.city !== undefined ? input.city : userDB.city,
      country: input.country !== undefined ? input.country : userDB.country,
      gender: input.gender !== undefined ? input.gender : userDB.gender,
      role: userDB.role,
      created_at: userDB.created_at,
    };

    await this.userDatabase.updateUser(userId, updatedUser);

    const updatedUserData = await this.userDatabase.findUserById(userId);

    if (!updatedUserData) {
      throw new NotFoundError(
        "It was not possible to find the updated user data after editing."
      );
    }

    const output: UpdateUserOutputDTO = {
      message: "Editing completed successfully",
      user: {
        userId: updatedUserData.id,
        name: updatedUserData.name,
        email: updatedUserData.email,
        createdAt: updatedUserData.created_at,
      },
    };

    return output;
  };

  public changePassword = async (
    input: UpdatePasswordInputDTO
  ): Promise<UpdatePasswordOutputDTO> => {
    const { userId, token, oldPassword, newPassword } = input;

    const userIdFromToken = this.tokenService.getUserIdFromToken(token);
    if (userIdFromToken !== userId) {
      throw new UnauthorizedError("Unauthorized access");
    }

    const user = await this.userDatabase.findUserById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const isOldPasswordCorrect = await this.hashManager.compare(
      oldPassword,
      user.password
    );
    if (!isOldPasswordCorrect) {
      throw new BadRequestError("Old password is incorrect");
    }

    const hashedNewPassword = await this.hashManager.hash(newPassword);

    await this.userDatabase.updatePassword(userId, hashedNewPassword);

    return {
      message: "Password updated successfully",
    };
  };

  // ------------------------------------------------------------------------------------------------------------------

  public getUserData = async (input: any): Promise<UserDBOutput> => {
    const { userId, token } = input;

    const userIdFromToken = this.tokenService.getUserIdFromToken(token);
    const userDB = await this.userDatabase.findUserById(userIdFromToken as string);
    const authorizedUser = this.tokenService.verifyToken(token);

    if (authorizedUser?.userId !== userId && userDB?.role !== USER_ROLES.ADMIN) {
      throw new UnauthorizedError("User not authorized");
    }

    if (!userDB) {
      throw new NotFoundError("User not found");
    }

    const userFromDatabase = await this.userDatabase.findUserById(userId);
    const phonesFromDatabase = await this.userDatabase.getPhones(userId);
    const { password, ...userOutput } = userFromDatabase as UserDB;

    userOutput.phones = phonesFromDatabase;

    return userOutput;
  };

  public getAllUsers = async (input: any): Promise<UserDB[]> => {
    const { q, token } = input;

    const userId = this.tokenService.getUserIdFromToken(token);
    const userDB = await this.userDatabase.findUserById(userId as string);
    const authorizedUser = this.tokenService.verifyToken(token);

    if (authorizedUser?.role !== USER_ROLES.ADMIN) {
      throw new UnauthorizedError("User not authorized");
    }

    if (!userDB) {
      throw new NotFoundError("User not found");
    }

    if (userDB.role !== USER_ROLES.ADMIN) {
      throw new UnauthorizedError("Unauthorized user");
    }

    const usersDB = await this.userDatabase.findUsers(q);

    const usersOutput = await Promise.all(
      usersDB.map(async (userDB) => {
        const phonesFromDatabase = await this.userDatabase.getPhones(userDB.id);
        const { password, ...userWithoutPassword } = userDB;
        userWithoutPassword.phones = phonesFromDatabase;
        return userWithoutPassword as UserDB;
      })
    );

    return usersOutput;
  };

  // PHONES

  public addPhone = async (input: PhoneInputDTO): Promise<PhoneOutputDTO> => {
    const { userId, token, number, type } = input;

    const userIdFromToken = this.tokenService.getUserIdFromToken(token);

    const authorizedUser = this.tokenService.verifyToken(token);
    if (!authorizedUser || authorizedUser.userId !== userIdFromToken) {
      throw new UnauthorizedError("Unauthorized user");
    }

    const userDB = await this.userDatabase.findUserById(userId);
    if (!userDB) {
      throw new NotFoundError("User not found");
    }

    const phoneId = await this.idGenerator.generate();
    await this.userDatabase.insertPhone(phoneId, userId, { number, type });

    const updatedPhone = await this.userDatabase.findPhoneById(phoneId);

    if (!updatedPhone) {
      throw new NotFoundError("Failed to retrieve updated phone data");
    }

    const output: PhoneOutputDTO = {
      message: "Phone updated successfully",
      phones: [updatedPhone],
    };

    return output;
  };

  // ------------------------------------------------------------------------------------------------------------------

  public updatePhone = async (
    input: PhoneInputDTO
  ): Promise<PhoneOutputDTO> => {
    const { userId, token, phoneId, number, type } = input;

    const userIdFromToken = this.tokenService.getUserIdFromToken(token);

    const authorizedUser = this.tokenService.verifyToken(token);
    if (!authorizedUser || authorizedUser.userId !== userIdFromToken) {
      throw new UnauthorizedError("Unauthorized user");
    }

    const userDB = await this.userDatabase.findUserById(userId);
    if (!userDB) {
      throw new NotFoundError("User not found");
    }

    const phoneDB = await this.userDatabase.findPhoneById(phoneId);
    if (!phoneDB || phoneDB.user_id !== userId) {
      throw new NotFoundError("Phone not found or does not belong to the user");
    }

    await this.userDatabase.updatePhone(phoneId, { number, type });

    const updatedPhone = await this.userDatabase.findPhoneById(phoneId);

    if (!updatedPhone) {
      throw new NotFoundError("Failed to retrieve updated phone data");
    }

    const output: PhoneOutputDTO = {
      message: "Phone updated successfully",
      phones: [updatedPhone],
    };

    return output;
  };

  // ------------------------------------------------------------------------------------------------------------------

  public deletePhone = async (
    input: PhoneDeleteDTO
  ): Promise<PhoneOutputDTO> => {
    const { userId, token, phoneId } = input;

    const userIdFromToken = this.tokenService.getUserIdFromToken(token);

    const authorizedUser = this.tokenService.verifyToken(token);
    if (!authorizedUser || authorizedUser.userId !== userIdFromToken) {
      throw new UnauthorizedError("Unauthorized user");
    }

    const userDB = await this.userDatabase.findUserById(userId);
    if (!userDB) {
      throw new NotFoundError("User not found");
    }

    const phoneDB = await this.userDatabase.findPhoneById(phoneId);
    if (!phoneDB || phoneDB.user_id !== userId) {
      throw new NotFoundError("Phone not found or does not belong to the user");
    }

    await this.userDatabase.deletePhoneById(phoneId);

    const updatedPhones = await this.userDatabase.getPhones(userId);

    const output: PhoneOutputDTO = {
      message: "Phone deleted successfully",
      phones: updatedPhones,
    };

    return output;
  };
}
