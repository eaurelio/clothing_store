import { ForbiddenError } from './../errors/ForbiddenError';
import { UnauthorizedError } from './../errors/UnauthorizedError';
import { Request, Response, NextFunction } from 'express';
import TokenService from '../services/TokenService';
import { ErrorHandler } from '../errors/ErrorHandler';
import { USER_ROLES, UserDB } from '../models/User'; 
import { UserDatabase } from '../database/UserDatabase'; // Importando o UserDatabase

export const authMiddleware = (requiredRoles?: USER_ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenService = new TokenService();
      const token = req.headers.authorization;

      if (!token) {
        throw new UnauthorizedError('Token não fornecido');
      }

      const payload = tokenService.verifyToken(token);

      if (!payload) {
        throw new UnauthorizedError('Token inválido ou expirado');
      }

      const role = payload.role;
      if (!(role in USER_ROLES)) {
        throw new UnauthorizedError('Papel de usuário inválido');
      }

      const userRole = role as USER_ROLES;

      // Consultando o banco de dados para verificar se o usuário está ativo
      const userDatabase = new UserDatabase();
      const userFromDb = await userDatabase.findUserById(payload.userId);

      if (!userFromDb || !userFromDb.active) {
        throw new ForbiddenError('Conta desativada. Acesse o suporte para mais informações.');
      }

      // Ajuste para garantir que o user esteja no formato UserDB
      const user: Partial<UserDB> = {
        id: payload.userId,
        role: userRole,
        // Adicione outros campos conforme necessário
      };

      req.user = user as UserDB;

      if (requiredRoles && !requiredRoles.includes(userRole)) {
        throw new ForbiddenError('Você não tem permissão para acessar esta rota');
      }

      next();
    } catch (error) {
      ErrorHandler.handleError(error, res);
    }
  };
};

