// =====================================================
// LOGGER - Winston
// =====================================================

import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Créer le dossier logs s'il n'existe pas
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Format personnalisé
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;

    // Ajouter les métadonnées si présentes
    if (Object.keys(meta).length > 0) {
      logMessage += `\n${JSON.stringify(meta, null, 2)}`;
    }

    return logMessage;
  })
);

// Configuration des transports
const transports: winston.transport[] = [
  // Console (développement)
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      customFormat
    ),
  }),
];

// Fichiers de logs (production)
if (process.env.NODE_ENV === 'production') {
  // Log général
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      format: customFormat,
    })
  );

  // Log des erreurs uniquement
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: customFormat,
    })
  );

  // Log des warnings
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'warn.log'),
      level: 'warn',
      format: customFormat,
    })
  );
}

// Création du logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports,
  // Ne pas quitter en cas d'erreur
  exitOnError: false,
});

// =====================================================
// Helpers pour logs spécifiques
// =====================================================

// Log d'authentification
export const logAuth = (action: string, details: Record<string, any>) => {
  logger.info(`[AUTH] ${action}`, details);
};

// Log de sécurité
export const logSecurity = (action: string, details: Record<string, any>) => {
  logger.warn(`[SECURITY] ${action}`, details);
};

// Log de whitelist
export const logWhitelist = (action: string, details: Record<string, any>) => {
  logger.info(`[WHITELIST] ${action}`, details);
};

// Log d'admin
export const logAdmin = (action: string, details: Record<string, any>) => {
  logger.info(`[ADMIN] ${action}`, details);
};

// Log de webhook Discord
export const logWebhook = (action: string, details: Record<string, any>) => {
  logger.info(`[WEBHOOK] ${action}`, details);
};

// Log de backup
export const logBackup = (action: string, details: Record<string, any>) => {
  logger.info(`[BACKUP] ${action}`, details);
};

export default logger;
