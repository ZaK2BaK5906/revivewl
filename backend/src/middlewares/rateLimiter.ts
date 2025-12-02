// =====================================================
// MIDDLEWARE - Rate Limiting
// =====================================================

import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { logSecurity } from '../utils/logger';

// =====================================================
// Rate limiter global
// =====================================================
export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes par défaut
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100 requêtes par fenêtre
  message: {
    success: false,
    message: 'Trop de requêtes, veuillez réessayer plus tard.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    logSecurity('Rate limit dépassé', {
      ip: req.ip,
      url: req.originalUrl,
      method: req.method,
    });

    res.status(429).json({
      success: false,
      message: 'Trop de requêtes. Veuillez patienter avant de réessayer.',
    });
  },
});

// =====================================================
// Rate limiter strict pour les routes de connexion
// =====================================================
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.LOGIN_RATE_LIMIT_MAX || '5'), // 5 tentatives maximum
  message: {
    success: false,
    message: 'Trop de tentatives de connexion. Compte temporairement bloqué.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Ne compte que les échecs
  handler: (req: Request, res: Response) => {
    logSecurity('Tentatives de connexion multiples', {
      ip: req.ip,
      username: req.body.username,
    });

    res.status(429).json({
      success: false,
      message: 'Trop de tentatives de connexion échouées. Veuillez réessayer dans 15 minutes.',
    });
  },
});

// =====================================================
// Rate limiter pour les API publiques
// =====================================================
export const publicApiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: parseInt(process.env.API_RATE_LIMIT || '100'),
  message: {
    success: false,
    message: 'Limite d\'utilisation de l\'API atteinte.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// =====================================================
// Rate limiter pour les uploads de fichiers
// =====================================================
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 20, // 20 uploads par heure
  message: {
    success: false,
    message: 'Trop d\'uploads. Veuillez patienter.',
  },
});
