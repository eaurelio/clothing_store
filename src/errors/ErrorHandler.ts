import { Response } from "express";
import { ZodError } from "zod";
import { BadRequestError } from "./BadRequestError";
import { NotFoundError } from "./NotFoundError";
import { UnauthorizedError } from "./UnauthorizedError";
import { ConflictError } from "./ConflictError";
import { ForbiddenError } from "./ForbiddenError";

export class ErrorHandler {
  public static handleError(error: any, res: Response): void {
    console.log(error);
    if (error instanceof ZodError) {
      res.status(400).send(error.issues);
    } else if (
      error instanceof BadRequestError ||
      error instanceof NotFoundError ||
      error instanceof UnauthorizedError ||
      error instanceof ConflictError || 
      error instanceof ForbiddenError
    ) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Unexpected error" });
    }
  }
}
