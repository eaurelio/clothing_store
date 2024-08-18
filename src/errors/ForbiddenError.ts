import { BaseError } from "./BaseError";

export class ForbiddenError extends BaseError {
    constructor(
        message: string = "Access denied"
    ) {
        super(403, message)
    }
}