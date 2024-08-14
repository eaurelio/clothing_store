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
} from "../dtos/users/phone";
import TokenService from "../services/TokenService";
import { PhoneDB } from "../models/Phones";
import { ConflictError } from "../errors/ConflictError";
import { ErrorHandler } from "../errors/ErrorHandler";
import { GetAllUserInputDTO } from "../dtos/users/getUser.dto";
import { ForbiddenError } from "../errors/ForbiddenError";

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
    const { userId, token } = input;
    const userIdFromToken = this.tokenService.getUserIdFromToken(token);

    if (userIdFromToken !== userId) {
      throw new ForbiddenError("You do not have access to change this user");
    }

    const userDB = await this.userDatabase.findUserById(userId);

    if (!userDB) {
      throw new NotFoundError("'UserId' not found");
    }

    if (!userDB.active) {
      throw new ForbiddenError("User account is deactivated");
    }

    if (input.personal_id) {
      const userDBPersonalIdExists: UserDB | undefined =
        await this.userDatabase.findUserByPersonalId(
          input.personal_id as string
        );

      if (userDBPersonalIdExists && userDBPersonalIdExists.id !== userId) {
        throw new ConflictError(
          "This personal ID is already in use by another user"
        );
      }
    }

    const hashedPassword = input.password
      ? await this.hashManager.hash(input.password)
      : userDB.password;

    // const updatedUser: UserDB = {
    //   ...userDB,
    //   personal_id:
    //     input.personal_id !== undefined
    //       ? input.personal_id
    //       : userDB.personal_id,
    //   entity_type:
    //     input.entity_type !== undefined
    //       ? (input.entity_type as EntityType)
    //       : userDB.entity_type,
    //   name: input.name !== undefined ? input.name : userDB.name,
    //   email: input.email !== undefined ? input.email : userDB.email,
    //   password: hashedPassword,
    //   birthdate:
    //     input.birthdate !== undefined ? input.birthdate : userDB.birthdate,
    //   address: input.address !== undefined ? input.address : userDB.address,
    //   number: input.number !== undefined ? input.number : userDB.number,
    //   neighborhood:
    //     input.neighborhood !== undefined
    //       ? input.neighborhood
    //       : userDB.neighborhood,
    //   city: input.city !== undefined ? input.city : userDB.city,
    //   country: input.country !== undefined ? input.country : userDB.country,
    //   gender: input.gender !== undefined ? input.gender : userDB.gender,
    //   role: userDB.role,
    //   created_at: userDB.created_at,
    // };

    const updatedUser: UserDB = {
      ...userDB,
      personal_id: input.personal_id ?? userDB.personal_id,
      entity_type: (input.entity_type as EntityType) ?? userDB.entity_type,
      name: input.name ?? userDB.name,
      email: input.email ?? userDB.email,
      password: hashedPassword,
      birthdate: input.birthdate ?? userDB.birthdate,
      address: input.address ?? userDB.address,
      number: input.number ?? userDB.number,
      neighborhood: input.neighborhood ?? userDB.neighborhood,
      city: input.city ?? userDB.city,
      country: input.country ?? userDB.country,
      gender: input.gender ?? userDB.gender,
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

  // --------------------------------------------------------------------

  // public changePassword = async (
  //   input: UpdatePasswordInputDTO
  // ): Promise<UpdatePasswordOutputDTO> => {
  //   const { userId, token, oldPassword, newPassword } = input;

  //   const userIdFromToken = this.tokenService.getUserIdFromToken(token);
  //   if (userIdFromToken !== userId) {
  //     throw new UnauthorizedError("Unauthorized access");
  //   }

  //   const user = await this.userDatabase.findUserById(userId);
  //   if (!user) {
  //     throw new NotFoundError("User not found");
  //   }

  //   const isOldPasswordCorrect = await this.hashManager.compare(
  //     oldPassword,
  //     user.password
  //   );
  //   if (!isOldPasswordCorrect) {
  //     throw new BadRequestError("Old password is incorrect");
  //   }

  //   const hashedNewPassword = await this.hashManager.hash(newPassword);

  //   await this.userDatabase.updatePassword(userId, hashedNewPassword);

  //   return {
  //     message: "Password updated successfully",
  //   };
  // };

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

    if (!user.active) {
      throw new ForbiddenError("User account is deactivated");
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

  // --------------------------------------------------------------------

  public getUserById = async (input: any): Promise<UserDBOutput> => {
    const { userId, token } = input;

    const userIdFromToken = this.tokenService.getUserIdFromToken(token);
    const userDB = await this.userDatabase.findUserById(
      userIdFromToken as string
    );

    if (!userDB) {
      throw new NotFoundError("User not found");
    }

    const authorizedUser = this.tokenService.verifyToken(token);

    if (authorizedUser?.userId !== userId && userDB.role !== USER_ROLES.ADMIN) {
      throw new UnauthorizedError("User not authorized");
    }

    if (!userDB.active) {
      throw new ForbiddenError("User account is deactivated");
    }

    const userFromDatabase = await this.userDatabase.findUserById(userId);
    const phonesFromDatabase = await this.userDatabase.getPhones(userId);
    const { password, ...userOutput } = userFromDatabase as UserDB;

    userOutput.phones = phonesFromDatabase;

    return userOutput;
  };

  // --------------------------------------------------------------------

  public getAllUsers = async (input: GetAllUserInputDTO): Promise<UserDB[]> => {
    const { q, token, onlyActive = true } = input;

    const userId = this.tokenService.getUserIdFromToken(token);
    const userDB = await this.userDatabase.findUserById(userId as string);

    if (!userDB) {
      throw new NotFoundError("User not found");
    }

    const authorizedUser = this.tokenService.verifyToken(token);
    if (authorizedUser?.role !== USER_ROLES.ADMIN) {
      throw new UnauthorizedError("User not authorized");
    }

    if (!userDB.active) {
      throw new ForbiddenError("User account is deactivated");
    }

    const usersDB = await this.userDatabase.findUsers(q, onlyActive);

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
    const { email, password, activate } = input;

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

    await this.userDatabase.updateUserActiveStatus(userDB.id, activate);

    return {
      message: `User ${activate ? "activated" : "deactivated"} successfully`,
    };
  }

  // --------------------------------------------------------------------
  // PHONES
  // --------------------------------------------------------------------

  // public addPhone = async (input: PhoneInputDTO): Promise<PhoneOutputDTO> => {
  //   const { userId, token, number, type } = input;

  //   const userIdFromToken = this.tokenService.getUserIdFromToken(token);

  //   const authorizedUser = this.tokenService.verifyToken(token);
  //   if (!authorizedUser || authorizedUser.userId !== userIdFromToken) {
  //     throw new UnauthorizedError("Unauthorized user");
  //   }

  //   const userDB = await this.userDatabase.findUserById(userId);
  //   if (!userDB) {
  //     throw new NotFoundError("User not found");
  //   }

  //   const phoneId = await this.idGenerator.generate();

  //   const phoneData = {
  //     phone_id: phoneId,
  //     user_id: userId,
  //     number,
  //     type,
  //   };

  //   await this.userDatabase.insertPhone(phoneData);

  //   const updatedPhone = await this.userDatabase.findPhoneById(phoneId);

  //   if (!updatedPhone) {
  //     throw new NotFoundError("Failed to retrieve updated phone data");
  //   }

  //   const output: PhoneOutputDTO = {
  //     message: "Phone updated successfully",
  //     phones: [updatedPhone],
  //   };

  //   return output;
  // };

  public addPhone = async (input: PhoneInputDTO): Promise<PhoneOutputDTO> => {
    const { token, number, type } = input;

    const userId = this.tokenService.getUserIdFromToken(token);
    if (!userId) {
      throw new UnauthorizedError("Invalid token or user not authorized");
    }

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
    input: PhoneInputDTO
  ): Promise<PhoneOutputDTO> => {
    const { token, phoneId, number, type } = input;
  
    const userId = this.tokenService.getUserIdFromToken(token);
    if (!userId) {
      throw new UnauthorizedError("Invalid token or user not authorized");
    }
  
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
    const { token, phoneId } = input;
  
    const userId = this.tokenService.getUserIdFromToken(token);
    if (!userId) {
      throw new UnauthorizedError("Invalid token or user not authorized");
    }
  
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
