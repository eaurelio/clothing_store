import { Request, Response } from "express"
import { UserBusiness } from "../business/UserBusiness"
import { BaseError } from "../errors/BaseError"
import { CreateUserSchema } from "../dtos/users/createUser.dto"
import {ZodError} from 'zod'
import { LoginSchema } from "../dtos/users/login"
// import { HashManager } from "../services/HashManager"

export class UserController {
  constructor(
    private userBusiness : UserBusiness
  ){}

  public createUser = async (req: Request, res: Response)=> {
    try {
      const input = CreateUserSchema.parse({
        // id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      })

      const output = await this.userBusiness.createUser(input)

      res.status(201).send(output)
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

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
        res.status(500).send("Erro inesperado")
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
      const idToEdit =  req.params.id
      const input = CreateUserSchema.parse({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      })

      const output = await this.userBusiness.editUser(idToEdit, input)

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
}