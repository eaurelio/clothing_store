import { HashManager } from '../services/HashManager';
import { UserDatabase } from "../database/UserDatabase"
import { CreateUserInputDTO, CreateUserOutputDTO } from "../dtos/users/createUser.dto"
import { LoginInputDTO, LoginOutputDTO } from "../dtos/users/login"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { User, UserDB, USER_ROLES, } from "../models/User"
import { IdGenerator } from "../services/idGenerator"
import TokenService from "../services/TokenService"

export class UserBusiness {
  constructor(
    private userDatabase : UserDatabase,
    private idGenerator : IdGenerator,
    private tokenService: TokenService,
    private hashManager: HashManager
  ){}

public createUser = async (input: CreateUserInputDTO): Promise<CreateUserOutputDTO> => {
  const { name, email, password, phones, birthdate, address, number, neighborhood, city, country, gender } = input;

  const userDBExists = await this.userDatabase.findUserByEmail(email);

  if (userDBExists) {
    throw new BadRequestError("'email' already exists");
  }

  const id = this.idGenerator.generate();

  const hashedPassword = await this.hashManager.hash(password);

  const newUser = new User(
    id,
    name,
    email,
    hashedPassword,
    USER_ROLES.ADMIN,
    new Date().toISOString(),
    birthdate,
    address,
    number,
    neighborhood,
    city,
    country,
    gender
  );

  const newUserDB: UserDB = {
    id: newUser.getId(),
    name: newUser.getName(),
    email: newUser.getEmail(),
    password: newUser.getPassword(),
    role: newUser.getRole(),
    created_at: newUser.getCreatedAt(),
    birthdate: newUser.getBirthdate(),
    address: newUser.getAddress(),
    number: newUser.getNumber(),
    neighborhood: newUser.getNeighborhood(),
    city: newUser.getCity(),
    country: newUser.getCountry(),
    gender: newUser.getGender()
  };

  await this.userDatabase.insertUser(newUserDB);

  if (input.phones && input.phones.length > 0) {
    for (const phone of input.phones) {
      const { number, type } = phone;
      await this.userDatabase.insertPhone(newUser.getId(), { number, type });
    }
  }

  const token = this.tokenService.generateToken(newUser.getId());

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
    throw new NotFoundError("'email' não encontrado");
  }

  // Verificar se a senha está correta
  const hashedPassword = userDB.password;
  const isPasswordCorrect = await this.hashManager.compare(password, hashedPassword);

  if (!isPasswordCorrect) {
    throw new BadRequestError("'email' ou 'password' incorretos");
  }

  // Gerar token JWT
  const token = this.tokenService.generateToken(userDB.id);

  // Preparar resposta de saída
  const output: LoginOutputDTO = {
    message: "Login realizado com sucesso",
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
        throw new BadRequestError("Token de autorização não fornecido");
    }

    // Validar o token e obter o papel do usuário a partir dele
    const userId = this.tokenService.getUserIdFromToken(token);
    const userDB = await this.userDatabase.findUserById(userId as string);

    if (!userDB) {
        throw new NotFoundError("Usuário não encontrado");
    }

    if (userDB.role !== USER_ROLES.ADMIN) {
        throw new BadRequestError("Usuário não autorizado");
    }

    // Agora você pode buscar os usuários no banco de dados, já que o usuário é um ADMIN
    const usersDB = await this.userDatabase.findUsers(q);

    const usersOutput = usersDB.map(userDB => {
        const { password, ...userWithoutPassword } = userDB;
        return userWithoutPassword as UserDB;
    });

    return usersOutput;
}

// ------------------------------------------------------------------------------------------------------------------

  public editUser = async (idToEdit: string, input: CreateUserInputDTO): Promise<CreateUserOutputDTO> => {
    const {
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
      phones
    } = input;

    if (typeof idToEdit !== "string") {
      throw new BadRequestError("id a ser editado é obrigatório e deve ser string");
    }

    const userDB = await this.userDatabase.findUserById(idToEdit);

    if (!userDB) {
      throw new NotFoundError("id a ser editado não existe");
    }

    const hashedPassword = password ? await this.hashManager.hash(password) : userDB.password;

    const updatedUser = new User(
      userDB.id,
      name || userDB.name,
      email || userDB.email,
      hashedPassword,
      userDB.role,
      userDB.created_at,
      birthdate || userDB.birthdate,
      address || userDB.address,
      number || userDB.number,
      neighborhood || userDB.neighborhood,
      city || userDB.city,
      country || userDB.country,
      gender || userDB.gender
    );

    const updatedUserDB: UserDB = {
      id: updatedUser.getId(),
      name: updatedUser.getName(),
      email: updatedUser.getEmail(),
      password: updatedUser.getPassword(),
      role: updatedUser.getRole(),
      created_at: updatedUser.getCreatedAt(),
      birthdate: updatedUser.getBirthdate(),
      address: updatedUser.getAddress(),
      number: updatedUser.getNumber(),
      neighborhood: updatedUser.getNeighborhood(),
      city: updatedUser.getCity(),
      country: updatedUser.getCountry(),
      gender: updatedUser.getGender()
    };

    await this.userDatabase.updateUser(idToEdit, updatedUserDB);

    if (phones && phones.length > 0) {
      await this.userDatabase.deletePhonesByUserId(idToEdit);
      for (const phone of phones) {
        await this.userDatabase.insertPhone(idToEdit, phone);
      }
    }

    const output: CreateUserOutputDTO = {
      message: "Edição realizada com sucesso",
      user: {
        id: updatedUser.getId(),
        name: updatedUser.getName(),
        email: updatedUser.getEmail(),
        createdAt: updatedUser.getCreatedAt()
      }
    };

    return output;
  };

}
