import {
  CreateUserInputDTO,
  CreateUserOutputDTO,
} from "../dtos/users/createUser.dto";

import { LoginInputDTO, LoginOutputDTO } from "../dtos/users/login";

import {
  ResetPasswordInputDTO,
  ResetPasswordOutputDTO,
  ToggleUserActiveStatusInputDTO,
  ToggleUserActiveStatusOutputDTO,
  UpdatePasswordInputDTO,
  UpdatePasswordOutputDTO,
  UpdateUserInputDTO,
  UpdateUserOutputDTO,
} from "../dtos/users/updateUser.dto";

import {
  PhoneDeleteDTO,
  PhoneInputDTO,
  PhoneOutputDTO,
  PhoneUpdateInputDTO,
  PhoneUpdateOutputDTO,
} from "../dtos/users/phone";

import { GetAllUserInputDTO, GetUserInputDTO } from "../dtos/users/getUser.dto";

import {
  User,
  UserDB,
  USER_ROLES,
  EntityType,
  UserDBOutput,
  UsersDBOutput,
} from "../models/User";

import { PhoneDB } from "../models/Phones";

import { UserDatabase } from "../database/UserDatabase";

import TokenService from "../services/TokenService";
import { IdGenerator } from "../services/idGenerator";
import { HashManager } from "../services/HashManager";

import {
  ConflictError,
  ForbiddenError,
  BadRequestError,
  NotFoundError,
} from "../errors/Errors";
import ErrorHandler from "../errors/ErrorHandler";

export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenService: TokenService,
    private hashManager: HashManager,
    private errorHandler: ErrorHandler
  ) {}

  public async createUser(
    input: CreateUserInputDTO
  ): Promise<CreateUserOutputDTO> {
    const {
      token,
      personalId,
      entityType,
      name,
      email,
      password,
      birthdate,
      role,
      address,
      number,
      neighborhood,
      city,
      country,
      gender,
      phones,
    } = input;

    let userRole = USER_ROLES.CLIENT;

    if (token) {
      const authorizedUser = await this.tokenService.verifyToken(token);
      if (authorizedUser?.role === USER_ROLES.ADMIN) {
        if (role === USER_ROLES.ADMIN) {
          userRole = USER_ROLES.ADMIN;
        }
      } else {
        throw new ForbiddenError(
          "User does not have permission to create an admin account"
        );
      }
    }

    const userDBEmailExists = await this.userDatabase.findUserByEmail(email);
    if (userDBEmailExists) {
      throw new ConflictError("'email' already exists");
    }

    const userDBPersonalIdExists = await this.userDatabase.findUserByPersonalId(
      personalId
    );
    if (userDBPersonalIdExists) {
      throw new ConflictError("'personal Id' already exists");
    }

    const id = await this.idGenerator.generate();
    const hashedPassword = await this.hashManager.hash(password);

    const newUser = new User(
      id,
      personalId,
      entityType as EntityType,
      name,
      email,
      hashedPassword,
      birthdate,
      userRole,
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
        const phoneData: PhoneDB = {
          phone_id: await this.idGenerator.generate(),
          user_id: newUser.getId(),
          number: phone.number,
          type: phone.type,
        };
        await this.userDatabase.insertPhone(phoneData);
      }
    }

    const newToken = this.tokenService.generateToken(
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
        token: newToken,
      },
    };

    return output;
  }

  public async login(input: LoginInputDTO): Promise<LoginOutputDTO> {
    const { email, password } = input;

    const userDB = await this.userDatabase.findUserByEmail(email);

    if (!userDB) {
      throw new NotFoundError("'User' not registered");
    }

    if (!userDB.active) {
      throw new ForbiddenError("User account is deactivated");
    }

    const hashedPassword = userDB.password;
    const isPasswordCorrect = await this.hashManager.compare(
      password,
      hashedPassword
    );

    if (!isPasswordCorrect) {
      throw new BadRequestError("incorrect 'email' or 'password'");
    }

    const lastLogin = new Date().toISOString();
    await this.userDatabase.updateLastLogin(userDB.id, lastLogin);

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
  }

  public async editUser(
    input: UpdateUserInputDTO
  ): Promise<UpdateUserOutputDTO> {
    const { userId, personalId, password, ...rest } = input;

    const userDB = await this.userDatabase.findUserById(userId);

    if (!userDB) {
      throw new NotFoundError("'UserId' not found");
    }

    if (!userDB.active) {
      throw new ForbiddenError("User account is deactivated");
    }

    if (personalId) {
      const userDBPersonalIdExists =
        await this.userDatabase.findUserByPersonalId(personalId);

      if (userDBPersonalIdExists && userDBPersonalIdExists.id !== userId) {
        throw new ConflictError(
          "This personal ID is already in use by another user"
        );
      }
    }

    const hashedPassword = password
      ? await this.hashManager.hash(password)
      : userDB.password;

    const updatedUser: UserDB = {
      ...userDB,
      personal_id: personalId ?? userDB.personal_id,
      entity_type: (rest.entityType as EntityType) ?? userDB.entity_type,
      name: rest.name ?? userDB.name,
      email: rest.email ?? userDB.email,
      password: hashedPassword,
      birthdate: rest.birthdate ?? userDB.birthdate,
      address: rest.address ?? userDB.address,
      number: rest.number ?? userDB.number,
      neighborhood: rest.neighborhood ?? userDB.neighborhood,
      city: rest.city ?? userDB.city,
      country: rest.country ?? userDB.country,
      gender: rest.gender ?? userDB.gender,
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
  }

  public async changePassword(
    input: UpdatePasswordInputDTO
  ): Promise<UpdatePasswordOutputDTO> {
    const { userId, email, oldPassword, newPassword } = input;

    const user = await this.userDatabase.findUserById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (!user.active) {
      throw new ForbiddenError("User account is deactivated");
    }

    if (user.email !== email) {
      throw new BadRequestError("Email does not match our records");
    }

    const isOldPasswordCorrect = await this.hashManager.compare(
      oldPassword,
      user.password
    );
    if (!isOldPasswordCorrect) {
      throw new BadRequestError("Old password is incorrect");
    }

    const isNewPasswordSameAsOld = await this.hashManager.compare(
      newPassword,
      user.password
    );
    if (isNewPasswordSameAsOld) {
      throw new BadRequestError(
        "New password cannot be the same as the old password"
      );
    }

    const hashedNewPassword = await this.hashManager.hash(newPassword);

    await this.userDatabase.updatePassword(userId, hashedNewPassword);

    return {
      message: "Password updated successfully",
    };
  }

  public async resetPassword(
    input: ResetPasswordInputDTO
  ): Promise<ResetPasswordOutputDTO> {
    const { userId, email, newPassword } = input;

    const user = await this.userDatabase.findUserById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (!user.active) {
      throw new ForbiddenError("User account is deactivated");
    }

    if (user.email !== email) {
      throw new BadRequestError("Email does not match our records");
    }

    const hashedNewPassword = await this.hashManager.hash(newPassword);

    await this.userDatabase.updatePassword(userId, hashedNewPassword);

    return {
      message: "Password updated successfully",
    };
  }

  public async getUserById(input: GetUserInputDTO): Promise<UserDBOutput> {
    const { userId } = input;

    const userFromDatabase = await this.userDatabase.findUserById(userId);

    if (!userFromDatabase) {
      throw new NotFoundError("User not found");
    }

    if (!userFromDatabase.active) {
      throw new ForbiddenError("User account is deactivated");
    }

    const phonesFromDatabase = await this.userDatabase.getPhones(userId);

    const userOutput: UserDBOutput = {
      id: userFromDatabase.id,
      personal_id: userFromDatabase.personal_id,
      entity_type: userFromDatabase.entity_type,
      name: userFromDatabase.name,
      gender: userFromDatabase.gender,
      email: userFromDatabase.email,
      role: userFromDatabase.role,
      created_at: userFromDatabase.created_at,
      birthdate: userFromDatabase.birthdate,
      address: userFromDatabase.address,
      number: userFromDatabase.number,
      neighborhood: userFromDatabase.neighborhood,
      city: userFromDatabase.city,
      country: userFromDatabase.country,
      active: userFromDatabase.active,
      last_login: userFromDatabase.last_login,
      phones: phonesFromDatabase,
    };

    return userOutput;
  }

  public async getAllUsers(
    input: GetAllUserInputDTO
  ): Promise<UsersDBOutput[]> {
    const { q, onlyActive = true, personalId, genderId, email, role } = input;

    const usersDB = await this.userDatabase.findUsers(
      q,
      onlyActive,
      personalId,
      genderId,
      email,
      role
    );

    if (usersDB.length === 0) {
      throw new NotFoundError("No users found");
    }

    const usersOutput: UsersDBOutput[] = await Promise.all(
      usersDB.map(async (userDB) => {
        const phonesFromDatabase = await this.userDatabase.getPhones(userDB.id);

        const userWithoutPassword: UsersDBOutput = {
          id: userDB.id,
          personal_id: userDB.personal_id,
          entity_type: userDB.entity_type,
          name: userDB.name,
          gender_id: userDB.gender_id,
          gender: userDB.gender,
          email: userDB.email,
          role: userDB.role,
          created_at: userDB.created_at,
          birthdate: userDB.birthdate,
          address: userDB.address,
          number: userDB.number,
          neighborhood: userDB.neighborhood,
          city: userDB.city,
          country: userDB.country,
          active: userDB.active,
          last_login: userDB.last_login,
          phones: phonesFromDatabase,
        };

        return userWithoutPassword;
      })
    );

    return usersOutput;
  }

  public async toggleUserActiveStatus(
    input: ToggleUserActiveStatusInputDTO
  ): Promise<ToggleUserActiveStatusOutputDTO> {
    const { email, password } = input;

    const userDB = await this.userDatabase.findUserByEmail(email);
    if (!userDB) {
      throw new NotFoundError("User not found");
    }

    const isPasswordCorrect = await this.hashManager.compare(
      password,
      userDB.password
    );
    if (!isPasswordCorrect) {
      throw new BadRequestError("Incorrect password");
    }

    const newActiveStatus = !userDB.active;
    await this.userDatabase.updateUserActiveStatus(userDB.id, newActiveStatus);

    return {
      message: `User ${
        newActiveStatus ? "activated" : "deactivated"
      } successfully`,
    };
  }

  public async addPhone(input: PhoneInputDTO): Promise<PhoneOutputDTO> {
    const { userId, number, type } = input;

    const userDB = await this.userDatabase.findUserById(userId);

    if (!userDB) {
      throw new NotFoundError("User not found");
    }

    if (!userDB.active) {
      throw new ForbiddenError("User account is deactivated");
    }

    const phoneId = await this.idGenerator.generate();

    const phoneData: PhoneDB = {
      phone_id: phoneId,
      user_id: userId,
      number,
      type,
    };

    await this.userDatabase.insertPhone(phoneData);

    const updatedPhone = await this.userDatabase.findPhoneById(phoneId);

    if (!updatedPhone) {
      throw new NotFoundError("Failed to retrieve updated phone data");
    }

    const output: PhoneOutputDTO = {
      message: "Phone added successfully",
      phones: [updatedPhone],
    };

    return output;
  }

  public async updatePhone(
    input: PhoneUpdateInputDTO
  ): Promise<PhoneUpdateOutputDTO> {
    const { userId, phoneId, number, type } = input;

    const userDB = await this.userDatabase.findUserById(userId);

    if (!userDB) {
      throw new NotFoundError("User not found");
    }

    if (!userDB.active) {
      throw new ForbiddenError("User account is deactivated");
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
  }

  public async deletePhone(input: PhoneDeleteDTO): Promise<PhoneOutputDTO> {
    const { userId, phoneId } = input;

    const userDB = await this.userDatabase.findUserById(userId);

    if (!userDB) {
      throw new NotFoundError("User not found");
    }

    if (!userDB.active) {
      throw new ForbiddenError("User account is deactivated");
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
  }
}
