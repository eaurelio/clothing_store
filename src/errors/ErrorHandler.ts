import { Response } from "express";
import { ZodError } from "zod";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  ForbiddenError,
} from "./Errors";

export default class ErrorHandler {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static handleError(error: any, res: Response): void {
    console.error(error);

    if (error instanceof ZodError) {
      res.status(400).send({ errors: error.issues });
    } else if (
      error instanceof BadRequestError ||
      error instanceof ConflictError ||
      error instanceof ForbiddenError ||
      error instanceof NotFoundError ||
      error instanceof UnauthorizedError
    ) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Unexpected error" });
    }
  }
}
