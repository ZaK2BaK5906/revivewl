// =====================================================
// UTILITAIRES BCRYPT - Hashage de mots de passe
// =====================================================

import bcrypt from 'bcrypt';
import logger from './logger';

// Nombre de salt rounds (plus élevé = plus sécurisé mais plus lent)
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');

// =====================================================
// Hasher un mot de passe
// =====================================================
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
  } catch (error: any) {
    logger.error('Erreur lors du hashage du mot de passe:', error.message);
    throw new Error('Erreur lors du hashage du mot de passe');
  }
};

// =====================================================
// Comparer un mot de passe avec son hash
// =====================================================
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (error: any) {
    logger.error('Erreur lors de la comparaison du mot de passe:', error.message);
    return false;
  }
};

// =====================================================
// Valider la force d'un mot de passe
// =====================================================
export interface PasswordStrength {
  isValid: boolean;
  score: number; // 0-100
  feedback: string[];
}

export const validatePasswordStrength = (password: string): PasswordStrength => {
  const feedback: string[] = [];
  let score = 0;

  // Longueur minimale
  if (password.length < 8) {
    feedback.push('Le mot de passe doit contenir au moins 8 caractères');
  } else if (password.length >= 8 && password.length < 12) {
    score += 20;
  } else if (password.length >= 12) {
    score += 30;
  }

  // Majuscules
  if (!/[A-Z]/.test(password)) {
    feedback.push('Le mot de passe doit contenir au moins une majuscule');
  } else {
    score += 20;
  }

  // Minuscules
  if (!/[a-z]/.test(password)) {
    feedback.push('Le mot de passe doit contenir au moins une minuscule');
  } else {
    score += 20;
  }

  // Chiffres
  if (!/[0-9]/.test(password)) {
    feedback.push('Le mot de passe doit contenir au moins un chiffre');
  } else {
    score += 15;
  }

  // Caractères spéciaux
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push('Le mot de passe doit contenir au moins un caractère spécial');
  } else {
    score += 15;
  }

  // Vérifier les mots de passe courants
  const commonPasswords = [
    'password',
    'password123',
    '123456',
    'qwerty',
    'admin',
    'admin123',
    'root',
    'root123',
  ];

  if (commonPasswords.includes(password.toLowerCase())) {
    feedback.push('Ce mot de passe est trop commun et facilement devinable');
    score = 0;
  }

  return {
    isValid: feedback.length === 0 && score >= 70,
    score: Math.min(score, 100),
    feedback,
  };
};
