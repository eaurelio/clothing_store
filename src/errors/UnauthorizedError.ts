import { BaseError } from "./BaseError";

export class UnauthorizedError extends BaseError {
    constructor(
        message: string = "Authentication required" 
    ) {
        super(401, message); 
        this.name = 'UnauthorizedError';
    }
}
