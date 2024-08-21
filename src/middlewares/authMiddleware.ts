import { ForbiddenError, UnauthorizedError } from './../errors/Errors';
import { Request, Response, NextFunction } from 'express';
import TokenService from '../services/TokenService';
import { ErrorHandler } from '../errors/ErrorHandler';
import { USER_ROLES, UserDB } from '../models/User'; 
import { UserDatabase } from '../database/UserDatabase';

export const authMiddleware = (requiredRoles?: USER_ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenService = new TokenService();
      const token = req.headers.authorization;

      if (!token) {
        throw new UnauthorizedError('Token is required');
      }

      const payload = tokenService.verifyToken(token);

      if (!payload) {
        throw new UnauthorizedError('Invalid or expired Token');
      }

      const role = payload.role;
      if (!(role in USER_ROLES)) {
        throw new UnauthorizedError('Invalid userRole');
      }

      const userRole = role as USER_ROLES;

      const userDatabase = new UserDatabase();
      const userFromDb = await userDatabase.findUserById(payload.userId);

      if (!userFromDb || !userFromDb.active) {
        throw new ForbiddenError('Account deactivated');
      }

      const user: Partial<UserDB> = {
        id: payload.userId,
        role: userRole,
      };

      req.user = user as UserDB;

      if (requiredRoles && !requiredRoles.includes(userRole)) {
        throw new ForbiddenError('You have not permission to access this route');
      }

      next();
    } catch (error) {
      ErrorHandler.handleError(error, res);
    }
  };
};

