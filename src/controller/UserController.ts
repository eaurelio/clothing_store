// import { GetAllUserSchema } from './../dtos/users/getUser.dto';
// import { CreateUserSchema } from './../dtos/users/createUser.dto';
// import { Request, Response } from "express"
// import { UserBusiness } from "../business/UserBusiness"

// import { LoginSchema } from "../dtos/users/login"
// import { UpdateUserSchema } from "../dtos/users/updateUser.dto"
// import { UnauthorizedError } from "../errors/UnauthorizedError"
// import { NotFoundError } from "../errors/NotFoundError"
// import { BadRequestError } from "../errors/BadRequestError"
// import { GetUserSchema } from '../dtos/users/getUser.dto';
// import { PhoneDeleteSchema, PhoneInputSchema } from '../dtos/users/phone';

// export class UserController {
//   constructor(
//     private userBusiness : UserBusiness
//   ){}

//   public createUser = async (req: Request, res: Response) => {
//     try {
//       const input = CreateUserSchema.parse(
//         {
//           personal_id: req.body.personal_id,
//           entity_type: req.body.entity_type,
//           name: req.body.name,
//           email: req.body.email,
//           password: req.body.password,
//           birthdate: req.body.birthdate,
//           address: req.body.address,
//           number: req.body.number,
//           neighborhood: req.body.neighborhood,
//           city: req.body.city,
//           country: req.body.country,
//           gender: req.body.gender,
//           phones: req.body.phones
//         }
//       ) 
  
//       const output = await this.userBusiness.createUser(input);
  
//       res.status(201).send(output);

//     } catch (error) {
//       console.log(error);
  
//       if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof UnauthorizedError) {
//         res.status(error.statusCode).json({ message: error.message });
//       } else {
//         res.status(500).json({ message: 'Unexpected error' });
//       }
//     }
//   };
  

//   public login = async (req: Request, res: Response) => {
//     try {
//       const input = LoginSchema.parse({
//         email: req.body.email,
//         password: req.body.password
//       })

//       const output = await this.userBusiness.login(input)

//       res.status(200).send(output)
//     } catch (error) {
//       console.log(error)

//        if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof UnauthorizedError) {
//         res.status(error.statusCode).json({ message: error.message });
//       } else {
//         res.status(500).json({ message: 'Unexpected error' });
//       }
//     }
//   }

//   public getUserData = async (req: Request, res: Response) => {
//     try {
//       const input = GetUserSchema.parse({
//         id: req.params.id as string,
//         token: req.headers.authorization as string
//       })

//       const output = await this.userBusiness.getUserData(input)

//       res.status(200).send(output)
//     } catch (error) {
//       console.log(error)

//     if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof UnauthorizedError) {
//         res.status(error.statusCode).json({ message: error.message });
//       } else {
//         res.status(500).json({ message: 'Unexpected error' });
//       }
//     }
//   }

//   public getAllUsers = async (req: Request, res: Response) => {
//     try {
//       const input = GetAllUserSchema.parse({
//         q: req.query.q as string,
//         token: req.headers.authorization as string
//       })

//       const output = await this.userBusiness.getAllUsers(input)

//       res.status(200).send(output)
//     } catch (error) {
//       console.log(error)

//       if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof UnauthorizedError) {
//         res.status(error.statusCode).json({ message: error.message });
//       } else {
//         res.status(500).json({ message: 'Unexpected error' });
//       }
//     }
//   }

//   public editUser = async (req: Request, res: Response) => {
//     try {
//       const token = req.headers.authorization as string;
//       const idToEdit = req.params.id as string;

//       const input = UpdateUserSchema.parse({
//         id: idToEdit,
//         personal_id: req.body.personal_id,
//         entity_type: req.body.entity_type,
//         name: req.body.name,
//         email: req.body.email,
//         password: req.body.password,
//         birthdate: req.body.birthdate,
//         address: req.body.address,
//         number: req.body.number,
//         neighborhood: req.body.neighborhood,
//         city: req.body.city,
//         country: req.body.country,
//         gender: req.body.gender,
//         phones: req.body.phones
//       })
  
//       const output = await this.userBusiness.editUser(idToEdit, input, token);
  
//       res.status(200).send(output);
//     } catch (error) {
//       console.log(error);
  
//       if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof UnauthorizedError) {
//         res.status(error.statusCode).json({ message: error.message });
//       } else {
//         res.status(500).json({ message: 'Unexpected error' });
//       }
//     }
//   };

//   // USER PHONE

//   public addPhone = async (req: Request, res: Response) => {
//     try {
//       const input = PhoneInputSchema.parse({
//         userId: req.params.id,
//         token: req.headers.authorization,
//         phoneId: req.body.phoneId,
//         number: req.body.number,
//         type: req.body.type
//       })

//       const output = await this.userBusiness.addPhone(input);

//       res.status(200).json(output);
//     } catch (error) {
//       console.log(error);

//       if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof UnauthorizedError) {
//         res.status(error.statusCode).json({ message: error.message });
//       } else {
//         res.status(500).json({ message: 'Unexpected error' });
//       }
//     }
//   };
  
//   public updatePhone = async (req: Request, res: Response) => {
//     try {
//       const input = PhoneInputSchema.parse({
//         userId: req.params.id,
//         token: req.headers.authorization,
//         phoneId: req.body.phoneId,
//         number: req.body.number,
//         type: req.body.type
//       })

//       const output = await this.userBusiness.updatePhone(input);

//       res.status(200).json(output);
//     } catch (error) {
//       console.log(error);

//       if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof UnauthorizedError) {
//         res.status(error.statusCode).json({ message: error.message });
//       } else {
//         res.status(500).json({ message: 'Unexpected error' });
//       }
//     }
//   };

//   public deletePhone = async (req: Request, res: Response) => {
//     try {
//       const input = PhoneDeleteSchema.parse({
//         userId: req.params.id,
//         token: req.headers.authorization,
//         phoneId: req.body.phoneId
//       })

//       const output = await this.userBusiness.deletePhone(input);

//       res.status(200).json(output);
//     } catch (error) {
//       console.log(error);

//       if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof UnauthorizedError) {
//         res.status(error.statusCode).json({ message: error.message });
//       } else {
//         res.status(500).json({ message: 'Unexpected error' });
//       }
//     }
//   };
 
// }


import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { CreateUserSchema } from "../dtos/users/createUser.dto";
import { LoginSchema } from "../dtos/users/login";
import { UpdateUserSchema } from "../dtos/users/updateUser.dto";
import { GetUserSchema, GetAllUserSchema } from "../dtos/users/getUser.dto";
import { PhoneDeleteSchema, PhoneInputSchema } from "../dtos/users/phone";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { NotFoundError } from "../errors/NotFoundError";
import { BadRequestError } from "../errors/BadRequestError";

export class UserController {
  constructor(private userBusiness: UserBusiness) {}

  public createUser = async (req: Request, res: Response) => {
    try {
      const input = CreateUserSchema.parse({
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
        phones: req.body.phones,
      });

      const output = await this.userBusiness.createUser(input);
      res.status(201).send(output);
    } catch (error) {
      console.log(error);
      if (
        error instanceof BadRequestError ||
        error instanceof NotFoundError ||
        error instanceof UnauthorizedError
      ) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unexpected error" });
      }
    }
  };

  public login = async (req: Request, res: Response) => {
    try {
      const input = LoginSchema.parse({
        email: req.body.email,
        password: req.body.password,
      });

      const output = await this.userBusiness.login(input);
      res.status(200).send(output);
    } catch (error) {
      console.log(error);
      if (
        error instanceof BadRequestError ||
        error instanceof NotFoundError ||
        error instanceof UnauthorizedError
      ) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unexpected error" });
      }
    }
  };

  public getUserData = async (req: Request, res: Response) => {
    try {
      const input = GetUserSchema.parse({
        id: req.params.id as string,
        token: req.headers.authorization as string,
      });

      const output = await this.userBusiness.getUserData(input);
      res.status(200).send(output);
    } catch (error) {
      console.log(error);
      if (
        error instanceof BadRequestError ||
        error instanceof NotFoundError ||
        error instanceof UnauthorizedError
      ) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unexpected error" });
      }
    }
  };

  public getAllUsers = async (req: Request, res: Response) => {
    try {
      const input = GetAllUserSchema.parse({
        q: req.query.q as string,
        token: req.headers.authorization as string,
      });

      const output = await this.userBusiness.getAllUsers(input);
      res.status(200).send(output);
    } catch (error) {
      console.log(error);
      if (
        error instanceof BadRequestError ||
        error instanceof NotFoundError ||
        error instanceof UnauthorizedError
      ) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unexpected error" });
      }
    }
  };

  public editUser = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization as string;
      const idToEdit = req.params.id as string;

      const input = UpdateUserSchema.parse({
        id: idToEdit,
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
        phones: req.body.phones,
      });

      const output = await this.userBusiness.editUser(idToEdit, input, token);
      res.status(200).send(output);
    } catch (error) {
      console.log(error);
      if (
        error instanceof BadRequestError ||
        error instanceof NotFoundError ||
        error instanceof UnauthorizedError
      ) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unexpected error" });
      }
    }
  };

  // USER PHONE

  public addPhone = async (req: Request, res: Response) => {
    try {
      const input = PhoneInputSchema.parse({
        userId: req.params.id,
        token: req.headers.authorization,
        phoneId: req.body.phoneId,
        number: req.body.number,
        type: req.body.type,
      });

      const output = await this.userBusiness.addPhone(input);
      res.status(200).json(output);
    } catch (error) {
      console.log(error);
      if (
        error instanceof BadRequestError ||
        error instanceof NotFoundError ||
        error instanceof UnauthorizedError
      ) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unexpected error" });
      }
    }
  };

  public updatePhone = async (req: Request, res: Response) => {
    try {
      const input = PhoneInputSchema.parse({
        userId: req.params.id,
        token: req.headers.authorization,
        phoneId: req.body.phoneId,
        number: req.body.number,
        type: req.body.type,
      });

      const output = await this.userBusiness.updatePhone(input);
      res.status(200).json(output);
    } catch (error) {
      console.log(error);
      if (
        error instanceof BadRequestError ||
        error instanceof NotFoundError ||
        error instanceof UnauthorizedError
      ) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unexpected error" });
      }
    }
  };

  public deletePhone = async (req: Request, res: Response) => {
    try {
      const input = PhoneDeleteSchema.parse({
        userId: req.params.id,
        token: req.headers.authorization,
        phoneId: req.body.phoneId,
      });

      const output = await this.userBusiness.deletePhone(input);
      res.status(200).json(output);
    } catch (error) {
      console.log(error);
      if (
        error instanceof BadRequestError ||
        error instanceof NotFoundError ||
        error instanceof UnauthorizedError
      ) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unexpected error" });
      }
    }
  };
}

