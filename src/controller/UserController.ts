import { Request, Response } from "express"
import { UserBusiness } from "../business/UserBusiness"
import { BaseError } from "../errors/BaseError"
import { CreateUserInputDTO, CreateUserSchema } from "../dtos/users/createUser.dto"
import {ZodError} from 'zod'
import { LoginSchema } from "../dtos/users/login"

export class UserController {
  constructor(
    private userBusiness : UserBusiness
  ){}

  public createUser = async (req: Request, res: Response) => {
    try {
      const input: CreateUserInputDTO = {
        personal_id: req.body.personal_id,
        entity_type: req.body.entity_type,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        birthdate: req.body.birthdate,
        address: req.body.address,
        number: req.body.number,
        neighborhood: req.body.neighborhood,
        city: req.body.city,
        country: req.body.country,
        gender: req.body.gender,
        phones: req.body.phones // Verifique se o corpo da requisição possui o campo phones
      };
  
      const output = await this.userBusiness.createUser(input);
  
      res.status(201).send(output);
    } catch (error) {
      console.log(error);
  
      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
  

  public login = async (req: Request, res: Response) => {
    try {
      const input = LoginSchema.parse({
        email: req.body.email,
        password: req.body.password
      })

      const output = await this.userBusiness.login(input)

      res.status(200).send(output)
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Unexpected Error")
      }
    }
  }

  public getUsers = async (req: Request, res: Response) => {
    try {
      const input = {
        q: req.query.q as string | undefined,
        token: req.headers.authorization as string
      }

      const output = await this.userBusiness.getUsers(input)

      res.status(200).send(output)
    } catch (error) {
      console.log(error)

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  public editUser = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization as string;
      const idToEdit = req.headers.id as string;

      console.log('id to edit', idToEdit)

      const input: CreateUserInputDTO = {
        personal_id: req.body.personal_id,
        entity_type: req.body.entity_type,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        birthdate: req.body.birthdate,
        address: req.body.address,
        number: req.body.number,
        neighborhood: req.body.neighborhood,
        city: req.body.city,
        country: req.body.country,
        gender: req.body.gender,
        phones: req.body.phones // Verifique se o corpo da requisição possui o campo phones
      };
  
      const output = await this.userBusiness.editUser(idToEdit, input, token);
  
      res.status(200).send(output);
    } catch (error) {
      console.log(error);
  
      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
 
}