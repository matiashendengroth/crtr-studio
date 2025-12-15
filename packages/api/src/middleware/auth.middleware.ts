// Authentication middleware - verifies JWT tokens
import { Request, Response, NextFunction } from 'express';
import { JWTUtil } from '../utils/jwt.util';
import { AppError } from './error-handler';

// Extend Express Request to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Extract token from Authorization header
    const token = JWTUtil.extractToken(req.headers.authorization);
    
    if (!token) {
      throw new AppError(401, 'No token provided');
    }

    // Verify token
    const payload = JWTUtil.verifyToken(token);

    // Attach user info to request
    req.userId = payload.userId;
    req.userEmail = payload.email;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(401, 'Invalid or expired token');
  }
}

/**
 * Optional auth middleware - doesn't throw if no token
 * Useful for endpoints that work with or without auth
 */
export function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = JWTUtil.extractToken(req.headers.authorization);
    
    if (token) {
      const payload = JWTUtil.verifyToken(token);
      req.userId = payload.userId;
      req.userEmail = payload.email;
    }
  } catch (error) {
    // Silent fail for optional auth
  }

  next();
}


