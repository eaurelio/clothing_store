import { Request, Response, NextFunction } from 'express';
import { USER_ROLES } from '../models/User';
import { ForbiddenError, UnauthorizedError } from '../errors/Errors';
import ErrorHandler from "../errors/ErrorHandler";
import TokenService from '../services/TokenService';

export const ensureAdmin = (requiredRole: USER_ROLES) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {

      const tokenService = new TokenService();
      const token = req.headers.authorization as string;
      if(!token) {
        throw new UnauthorizedError('Token is required');
      }
      const payload = tokenService.verifyToken(token);
      if (!payload) {
        throw new UnauthorizedError('Invalid or expired Token');
      }
    
      if (payload.role !== requiredRole) {
        throw new ForbiddenError('You have not permission to access this route');
      }

      next();
    } catch (error) {
      ErrorHandler.handleError(error, res);
    }
  };
};
