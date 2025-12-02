// =====================================================
// MIDDLEWARE - Validation des données
// =====================================================

import { Request, Response, NextFunction } from 'express';
import { badRequest } from './errorHandler';

// =====================================================
// Helper: Valider les champs requis
// =====================================================
export const validateRequired = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missing: string[] = [];

    for (const field of fields) {
      if (!req.body[field] && req.body[field] !== 0 && req.body[field] !== false) {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return next(badRequest(`Champs requis manquants: ${missing.join(', ')}`));
    }

    next();
  };
};

// =====================================================
// Validation email
// =====================================================
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// =====================================================
// Validation Discord
// =====================================================
export const validateDiscord = (discord: string): boolean => {
  // Format: username#1234 ou nouveau format @username
  const discordRegex = /^(@[\w\d._]{2,32}|[\w\d._]{2,32}#\d{4})$/;
  return discordRegex.test(discord);
};

// =====================================================
// Validation âge
// =====================================================
export const validateAge = (age: number): boolean => {
  return age >= 18 && age <= 100;
};

// =====================================================
// Sanitize string (protection XSS basique)
// =====================================================
export const sanitizeString = (str: string): string => {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// =====================================================
// Validation pagination
// =====================================================
export const validatePagination = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  if (page < 1) {
    return next(badRequest('Page doit être >= 1'));
  }

  if (limit < 1 || limit > 100) {
    return next(badRequest('Limit doit être entre 1 et 100'));
  }

  req.query.page = page.toString();
  req.query.limit = limit.toString();

  next();
};
