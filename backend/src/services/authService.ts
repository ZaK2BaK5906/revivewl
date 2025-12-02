// =====================================================
// SERVICE - Authentification
// =====================================================

import { query, transaction } from '../config/database';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { generateTokens } from '../utils/jwt';
import { generate2FASecret, verify2FAToken } from '../utils/twoFactor';
import { Admin, AdminSafeData, LoginResponse } from '../types';
import { unauthorized, badRequest } from '../middlewares/errorHandler';
import { logAuth, logSecurity } from '../utils/logger';
import { sendSecurityAlert } from '../utils/discord';

// =====================================================
// Login
// =====================================================
export const login = async (
  username: string,
  password: string,
  twoFAToken?: string,
  ip?: string
): Promise<LoginResponse> => {
  // Récupérer l'admin
  const [admins] = await query<Admin[]>(
    'SELECT * FROM admins WHERE username = ? OR email = ?',
    [username, username]
  );

  if (!admins || admins.length === 0) {
    logSecurity('Tentative de connexion - utilisateur inexistant', { username, ip });
    throw unauthorized('Identifiants incorrects.');
  }

  const admin = admins[0];

  // Vérifier si le compte est actif
  if (!admin.is_active) {
    logSecurity('Tentative de connexion - compte désactivé', { username, ip });
    throw unauthorized('Compte désactivé.');
  }

  // Vérifier si l'IP est bloquée
  if (admin.ip_blocked && admin.blocked_until) {
    const now = new Date();
    const blockedUntil = new Date(admin.blocked_until);

    if (now < blockedUntil) {
      logSecurity('Tentative de connexion - IP bloquée', { username, ip, blocked_until: blockedUntil });
      throw unauthorized(`Compte temporairement bloqué jusqu'à ${blockedUntil.toLocaleString('fr-FR')}`);
    } else {
      // Débloquer si le délai est passé
      await query(
        'UPDATE admins SET ip_blocked = FALSE, blocked_until = NULL, failed_login_attempts = 0 WHERE id = ?',
        [admin.id]
      );
    }
  }

  // Vérifier le mot de passe
  const isPasswordValid = await comparePassword(password, admin.password_hash);

  if (!isPasswordValid) {
    // Incrémenter les tentatives échouées
    const attempts = admin.failed_login_attempts + 1;
    await query(
      'UPDATE admins SET failed_login_attempts = ?, last_failed_login = NOW() WHERE id = ?',
      [attempts, admin.id]
    );

    // Bloquer après 5 tentatives
    if (attempts >= 5) {
      const blockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      await query(
        'UPDATE admins SET ip_blocked = TRUE, blocked_until = ? WHERE id = ?',
        [blockedUntil, admin.id]
      );

      logSecurity('Compte bloqué après 5 tentatives échouées', { username, ip });
      await sendSecurityAlert(username, ip || 'unknown', '5 tentatives de connexion échouées');

      throw unauthorized('Trop de tentatives échouées. Compte bloqué pour 15 minutes.');
    }

    logSecurity('Tentative de connexion - mot de passe incorrect', { username, ip, attempts });
    throw unauthorized('Identifiants incorrects.');
  }

  // Vérifier 2FA si activé
  if (admin.two_fa_enabled && admin.two_fa_secret) {
    if (!twoFAToken) {
      return {
        success: false,
        message: '2FA requis',
        data: {
          require2FA: true,
          admin: null as any,
          token: '',
          refreshToken: '',
        },
      };
    }

    const is2FAValid = verify2FAToken(twoFAToken, admin.two_fa_secret);
    if (!is2FAValid) {
      logSecurity('2FA invalide', { username, ip });
      throw unauthorized('Code 2FA invalide.');
    }
  }

  // Connexion réussie - réinitialiser les tentatives
  await query(
    'UPDATE admins SET failed_login_attempts = 0, last_login = NOW(), last_activity = NOW() WHERE id = ?',
    [admin.id]
  );

  // Générer les tokens
  const tokens = generateTokens({
    adminId: admin.id,
    username: admin.username,
    is_master: admin.is_master,
  });

  // Sauvegarder le refresh token en BDD
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours
  await query(
    'INSERT INTO refresh_tokens (admin_id, token, expires_at, ip_address) VALUES (?, ?, ?, ?)',
    [admin.id, tokens.refreshToken, expiresAt, ip]
  );

  // Nettoyer les anciens refresh tokens
  await query(
    'DELETE FROM refresh_tokens WHERE admin_id = ? AND expires_at < NOW()',
    [admin.id]
  );

  logAuth('Connexion réussie', { username, ip });

  // Préparer les données de l'admin (sans infos sensibles)
  const adminData: AdminSafeData = {
    id: admin.id,
    username: admin.username,
    email: admin.email,
    avatar: admin.avatar,
    permissions_json: admin.permissions_json,
    is_master: admin.is_master,
    is_active: admin.is_active,
    two_fa_enabled: admin.two_fa_enabled,
    created_at: admin.created_at,
    last_login: admin.last_login,
  };

  return {
    success: true,
    message: 'Connexion réussie',
    data: {
      admin: adminData,
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    },
  };
};

// =====================================================
// Logout
// =====================================================
export const logout = async (adminId: number, refreshToken: string): Promise<void> => {
  // Supprimer le refresh token
  await query('DELETE FROM refresh_tokens WHERE admin_id = ? AND token = ?', [
    adminId,
    refreshToken,
  ]);

  logAuth('Déconnexion', { adminId });
};

// =====================================================
// Créer le Master Admin initial
// =====================================================
export const createMasterAdmin = async (): Promise<void> => {
  // Vérifier si un master admin existe déjà
  const [existing] = await query<any[]>(
    'SELECT id FROM admins WHERE is_master = TRUE LIMIT 1'
  );

  if (existing && existing.length > 0) {
    return; // Master admin déjà existant
  }

  const username = process.env.MASTER_ADMIN_USERNAME || 'master';
  const password = process.env.MASTER_ADMIN_PASSWORD || 'ChangeMeOnFirstLogin!';
  const email = process.env.MASTER_ADMIN_EMAIL || 'admin@fivemserver.com';

  const passwordHash = await hashPassword(password);

  const defaultPermissions = {
    voir_toutes_wl: true,
    voir_propres_wl: true,
    creer_wl: true,
    valider_wl: true,
    refuser_wl: true,
    mettre_en_attente: true,
    modifier_wl: true,
    supprimer_wl: true,
    gerer_templates: true,
    acces_statistiques: true,
    gerer_reclamations: true,
    acces_tchat: true,
    creer_tickets: true,
    gerer_admins: true,
  };

  await query(
    `INSERT INTO admins (username, password_hash, email, permissions_json, is_master, is_active)
     VALUES (?, ?, ?, ?, TRUE, TRUE)`,
    [username, passwordHash, email, JSON.stringify(defaultPermissions)]
  );

  logAuth('Master Admin créé', { username, email });
};
