// =====================================================
// UTILITAIRES 2FA - Two Factor Authentication
// =====================================================

import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import logger from './logger';

const ISSUER = process.env.TWO_FA_ISSUER || 'FiveM Whitelist Panel';
const WINDOW = parseInt(process.env.TWO_FA_WINDOW || '2'); // Tolérance de temps

// =====================================================
// Générer un secret 2FA
// =====================================================
export const generate2FASecret = (username: string) => {
  const secret = speakeasy.generateSecret({
    name: `${ISSUER} (${username})`,
    issuer: ISSUER,
    length: 32,
  });

  return {
    secret: secret.base32,
    otpauthUrl: secret.otpauth_url || '',
  };
};

// =====================================================
// Générer un QR Code pour le secret 2FA
// =====================================================
export const generate2FAQRCode = async (otpauthUrl: string): Promise<string> => {
  try {
    const qrCodeDataURL = await qrcode.toDataURL(otpauthUrl);
    return qrCodeDataURL;
  } catch (error: any) {
    logger.error('Erreur lors de la génération du QR code 2FA:', error.message);
    throw new Error('Erreur lors de la génération du QR code');
  }
};

// =====================================================
// Vérifier un token 2FA
// =====================================================
export const verify2FAToken = (token: string, secret: string): boolean => {
  try {
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: WINDOW,
    });

    return verified;
  } catch (error: any) {
    logger.error('Erreur lors de la vérification du token 2FA:', error.message);
    return false;
  }
};

// =====================================================
// Générer un token 2FA (pour tests)
// =====================================================
export const generate2FAToken = (secret: string): string => {
  return speakeasy.totp({
    secret,
    encoding: 'base32',
  });
};

// =====================================================
// Générer des codes de backup (pour récupération)
// =====================================================
export const generateBackupCodes = (count: number = 10): string[] => {
  const codes: string[] = [];

  for (let i = 0; i < count; i++) {
    // Générer un code de 8 caractères alphanumériques
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    codes.push(code);
  }

  return codes;
};
