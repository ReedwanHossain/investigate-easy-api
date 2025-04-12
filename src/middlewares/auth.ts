import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config  from '../config';
import prisma from '../utils/prisma';
import { sendErrorResponse } from '../utils/apiResponse';
import { Roles } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        roles: Roles[];
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw Error('Not ')
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, roles: true },
    });

    if (!user) {
      sendErrorResponse(res, 401, 'User not found');
      return
    }

    req.user = {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };
    next();
  } catch (error) {
    sendErrorResponse(res, 401, 'Invalid token');
    return;
  }
};

export const authorize = (allowedRoles: Roles[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      sendErrorResponse(res, 401, 'Authentication required');
      return
    }

    const hasRequiredRole = req.user.roles.some(role => 
      allowedRoles.includes(role)
    );

    if (!hasRequiredRole) {
      sendErrorResponse(res, 403, 'Forbidden');
      return 
    }

    next();
  };
};