import { BaseError } from "./BaseError";

export class ConflictError extends BaseError {
    constructor(
        message: string = "invalid requisition"
    ) {
        super(409, message)
    }
}