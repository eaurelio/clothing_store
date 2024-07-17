import { HashManager } from '../services/HashManager';
import { UserDatabase } from "../database/UserDatabase"
import { CreateUserInputDTO, CreateUserOutputDTO } from "../dtos/users/createUser.dto"
import { LoginInputDTO, LoginOutputDTO } from "../dtos/users/login"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { UnauthorizedError } from '../errors/UnauthorizedError'
import { User, UserDB, USER_ROLES, EntityType, UserDBOutput} from "../models/User"
import { IdGenerator } from "../services/idGenerator"
import TokenService from "../services/TokenService"
import { UpdateUserInputDTO, UpdateUserOutputDTO } from '../dtos/users/updateUser.dto';

export class UserBusiness {
  constructor(
    private userDatabase : UserDatabase,
    private idGenerator : IdGenerator,
    private tokenService: TokenService,
    private hashManager: HashManager
  ){}

public createUser = async (input: CreateUserInputDTO): Promise<CreateUserOutputDTO> => {
  const { personal_id, entity_type, name, email, password, birthdate, address, number, neighborhood, city, country, gender, phones } = input;

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
    gender: newUser.getGender()
  };

  await this.userDatabase.insertUser(newUserDB);

  if (phones && phones.length > 0) {
    for (const phone of phones) {
      const phone_id = await this.idGenerator.generate()
      const { number, type } = phone;
      await this.userDatabase.insertPhone(phone_id, newUser.getId(), { number, type });
    }
  }

  const token = this.tokenService.generateToken(newUser.getId(), newUser.getRole());

  const output: CreateUserOutputDTO = {
    message: "User created successfully",
    user: {
      id: newUser.getId(),
      name: newUser.getName(),
      email: newUser.getEmail(),
      createdAt: newUser.getCreatedAt(),
      token: token
    },
  };

  return output;
};

// ------------------------------------------------------------------------------------------------------------------

public login = async (
  input: LoginInputDTO
): Promise<LoginOutputDTO> => {
  const { email, password } = input;

  // Check if the user exists in the database
  const userDB = await this.userDatabase.findUserByEmail(email);

  if (!userDB) {
    throw new NotFoundError("'User' not registered");
  }

  // Check if the password is correct
  const hashedPassword = userDB.password;
  const isPasswordCorrect = await this.hashManager.compare(password, hashedPassword);

  if (!isPasswordCorrect) {
    throw new BadRequestError("incorrect 'email' or 'password'");
  }

  // Generate token
  const token = this.tokenService.generateToken(userDB.id, userDB.role);


  // Prepare output
  const output: LoginOutputDTO = {
    message: "Login has been successfully",
    user: {
      id: userDB.id,
      name: userDB.name,
      email: userDB.email,
      token: token
    }
  };

  return output;
}


// ------------------------------------------------------------------------------------------------------------------
  
public getUserData = async (input: any): Promise<UserDBOutput> => {
  const { id, token } = input;

  if (!token) {
      throw new BadRequestError("Token is missing");
  }

  // Validate the token and get the user role from it
  const userId = this.tokenService.getUserIdFromToken(token);
  const userDB = await this.userDatabase.findUserById(userId as string);
  const authorizedUser = this.tokenService.verifyToken(token)

  // console.log(userId)

  if (authorizedUser?.userId !== id) {
    throw new UnauthorizedError('User not authorized')
  }

  if (!userDB) {
      throw new NotFoundError("User not found");
  }

  const userFromDatabase = await this.userDatabase.findUserById(id);
  const phonesFromDatabase = await this.userDatabase.getPhones(id)
  const {password, ...userOutput} = userFromDatabase as UserDB

  userOutput.phones = phonesFromDatabase;

  return userOutput;
}

public getAllUsers = async (input: any): Promise<UserDB[]> => {
  const { q, token } = input;

  if (!token) {
      throw new BadRequestError("Token is missing");
  }

  // Validate the token and get the user role from it
  const userId = this.tokenService.getUserIdFromToken(token);
  const userDB = await this.userDatabase.findUserById(userId as string);
  const authorizedUser = this.tokenService.verifyToken(token);

  if (authorizedUser?.role !== 'ADMIN') {
      throw new UnauthorizedError('User not authorized');
  }

  if (!userDB) {
      throw new NotFoundError("User not found");
  }

  // Only admin users can get all users from database
  if (userDB.role !== USER_ROLES.ADMIN) {
      throw new UnauthorizedError("Unauthorized user");
  }

  const usersDB = await this.userDatabase.findUsers(q);

  // Map through each user and fetch phones for each user
  const usersOutput = await Promise.all(usersDB.map(async (userDB) => {
      const phonesFromDatabase = await this.userDatabase.getPhones(userDB.id);
      const { password, ...userWithoutPassword } = userDB;
      userWithoutPassword.phones = phonesFromDatabase; // Assign phones to each user
      return userWithoutPassword as UserDB;
  }));

  return usersOutput;
}

// ------------------------------------------------------------------------------------------------------------------

public editUser = async (idToEdit: string, input: UpdateUserInputDTO, token: string): Promise<UpdateUserOutputDTO> => {
  const userIdFromToken = this.tokenService.getUserIdFromToken(token);

  // Checks that the token's user ID matches the ID provided in the request
  if (userIdFromToken !== idToEdit) {
      throw new UnauthorizedError("You have not access to change this user");
  }

  const userDB = await this.userDatabase.findUserById(idToEdit);

  if (!userDB) {
      throw new NotFoundError("'UserId' not found");
  }

  // Checks for hashed password or keeps existing password
  const hashedPassword = input.password ? await this.hashManager.hash(input.password) : userDB.password;

  // Updates only the fields provided in `input`
  const updatedUser: UserDB = {
    ...userDB, // Copia todos os campos existentes do usuário do banco de dados
    personal_id: input.personal_id !== undefined ? input.personal_id : userDB.personal_id,
    entity_type: input.entity_type !== undefined ? (input.entity_type as EntityType) : userDB.entity_type,
    name: input.name !== undefined ? input.name : userDB.name,
    email: input.email !== undefined ? input.email : userDB.email,
    password: hashedPassword,
    birthdate: input.birthdate !== undefined ? input.birthdate : userDB.birthdate,
    address: input.address !== undefined ? input.address : userDB.address,
    number: input.number !== undefined ? input.number : userDB.number,
    neighborhood: input.neighborhood !== undefined ? input.neighborhood : userDB.neighborhood,
    city: input.city !== undefined ? input.city : userDB.city,
    country: input.country !== undefined ? input.country : userDB.country,
    gender: input.gender !== undefined ? input.gender : userDB.gender,
    // phones: input.phones !== undefined ? input.phones : userDB.phones, // Adiciona atualização de telefones
    role: userDB.role, // Mantém o papel existente do usuário
    created_at: userDB.created_at // Mantém a data de criação original
};

  // Updates the user in the database with the updated fields
  await this.userDatabase.updateUser(idToEdit, updatedUser);

  // Returns updated user data
  const updatedUserData = await this.userDatabase.findUserById(idToEdit);

  // Check if `updatedUserData` is defined before accessing its properties
  if (!updatedUserData) {
      throw new NotFoundError("It was not possible to find the updated user data after editing.");
  }

  const output: UpdateUserOutputDTO = {
      message: "Editing completed successfully",
      user: {
          id: updatedUserData.id,
          name: updatedUserData.name,
          email: updatedUserData.email,
          createdAt: updatedUserData.created_at
      }
  };

  return output;
};


  // public editUser = async (idToEdit: string, input: UpdateUserInputDTO, token: string): Promise<UpdateUserOutputDTO> => {
  //   if (typeof idToEdit !== "string") {
  //       throw new BadRequestError("'ID' is required");
  //   }

  //   const userIdFromToken = this.tokenService.getUserIdFromToken(token);

  //   // Checks that the token's user ID matches the ID provided in the request
  //   if (userIdFromToken !== idToEdit) {
  //       throw new UnauthorizedError("You have not access to change this user");
  //   }

  //   const userDB = await this.userDatabase.findUserById(idToEdit);

  //   if (!userDB) {
  //       throw new NotFoundError("'UserId' not found");
  //   }

  //   // Checks for hashed password or keeps existing password
  //   const hashedPassword = input.password ? await this.hashManager.hash(input.password) : userDB.password;

  //   // Updates only the fields provided in `input`
  //   const updatedUser: UserDB = {
  //     ...userDB, // Copia todos os campos existentes do usuário do banco de dados
  //     personal_id: input.personal_id !== undefined ? input.personal_id : userDB.personal_id,
  //     entity_type: input.entity_type !== undefined ? (input.entity_type as EntityType) : userDB.entity_type,
  //     name: input.name !== undefined ? input.name : userDB.name,
  //     email: input.email !== undefined ? input.email : userDB.email,
  //     password: hashedPassword,
  //     birthdate: input.birthdate !== undefined ? input.birthdate : userDB.birthdate,
  //     address: input.address !== undefined ? input.address : userDB.address,
  //     number: input.number !== undefined ? input.number : userDB.number,
  //     neighborhood: input.neighborhood !== undefined ? input.neighborhood : userDB.neighborhood,
  //     city: input.city !== undefined ? input.city : userDB.city,
  //     country: input.country !== undefined ? input.country : userDB.country,
  //     gender: input.gender !== undefined ? input.gender : userDB.gender,
  //     role: userDB.role, // Mantém o papel existente do usuário
  //     created_at: userDB.created_at // Mantém a data de criação original
  // };

  //   // Updates the user in the database with the updated fields
  //   await this.userDatabase.updateUser(idToEdit, updatedUser);

  //   // Returns updated user data
  //   const updatedUserData = await this.userDatabase.findUserById(idToEdit);

  //   // Check if `update User Data` is defined before accessing its properties
  //   if (!updatedUserData) {
  //       throw new NotFoundError("It was not possible to find the updated user data after editing.");
  //   }

  //   const output: UpdateUserOutputDTO = {
  //       message: "Editing completed successfully",
  //       user: {
  //           id: updatedUserData.id,
  //           name: updatedUserData.name,
  //           email: updatedUserData.email,
  //           createdAt: updatedUserData.created_at
  //       }
  //   };

  //   return output;
  // };

}
