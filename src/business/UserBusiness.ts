import { HashManager } from '../services/HashManager';
import { UserDatabase } from "../database/UserDatabase"
import { CreateUserInputDTO, CreateUserOutputDTO } from "../dtos/users/createUser.dto"
import { LoginInputDTO, LoginOutputDTO } from "../dtos/users/login"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { UnauthorizedError } from '../errors/UnauthorizedError'
import { User, UserDB, USER_ROLES, EntityType} from "../models/User"
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

  // Verificar se o usuário existe no banco de dados
  const userDB = await this.userDatabase.findUserByEmail(email);

  if (!userDB) {
    throw new NotFoundError("'User' not registered");
  }

  // Verificar se a senha está correta
  const hashedPassword = userDB.password;
  const isPasswordCorrect = await this.hashManager.compare(password, hashedPassword);

  if (!isPasswordCorrect) {
    throw new BadRequestError("incorrect 'email' or 'password'");
  }

  // Gerar token JWT
  const token = this.tokenService.generateToken(userDB.id, userDB.role);


  // Preparar resposta de saída
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
  
  public getUsers = async (input: any): Promise<UserDB[]> => {
    const { q, token } = input;

    if (!token) {
        throw new BadRequestError("Token is missing");
    }

    // Validar o token e obter o papel do usuário a partir dele
    const userId = this.tokenService.getUserIdFromToken(token);
    const userDB = await this.userDatabase.findUserById(userId as string);
    const authorizedUser = this.tokenService.verifyToken(token)

    if (authorizedUser?.role !== 'ADMIN') {
      throw new UnauthorizedError('User not authorized')
    }

    if (!userDB) {
        throw new NotFoundError("User not found");
    }

    // Only admin users can get all users from database
    if (userDB.role !== USER_ROLES.ADMIN) {
        throw new UnauthorizedError("Unauthorized user");
    }

    const usersDB = await this.userDatabase.findUsers(q);


    const usersOutput = usersDB.map(userDB => {
        const { password, ...userWithoutPassword } = userDB;
        return userWithoutPassword as UserDB;
    });

    return usersOutput;
}

// ------------------------------------------------------------------------------------------------------------------

  public editUser = async (idToEdit: string, input: UpdateUserInputDTO, token: string): Promise<UpdateUserOutputDTO> => {
    if (typeof idToEdit !== "string") {
        throw new BadRequestError("'ID' is required");
    }

    const userIdFromToken = this.tokenService.getUserIdFromToken(token);

    // Verifica se o ID do usuário do token corresponde ao ID fornecido na requisição
    if (userIdFromToken !== idToEdit) {
        throw new UnauthorizedError("You have not access to change this user");
    }

    const userDB = await this.userDatabase.findUserById(idToEdit);

    if (!userDB) {
        throw new NotFoundError("'UserId' not found");
    }

    // Verifica se há senha para hash ou mantém a senha existente
    const hashedPassword = input.password ? await this.hashManager.hash(input.password) : userDB.password;

    // Atualiza apenas os campos fornecidos em `input`
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
      role: userDB.role, // Mantém o papel existente do usuário
      created_at: userDB.created_at // Mantém a data de criação original
  };


    // Atualiza o usuário no banco de dados com os campos atualizados
    await this.userDatabase.updateUser(idToEdit, updatedUser);

    // Retorna os dados atualizados do usuário
    const updatedUserData = await this.userDatabase.findUserById(idToEdit);

    // Verifica se `updatedUserData` é definido antes de acessar suas propriedades
    if (!updatedUserData) {
        throw new NotFoundError("It was not possible to find the updated user data after editing.");
    }

    const output: UpdateUserOutputDTO = {
        message: "Edição realizada com sucesso",
        user: {
            id: updatedUserData.id,
            name: updatedUserData.name,
            email: updatedUserData.email,
            createdAt: updatedUserData.created_at
        }
    };

    return output;
  };


public toggleUserRole = async (idToToggle: string, token: string): Promise<UpdateUserOutputDTO> => {
    if (typeof idToToggle !== "string") {
        throw new BadRequestError("O ID a ser alterado é obrigatório e deve ser uma string");
    }

    const userIdFromToken = this.tokenService.getUserIdFromToken(token);
    const userFromToken = await this.userDatabase.findUserById(userIdFromToken as string);

    if (!userFromToken) {
        throw new NotFoundError("Usuário não encontrado");
    }

    if (userFromToken.role !== USER_ROLES.ADMIN) {
        throw new UnauthorizedError("Apenas administradores podem alterar o papel de outros usuários");
    }

    const userToToggle = await this.userDatabase.findUserById(idToToggle);

    if (!userToToggle) {
        throw new NotFoundError("'UserId' não encontrado");
    }

    userToToggle.role = userToToggle.role === USER_ROLES.ADMIN ? USER_ROLES.NORMAL : USER_ROLES.ADMIN;

    await this.userDatabase.updateUser(idToToggle, userToToggle);

    const updatedUserData = await this.userDatabase.findUserById(idToToggle);

    if (!updatedUserData) {
        throw new NotFoundError("Não foi possível encontrar os dados atualizados do usuário após a alteração");
    }

    const output: UpdateUserOutputDTO = {
        message: `Papel do usuário alterado com sucesso para ${updatedUserData.role}`,
        user: {
            id: updatedUserData.id,
            name: updatedUserData.name,
            email: updatedUserData.email,
            createdAt: updatedUserData.created_at
        }
    };

    return output;
  };





}
