// =====================================================
// CONTROLLER - Authentification
// =====================================================

import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as authService from '../services/authService';
import { badRequest } from '../middlewares/errorHandler';
import { validateEmail } from '../middlewares/validation';

// =====================================================
// POST /api/auth/login
// =====================================================
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password, two_fa_token } = req.body;

    // Validation
    if (!username || !password) {
      throw badRequest('Username et password requis');
    }

    const ip = req.ip || req.socket.remoteAddress;

    const result = await authService.login(username, password, two_fa_token, ip);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// =====================================================
// POST /api/auth/logout
// =====================================================
export const logoutController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;

    if (!req.adminId) {
      throw badRequest('Non authentifié');
    }

    if (refreshToken) {
      await authService.logout(req.adminId, refreshToken);
    }

    res.status(200).json({
      success: true,
      message: 'Déconnexion réussie',
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET /api/auth/me
// =====================================================
export const getMeController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.admin) {
      throw badRequest('Non authentifié');
    }

    res.status(200).json({
      success: true,
      message: 'Profil récupéré',
      data: req.admin,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// POST /api/auth/refresh
// =====================================================
export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw badRequest('Refresh token requis');
    }

    // TODO: Implémenter la logique de refresh token
    // Pour l'instant, retourner une erreur
    throw badRequest('Refresh token non implémenté');
  } catch (error) {
    next(error);
  }
};
