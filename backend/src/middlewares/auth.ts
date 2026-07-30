import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../config/logger';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        merchantId: string;
      };
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Token de autenticación requerido',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET || 'default-secret-change-me';
    const decoded = jwt.verify(token, secret) as { id: string; merchantId: string };

    req.user = {
      id: decoded.id,
      merchantId: decoded.merchantId,
    };

    next();
  } catch (error) {
    logger.warn('Intento de autenticación fallido');

    return res.status(403).json({
      success: false,
      error: 'Token inválido o expirado',
    });
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const secret = process.env.JWT_SECRET || 'default-secret-change-me';
      const decoded = jwt.verify(token, secret) as { id: string; merchantId: string };

      req.user = {
        id: decoded.id,
        merchantId: decoded.merchantId,
      };
    } catch {
      // Token inválido, continuar sin usuario
    }
  }

  next();
}
