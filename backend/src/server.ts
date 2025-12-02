// =====================================================
// SERVEUR EXPRESS PRINCIPAL
// =====================================================

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';

import logger from './utils/logger';
import { testConnection } from './config/database';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import { rateLimiter, loginRateLimiter } from './middlewares/rateLimiter';

// Import routes
import authRoutes from './routes/auth';
// import adminRoutes from './routes/admin';
// import whitelistRoutes from './routes/whitelist';
// ... autres routes

// Import services
import { createMasterAdmin } from './services/authService';

dotenv.config();

// =====================================================
// Configuration du serveur
// =====================================================
const app: Application = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// =====================================================
// Configuration Socket.IO
// =====================================================
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// Rendre io accessible globalement
app.set('io', io);

// =====================================================
// Middlewares de base
// =====================================================

// Sécurité avec Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Compression des réponses
app.use(compression());

// Parsing du body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Logging HTTP (Morgan)
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  }));
}

// Rate limiting global
app.use('/api/', rateLimiter);

// =====================================================
// Routes de santé
// =====================================================
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'API FiveM Whitelist Panel est en ligne',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'API opérationnelle',
    timestamp: new Date().toISOString(),
  });
});

// =====================================================
// Routes API
// =====================================================
app.use('/api/auth', authRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/whitelist', whitelistRoutes);
// app.use('/api/scenarios', scenariosRoutes);
// app.use('/api/questions', questionsRoutes);
// app.use('/api/notifications', notificationsRoutes);
// app.use('/api/messages', messagesRoutes);
// app.use('/api/reclamations', reclamationsRoutes);
// app.use('/api/tickets', ticketsRoutes);
// app.use('/api/formation', formationRoutes);
// app.use('/api/stats', statsRoutes);
// app.use('/api/settings', settingsRoutes);
// app.use('/api/changelog', changelogRoutes);
// app.use('/api/backup', backupRoutes);

// Route temporaire pour tester
app.get('/api/test', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API de test fonctionnelle',
    timestamp: new Date().toISOString(),
  });
});

// =====================================================
// Gestion des erreurs
// =====================================================
app.use(notFound);
app.use(errorHandler);

// =====================================================
// Socket.IO - Gestion des connexions
// =====================================================
io.on('connection', (socket) => {
  logger.info(`🔌 Nouveau client Socket.IO connecté: ${socket.id}`);

  // Authentification du socket
  socket.on('authenticate', (data) => {
    // TODO: Vérifier le token JWT et associer le socket à l'admin
    logger.info(`Socket ${socket.id} authentification:`, data);
  });

  // Rejoindre un salon
  socket.on('join_room', (room) => {
    socket.join(room);
    logger.info(`Socket ${socket.id} a rejoint le salon: ${room}`);
  });

  // Quitter un salon
  socket.on('leave_room', (room) => {
    socket.leave(room);
    logger.info(`Socket ${socket.id} a quitté le salon: ${room}`);
  });

  // Message tchat
  socket.on('chat_message', (data) => {
    // TODO: Sauvegarder le message en BDD et broadcaster
    io.to(data.salon || 'general').emit('new_message', data);
  });

  // Notification de typage
  socket.on('typing', (data) => {
    socket.to(data.salon || 'general').emit('user_typing', {
      username: data.username,
      salon: data.salon,
    });
  });

  // Déconnexion
  socket.on('disconnect', () => {
    logger.info(`🔌 Client Socket.IO déconnecté: ${socket.id}`);
  });
});

// =====================================================
// Démarrage du serveur
// =====================================================
const startServer = async () => {
  try {
    // Test de connexion à la BDD
    const dbConnected = await testConnection();

    if (!dbConnected) {
      logger.error('❌ Impossible de se connecter à la base de données');
      logger.error('⚠️  Le serveur démarre quand même mais ne fonctionnera pas correctement');
    } else {
      // Créer le Master Admin si nécessaire
      try {
        await createMasterAdmin();
      } catch (error: any) {
        logger.warn('Erreur lors de la création du Master Admin:', error.message);
      }
    }

    // Démarrage du serveur HTTP
    server.listen(PORT, () => {
      logger.info('='.repeat(60));
      logger.info('🚀 SERVEUR FIVEM WHITELIST PANEL DÉMARRÉ');
      logger.info('='.repeat(60));
      logger.info(`📍 URL: http://localhost:${PORT}`);
      logger.info(`🌍 Environnement: ${NODE_ENV}`);
      logger.info(`⏰ Démarré à: ${new Date().toLocaleString('fr-FR')}`);
      logger.info('='.repeat(60));

      if (NODE_ENV === 'development') {
        logger.info('');
        logger.info('📚 Routes disponibles:');
        logger.info(`  GET  /health                    - Santé du serveur`);
        logger.info(`  GET  /api/health                - Santé de l'API`);
        logger.info(`  POST /api/auth/login            - Connexion`);
        logger.info(`  POST /api/auth/logout           - Déconnexion`);
        logger.info(`  GET  /api/auth/me               - Profil admin`);
        logger.info('');
        logger.info('🔌 Socket.IO actif sur le même port');
        logger.info('');
        logger.info('👤 Master Admin:');
        logger.info(`  Username: ${process.env.MASTER_ADMIN_USERNAME || 'master'}`);
        logger.info(`  Password: ${process.env.MASTER_ADMIN_PASSWORD || 'ChangeMeOnFirstLogin!'}`);
        logger.info('  ⚠️  Changez le mot de passe dès la première connexion !');
        logger.info('');
      }
    });
  } catch (error: any) {
    logger.error('❌ Erreur fatale au démarrage du serveur:', error.message);
    process.exit(1);
  }
};

// =====================================================
// Gestion propre de l'arrêt
// =====================================================
const gracefulShutdown = async () => {
  logger.info('⚠️  Signal d\'arrêt reçu, fermeture gracieuse...');

  server.close(() => {
    logger.info('✅ Serveur HTTP fermé');
    process.exit(0);
  });

  // Force l'arrêt après 10 secondes
  setTimeout(() => {
    logger.error('⚠️  Arrêt forcé après timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Gestion des erreurs non capturées
process.on('uncaughtException', (error: Error) => {
  logger.error('❌ Exception non capturée:', error);
  gracefulShutdown();
});

process.on('unhandledRejection', (reason: any) => {
  logger.error('❌ Promesse rejetée non gérée:', reason);
  gracefulShutdown();
});

// Démarrer le serveur
startServer();

export { app, io };
