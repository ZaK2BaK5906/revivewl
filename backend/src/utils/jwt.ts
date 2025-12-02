// =====================================================
// UTILITAIRES JWT - JSON Web Tokens
// =====================================================

import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';
import { unauthorized } from '../middlewares/errorHandler';
import logger from './logger';

// =====================================================
// Clés secrètes
// =====================================================
const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE_THIS_SECRET_KEY_IN_PRODUCTION';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'CHANGE_THIS_REFRESH_SECRET_KEY';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Vérification des clés en production
if (process.env.NODE_ENV === 'production') {
  if (JWT_SECRET === 'CHANGE_THIS_SECRET_KEY_IN_PRODUCTION') {
    logger.error('⚠️  JWT_SECRET par défaut détecté en production ! Changez-le immédiatement !');
  }
  if (JWT_REFRESH_SECRET === 'CHANGE_THIS_REFRESH_SECRET_KEY') {
    logger.error('⚠️  JWT_REFRESH_SECRET par défaut détecté en production ! Changez-le immédiatement !');
  }
}

// =====================================================
// Générer un Access Token
// =====================================================
export const generateAccessToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'fivem-wl-panel',
    audience: 'fivem-wl-admins',
  });
};

// =====================================================
// Générer un Refresh Token
// =====================================================
export const generateRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
    issuer: 'fivem-wl-panel',
    audience: 'fivem-wl-admins',
  });
};

// =====================================================
// Générer les deux tokens
// =====================================================
export const generateTokens = (payload: JWTPayload) => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return { accessToken, refreshToken };
};

// =====================================================
// Vérifier un Access Token
// =====================================================
export const verifyAccessToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'fivem-wl-panel',
      audience: 'fivem-wl-admins',
    }) as JWTPayload;

    return decoded;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw unauthorized('Token expiré. Veuillez vous reconnecter.');
    }
    if (error.name === 'JsonWebTokenError') {
      throw unauthorized('Token invalide.');
    }
    throw unauthorized('Erreur d\'authentification.');
  }
};

// =====================================================
// Vérifier un Refresh Token
// =====================================================
export const verifyRefreshToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'fivem-wl-panel',
      audience: 'fivem-wl-admins',
    }) as JWTPayload;

    return decoded;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw unauthorized('Refresh token expiré. Veuillez vous reconnecter.');
    }
    if (error.name === 'JsonWebTokenError') {
      throw unauthorized('Refresh token invalide.');
    }
    throw unauthorized('Erreur d\'authentification.');
  }
};

// =====================================================
// Décoder un token sans vérification (utile pour débugger)
// =====================================================
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
};

// =====================================================
// Extraire le token du header Authorization
// =====================================================
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};

// =====================================================
// Calculer l'expiration d'un token
// =====================================================
export const getTokenExpiration = (token: string): Date | null => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;

  return new Date(decoded.exp * 1000);
};

// =====================================================
// Vérifier si un token est expiré
// =====================================================
export const isTokenExpired = (token: string): boolean => {
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;

  return expiration < new Date();
};
