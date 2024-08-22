// User DTOs
import {
  CreateUserInputDTO,
  CreateUserOutputDTO,
} from "../dtos/users/createUser.dto";

import {
  LoginInputDTO,
  LoginOutputDTO
} from "../dtos/users/login";

import {
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

import { GetAllUserInputDTO } from "../dtos/users/getUser.dto";

// Models
import {
  User,
  UserDB,
  USER_ROLES,
  EntityType,
  UserDBOutput,
} from "../models/User";

import { PhoneDB } from "../models/Phones";

// Database
import { UserDatabase } from "../database/UserDatabase";

// Services
import TokenService from "../services/TokenService";
import { IdGenerator } from "../services/idGenerator";
import { HashManager } from "../services/HashManager";

// Errors
import { ConflictError, ForbiddenError, BadRequestError, NotFoundError } from "../errors/Errors";
import { ErrorHandler } from "../errors/ErrorHandler";


export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenService: TokenService,
    private hashManager: HashManager,
    private errorHandler: ErrorHandler
  ) {}

  // --------------------------------------------------------------------
  // USER DATA
  // --------------------------------------------------------------------

  public createUser = async (
    input: CreateUserInputDTO
  ): Promise<CreateUserOutputDTO> => {
    const {
      token,
      personal_id,
      entity_type,
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

    const userDBEmailExists: UserDB | undefined =
      await this.userDatabase.findUserByEmail(email);

    if (userDBEmailExists) {
      throw new ConflictError("'email' already exists");
    }

    const userDBPersonalIdExists: UserDB | undefined =
      await this.userDatabase.findUserByPersonalId(personal_id);

    if (userDBPersonalIdExists) {
      throw new ConflictError("'personal Id' already exists");
    }
    
    let userRole = USER_ROLES.CLIENT;

    if (token) {
      const authorizedUser = this.tokenService.verifyToken(token);
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
      userRole,
      new Date().toISOString(),
      address,
      number,
      neighborhood,
      city,
      country,
      gender,
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
  };

  // --------------------------------------------------------------------

  public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
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
  };

  // --------------------------------------------------------------------

  public editUser = async (
    input: UpdateUserInputDTO
  ): Promise<UpdateUserOutputDTO> => {
    const { userId, personal_id, password, ...rest } = input;
  
    const userDB = await this.userDatabase.findUserById(userId);
  
    if (!userDB) {
      throw new NotFoundError("'UserId' not found");
    }
  
    if (!userDB.active) {
      throw new ForbiddenError("User account is deactivated");
    }
  
    if (personal_id) {
      const userDBPersonalIdExists = await this.userDatabase.findUserByPersonalId(personal_id);
  
      if (userDBPersonalIdExists && userDBPersonalIdExists.id !== userId) {
        throw new ConflictError("This personal ID is already in use by another user");
      }
    }
  
    const hashedPassword = password ? await this.hashManager.hash(password) : userDB.password;
  
    const updatedUser: UserDB = {
      ...userDB,
      personal_id: personal_id ?? userDB.personal_id,
      entity_type: (rest.entity_type as EntityType) ?? userDB.entity_type,
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
      throw new NotFoundError("It was not possible to find the updated user data after editing.");
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
  
  // --------------------------------------------------------------------

  public changePassword = async (
    input: UpdatePasswordInputDTO
  ): Promise<UpdatePasswordOutputDTO> => {
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
      throw new BadRequestError("New password cannot be the same as the old password");
    }
  
    const hashedNewPassword = await this.hashManager.hash(newPassword);
  
    await this.userDatabase.updatePassword(userId, hashedNewPassword);
  
    return {
      message: "Password updated successfully",
    };
  };
  
  
  // --------------------------------------------------------------------

public getUserById = async (input: any): Promise<UserDBOutput> => {
  const { userId } = input;

  const userFromDatabase = await this.userDatabase.findUserById(userId);
  
  if (!userFromDatabase) {
      throw new NotFoundError("User not found");
  }

  if (!userFromDatabase.active) {
      throw new ForbiddenError("User account is deactivated");
  }

  const phonesFromDatabase = await this.userDatabase.getPhones(userId);
  const { password, ...userOutput } = userFromDatabase as UserDB;

  userOutput.phones = phonesFromDatabase;

  return userOutput;
};

  // --------------------------------------------------------------------

  public getAllUsers = async (input: GetAllUserInputDTO): Promise<UserDB[]> => {
    const { q, onlyActive = true } = input;

    const usersDB = await this.userDatabase.findUsers(q, onlyActive);

    if (usersDB.length === 0) {
        throw new NotFoundError("No users found");
    }

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

  // --------------------------------------------------------------------

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
      message: `User ${newActiveStatus ? "activated" : "deactivated"} successfully`,
    };
  }
  

  // --------------------------------------------------------------------
  // PHONES
  // --------------------------------------------------------------------

  public addPhone = async (input: PhoneInputDTO): Promise<PhoneOutputDTO> => {
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
  };
  

  // --------------------------------------------------------------------

  public updatePhone = async (
    input: PhoneUpdateInputDTO
  ): Promise<PhoneUpdateOutputDTO> => {
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
  };
  
  // --------------------------------------------------------------------

  public deletePhone = async (
    input: PhoneDeleteDTO
  ): Promise<PhoneOutputDTO> => {
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
  };
}