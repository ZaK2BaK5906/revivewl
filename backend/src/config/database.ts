// =====================================================
// CONFIGURATION BASE DE DONNÉES - MariaDB
// =====================================================

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import logger from '../utils/logger';

dotenv.config();

// =====================================================
// Configuration du pool de connexions
// =====================================================
const poolConfig: mysql.PoolOptions = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'zak',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fivem_whitelist',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  charset: 'utf8mb4',
  timezone: '+00:00', // UTC
};

// Création du pool
const pool = mysql.createPool(poolConfig);

// =====================================================
// Test de connexion
// =====================================================
export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await pool.getConnection();
    logger.info('✅ Connexion à la base de données réussie');
    logger.info(`📊 Base de données: ${process.env.DB_NAME}`);
    logger.info(`🖥️  Hôte: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    connection.release();
    return true;
  } catch (error: any) {
    logger.error('❌ Erreur de connexion à la base de données:', error.message);
    logger.error('Détails:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
    });
    return false;
  }
};

// =====================================================
// Helper: Exécuter une requête
// =====================================================
export const query = async <T = any>(
  sql: string,
  params?: any[]
): Promise<T> => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T;
  } catch (error: any) {
    logger.error('Erreur SQL:', {
      message: error.message,
      sql: sql.substring(0, 100) + '...',
      params,
    });
    throw error;
  }
};

// =====================================================
// Helper: Obtenir une connexion du pool (pour transactions)
// =====================================================
export const getConnection = async () => {
  return await pool.getConnection();
};

// =====================================================
// Helper: Exécuter une transaction
// =====================================================
export const transaction = async <T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// =====================================================
// Helper: Parse JSON fields
// =====================================================
export const parseJsonField = <T = any>(field: any): T | null => {
  if (!field) return null;
  if (typeof field === 'object') return field as T;
  try {
    return JSON.parse(field) as T;
  } catch {
    return null;
  }
};

// =====================================================
// Helper: Formater pour insertion SQL
// =====================================================
export const escapeValue = (value: any): string => {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'string') return mysql.escape(value);
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'boolean') return value ? '1' : '0';
  if (value instanceof Date) return mysql.escape(value.toISOString());
  if (typeof value === 'object') return mysql.escape(JSON.stringify(value));
  return mysql.escape(String(value));
};

// =====================================================
// Helper: Pagination
// =====================================================
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export const getPaginationParams = (
  params: PaginationParams
): { offset: number; limit: number; page: number } => {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 20));
  const offset = (page - 1) * limit;
  return { offset, limit, page };
};

// =====================================================
// Helper: Calculer le nombre total de pages
// =====================================================
export const calculateTotalPages = (total: number, limit: number): number => {
  return Math.ceil(total / limit);
};

// =====================================================
// Helper: Cleanup (à appeler au shutdown)
// =====================================================
export const closePool = async (): Promise<void> => {
  try {
    await pool.end();
    logger.info('Pool de connexions fermé');
  } catch (error: any) {
    logger.error('Erreur lors de la fermeture du pool:', error.message);
  }
};

// Gestion propre de l'arrêt
process.on('SIGINT', async () => {
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closePool();
  process.exit(0);
});

export default pool;
