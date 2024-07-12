import { HashManager } from '../services/HashManager';
import { UserDatabase } from "../database/UserDatabase"
import { CreateUserInputDTO, CreateUserOutputDTO } from "../dtos/users/createUser.dto"
import { LoginInputDTO, LoginOutputDTO } from "../dtos/users/login"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { User, UserDB, USER_ROLES, } from "../models/User"
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
  const { name, email, password, birthdate, address, number, neighborhood, city, country, gender, phones } = input;

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

  public editUser = async (idToEdit: string, input: UpdateUserInputDTO): Promise<UpdateUserOutputDTO> => {
      if (typeof idToEdit !== "string") {
          throw new BadRequestError("O ID a ser editado é obrigatório e deve ser uma string");
      }

      const userDB = await this.userDatabase.findUserById(idToEdit);

      if (!userDB) {
          throw new NotFoundError("'UserId' not found");
      }

      // Verifica se há senha para hash ou mantém a senha existente
      const hashedPassword = input.password ? await this.hashManager.hash(input.password) : userDB.password;

      // Atualiza apenas os campos fornecidos em `input`
      const updatedUser: UserDB = {
          id: idToEdit,
          name: input.name || userDB.name,
          email: input.email || userDB.email,
          password: hashedPassword,
          birthdate: input.birthdate || userDB.birthdate,
          address: input.address || userDB.address,
          number: input.number || userDB.number,
          neighborhood: input.neighborhood || userDB.neighborhood,
          city: input.city || userDB.city,
          country: input.country || userDB.country,
          gender: input.gender || userDB.gender,
          role: userDB.role,
          created_at: userDB.created_at
      };

      // Atualiza o usuário no banco de dados com os campos atualizados
      await this.userDatabase.updateUser(idToEdit, updatedUser);

      // Retorna os dados atualizados do usuário
      const updatedUserData = await this.userDatabase.findUserById(idToEdit);

      // Verifica se `updatedUserData` é definido antes de acessar suas propriedades
      if (!updatedUserData) {
          throw new NotFoundError("Não foi possível encontrar os dados atualizados do usuário após a edição");
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
}
