// =====================================================
// MIDDLEWARE - Authentification JWT
// =====================================================

import { Request, Response, NextFunction } from 'express';
import { AuthRequest, AdminSafeData } from '../types';
import { verifyAccessToken, extractTokenFromHeader } from '../utils/jwt';
import { unauthorized, forbidden } from './errorHandler';
import { query } from '../config/database';
import logger from '../utils/logger';

// =====================================================
// Middleware: Vérifier le token JWT
// =====================================================
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extraire le token du header Authorization
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      throw unauthorized('Token manquant. Veuillez vous authentifier.');
    }

    // Vérifier le token
    const decoded = verifyAccessToken(token);

    // Récupérer les infos de l'admin depuis la BDD
    const [admins] = await query<any[]>(
      'SELECT id, username, email, avatar, permissions_json, is_master, is_active, two_fa_enabled, created_at, last_login FROM admins WHERE id = ? AND is_active = TRUE',
      [decoded.adminId]
    );

    if (!admins || admins.length === 0) {
      throw unauthorized('Utilisateur non trouvé ou désactivé.');
    }

    const admin: AdminSafeData = admins[0];

    // Attacher l'admin à la requête
    req.admin = admin;
    req.adminId = admin.id;

    // Mettre à jour last_activity
    await query('UPDATE admins SET last_activity = NOW() WHERE id = ?', [admin.id]);

    next();
  } catch (error) {
    next(error);
  }
};

// =====================================================
// Middleware: Vérifier si Master Admin
// =====================================================
export const requireMaster = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.admin) {
    return next(unauthorized('Non authentifié.'));
  }

  if (!req.admin.is_master) {
    return next(forbidden('Accès réservé au Master Admin uniquement.'));
  }

  next();
};

// =====================================================
// Middleware: Vérifier une permission spécifique
// =====================================================
export const requirePermission = (permission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return next(unauthorized('Non authentifié.'));
    }

    // Master Admin a toutes les permissions
    if (req.admin.is_master) {
      return next();
    }

    // Vérifier la permission
    const permissions = req.admin.permissions_json;
    if (!permissions) {
      return next(forbidden('Aucune permission définie.'));
    }

    const hasPermission = (permissions as any)[permission];
    if (!hasPermission) {
      return next(forbidden(`Permission requise: ${permission}`));
    }

    next();
  };
};

// =====================================================
// Middleware optionnel: Authentifier si token présent
// =====================================================
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (token) {
      const decoded = verifyAccessToken(token);
      const [admins] = await query<any[]>(
        'SELECT id, username, email, avatar, permissions_json, is_master, is_active FROM admins WHERE id = ? AND is_active = TRUE',
        [decoded.adminId]
      );

      if (admins && admins.length > 0) {
        req.admin = admins[0];
        req.adminId = admins[0].id;
      }
    }

    next();
  } catch (error) {
    // En cas d'erreur, on continue sans authentification
    next();
  }
};
