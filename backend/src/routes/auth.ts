// =====================================================
// ROUTES - Authentification
// =====================================================

import { Router } from 'express';
import {
  loginController,
  logoutController,
  getMeController,
  refreshTokenController,
} from '../controllers/authController';
import { authenticate } from '../middlewares/auth';
import { loginRateLimiter } from '../middlewares/rateLimiter';
import { validateRequired } from '../middlewares/validation';

const router = Router();

// =====================================================
// POST /api/auth/login - Connexion
// =====================================================
router.post(
  '/login',
  loginRateLimiter,
  validateRequired(['username', 'password']),
  loginController
);

// =====================================================
// POST /api/auth/logout - Déconnexion
// =====================================================
router.post('/logout', authenticate, logoutController);

// =====================================================
// GET /api/auth/me - Récupérer profil connecté
// =====================================================
router.get('/me', authenticate, getMeController);

// =====================================================
// POST /api/auth/refresh - Rafraîchir le token
// =====================================================
router.post('/refresh', refreshTokenController);

export default router;
