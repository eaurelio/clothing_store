import { BaseError } from "./BaseError";

export class BadRequestError extends BaseError {
    constructor(
        message: string = "invalid requisition" 
    ) {
        super(400, message)
    }
}