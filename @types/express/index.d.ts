import { UserDB } from "../../src/models/User"; 

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

export {};
