// =====================================================
// MIDDLEWARE - Gestion des erreurs
// =====================================================

import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { ApiResponse } from '../types';

// =====================================================
// Classe d'erreur personnalisée
// =====================================================
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// =====================================================
// Middleware de gestion d'erreurs
// =====================================================
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur interne du serveur';

  // Log de l'erreur
  if (statusCode >= 500) {
    logger.error('Erreur serveur:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      body: req.body,
    });
  } else {
    logger.warn('Erreur client:', {
      message: err.message,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
    });
  }

  // Réponse au client
  const response: ApiResponse = {
    success: false,
    message,
  };

  // En développement, inclure la stack trace
  if (process.env.NODE_ENV === 'development') {
    response.error = err.stack;
  }

  res.status(statusCode).json(response);
};

// =====================================================
// Helper pour créer des erreurs
// =====================================================
export const createError = (message: string, statusCode: number = 500) => {
  return new AppError(message, statusCode);
};

// Erreurs courantes
export const badRequest = (message: string = 'Requête invalide') => {
  return new AppError(message, 400);
};

export const unauthorized = (message: string = 'Non autorisé') => {
  return new AppError(message, 401);
};

export const forbidden = (message: string = 'Accès interdit') => {
  return new AppError(message, 403);
};

export const notFoundError = (message: string = 'Ressource non trouvée') => {
  return new AppError(message, 404);
};

export const conflict = (message: string = 'Conflit') => {
  return new AppError(message, 409);
};

export const internalError = (message: string = 'Erreur interne du serveur') => {
  return new AppError(message, 500);
};
