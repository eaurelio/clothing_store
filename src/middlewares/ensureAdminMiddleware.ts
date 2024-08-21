import { Request, Response, NextFunction } from 'express';
import { USER_ROLES } from '../models/User';
import { ForbiddenError } from '../errors/Errors';
import { ErrorHandler } from '../errors/ErrorHandler';

export const ensureAdmin = (requiredRole: USER_ROLES) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = USER_ROLES.ADMIN;
      if (userRole !== requiredRole) {
        throw new ForbiddenError('You have not permission to access this route');
      }

      next();
    } catch (error) {
      ErrorHandler.handleError(error, res);
    }
  };
};
