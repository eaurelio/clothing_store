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

//   public createUser = async (input: CreateUserInputDTO): Promise<CreateUserOutputDTO> => {
//   const { name, email, password, birthdate, address, number, neighborhood, city, country, gender } = input;

//   const userDBExists = await this.userDatabase.findUserByEmail(email);

//   if (userDBExists) {
//     throw new BadRequestError("'email' already exists");
//   }

//   const id = this.idGenerator.generate();

//   // Hash the password before creating the user
//   const hashedPassword = await this.hashManager.hash(password);

//   const newUser = new User(
//     id,
//     name,
//     email,
//     hashedPassword,
//     USER_ROLES.ADMIN,
//     new Date().toISOString()
//   );

//   const newUserDB: UserDB = {
//     id: newUser.getId(),
//     name: newUser.getName(),
//     email: newUser.getEmail(),
//     password: newUser.getPassword(),
//     role: newUser.getRole(),
//     created_at: newUser.getCreatedAt()
//   };

//   await this.userDatabase.insertUser(newUserDB);

//   const token = this.tokenService.generateToken(newUser.getId());

//   const output: CreateUserOutputDTO = {
//     message: "User created successfully",
//     user: {
//       id: newUser.getId(),
//       name: newUser.getName(),
//       email: newUser.getEmail(),
//       createdAt: newUser.getCreatedAt(),
//       token: token
//     },
//   };

//   return output;
// };

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
    birthdate: newUser.birthdate(),
    address: newUser.address(),
    number: newUser.number(),
    neighborhood: newUser.neighborhood(),
    city: newUser.city(),
    country: newUser.country(),
    gender: newUser.gender()
  };

  await this.userDatabase.insertUser(newUserDB);

  if (input.phones && input.phones.length > 0) {
    for (const phone of input.phones) {
      await this.userDatabase.insertPhone(newUser.getId(), phone.number);
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

public login = async (
  input: LoginInputDTO
): Promise<LoginOutputDTO> => {
  const { email, password } = input

  const userDB = await this.userDatabase.findUserByEmail(email)

  if (!userDB) {
    throw new NotFoundError("'email' não encontrado")
  }

  const hashedPassword = userDB.password
  const isPasswordCorrect = await this.hashManager.compare(password, hashedPassword)

  if (!isPasswordCorrect) {
    throw new BadRequestError("'email' ou 'password' incorretos")
  }

  const user = new User(
    userDB.id,
    userDB.name,
    userDB.email,
    userDB.password,
    userDB.role,
    userDB.created_at
  )

  const token = this.tokenService.generateToken(user.getId())

  const output: LoginOutputDTO = {
    message: "Login realizado com sucesso",
    user: {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      token: token
    }
  }

  return output
}

  
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



  public editUser = async (idToEdit: any, input: CreateUserInputDTO) : Promise<CreateUserOutputDTO> => {
    const id = idToEdit;
    const {name, email, password } = input

    if (typeof idToEdit !== "string") {
      throw new BadRequestError("id a ser editado é obrigatório e deve ser string")
    }

    const userDB = await this.userDatabase.findUserById(idToEdit)

    if (!userDB) {
      throw new NotFoundError("id a ser editado não existe")
    }

    const user = new User(
      userDB.id,
      userDB.name,
      userDB.email,
      userDB.password,
      userDB.role,
      userDB.created_at
    ) // yyyy-mm-ddThh:mm:sssZ

    id && user.setId(id)
    name && user.setName(name)
    email && user.setEmail(email)
    password && user.setPassword(password)

    const updatedUserDB: UserDB = {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      password: user.getPassword(),
      role: user.getRole(),
      created_at: user.getCreatedAt()
    }

    await this.userDatabase.updateUser(idToEdit, updatedUserDB)

    const output : CreateUserOutputDTO= {
      message: "Edição realizada com sucesso",
      user: {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        createdAt: user.getCreatedAt()
      }
    }

    return output
  }
}
