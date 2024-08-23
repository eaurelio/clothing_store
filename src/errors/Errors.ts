export abstract class BaseError extends Error {
    constructor(
        public statusCode: number,
        message: string
    ) {
        super(message)
    }
}

export class BadRequestError extends BaseError {
    constructor(
        message: string = "invalid requisition" 
    ) {
        super(400, message)
    }
}

export class ConflictError extends BaseError {
  constructor(
      message: string = "invalid requisition"
  ) {
      super(409, message)
  }
}

export class ForbiddenError extends BaseError {
  constructor(
      message: string = "Access denied"
  ) {
      super(403, message)
  }
}

export class NotFoundError extends BaseError {
  constructor(
      message: string = "Resource not found"
  ) {
      super(404, message)
  }
}

export class UnauthorizedError extends BaseError {
  constructor(
      message: string = "Authentication required" 
  ) {
      super(401, message); 
      this.name = 'UnauthorizedError';
  }
}
