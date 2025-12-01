# 🎮 Revive RP - Panel d'Administration Whitelist

Panel d'administration ultra-complet et moderne pour gérer les whitelists d'un serveur FiveM RP.

## 🚀 Fonctionnalités principales

### 👥 Gestion des utilisateurs
- **Master Admin** : Contrôle total du système
- **Administrateurs** : Permissions granulaires personnalisables
- Authentification sécurisée avec 2FA optionnel
- Profils personnalisables avec avatars

### 📋 Système de Whitelist
- Processus en 5 étapes pendant l'entretien vocal Discord
- Génération automatique de scénarios et questions
- Système de notation automatique sur 100 points
- Validation/Refus/Mise en attente avec commentaires
- Horodatage complet de toutes les actions

### 📊 Dashboard & Analytics
- Statistiques en temps réel avec graphiques interactifs
- Widgets de suivi des activités
- Classement des admins
- Rapports détaillés par catégorie

### 🔔 Notifications Discord
- Webhooks automatiques pour tous les événements
- Embeds personnalisés avec couleurs codées
- Rapports quotidiens automatiques
- Rappels pour WL en attente +48h

### 💬 Fonctionnalités avancées
- Chat interne en temps réel (WebSocket)
- Système de tickets support
- Backups automatiques quotidiens
- Mode maintenance
- Page règlement publique
- Export PDF/Excel des données
- Historique complet avec filtres avancés

## 📦 Stack Technique

### Backend
- Node.js + Express + TypeScript
- MariaDB avec Sequelize ORM
- JWT + bcrypt + speakeasy (2FA)
- Socket.io (WebSocket)
- Node-cron (tâches automatiques)

### Frontend
- React + TypeScript + Vite
- TailwindCSS + Shadcn/ui
- Recharts (graphiques)
- Socket.io-client
- jsPDF + xlsx (exports)

## ⚙️ Installation

### Prérequis
- Node.js 18+
- MariaDB/MySQL
- npm ou yarn

### 1. Clone du projet
```bash
git clone <repo-url>
cd revivewl
```

### 2. Configuration de la base de données
```bash
# Se connecter à MariaDB
mysql -u zak -p

# Créer la base de données
CREATE DATABASE revive_wl CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Importer le schéma
mysql -u zak -p revive_wl < database/schema.sql
```

### 3. Installation du backend
```bash
cd backend
npm install
cp .env.example .env
# Configurer les variables d'environnement dans .env
npm run dev
```

### 4. Installation du frontend
```bash
cd frontend
npm install
cp .env.example .env
# Configurer l'URL de l'API
npm run dev
```

## 🔐 Premier démarrage

### Création du Master Admin
Au premier lancement, le système créera automatiquement un compte Master Admin :
- **Username** : admin
- **Password** : (généré automatiquement et affiché dans les logs)

⚠️ **Important** : Changez ce mot de passe immédiatement après la première connexion !

## 📖 Documentation

### Structure du projet
```
revivewl/
├── backend/              # API Node.js + Express
│   ├── src/
│   │   ├── config/      # Configuration (DB, JWT, etc.)
│   │   ├── models/      # Modèles Sequelize
│   │   ├── controllers/ # Logique métier
│   │   ├── routes/      # Routes API
│   │   ├── middleware/  # Middlewares (auth, permissions)
│   │   ├── services/    # Services (webhooks, backups, etc.)
│   │   ├── utils/       # Utilitaires
│   │   └── server.ts    # Point d'entrée
│   └── package.json
│
├── frontend/            # Application React
│   ├── src/
│   │   ├── components/  # Composants React
│   │   ├── pages/       # Pages
│   │   ├── hooks/       # Custom hooks
│   │   ├── services/    # API calls
│   │   ├── utils/       # Utilitaires
│   │   ├── types/       # Types TypeScript
│   │   └── App.tsx      # Point d'entrée
│   └── package.json
│
├── database/            # Scripts SQL
└── backups/            # Backups automatiques
```

### API Endpoints

#### Authentication
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `POST /api/auth/verify-2fa` - Vérification 2FA
- `GET /api/auth/me` - Profil actuel

#### Whitelists
- `GET /api/whitelists` - Liste des WL
- `POST /api/whitelists` - Créer une WL
- `GET /api/whitelists/:id` - Détails d'une WL
- `PUT /api/whitelists/:id` - Modifier une WL
- `DELETE /api/whitelists/:id` - Supprimer une WL
- `POST /api/whitelists/:id/validate` - Valider une WL
- `POST /api/whitelists/:id/refuse` - Refuser une WL
- `POST /api/whitelists/:id/pending` - Mettre en attente

#### Admins (Master Admin uniquement)
- `GET /api/admins` - Liste des admins
- `POST /api/admins` - Créer un admin
- `PUT /api/admins/:id` - Modifier un admin
- `DELETE /api/admins/:id` - Supprimer un admin
- `PUT /api/admins/:id/permissions` - Modifier les permissions

#### Statistics
- `GET /api/stats/dashboard` - Stats du dashboard
- `GET /api/stats/admin/:id` - Stats d'un admin
- `GET /api/stats/categories` - Stats par catégorie
- `GET /api/stats/daily` - Stats quotidiennes

#### Templates
- `GET /api/templates/scenarios` - Liste des scénarios
- `POST /api/templates/scenarios` - Créer un scénario
- `PUT /api/templates/scenarios/:id` - Modifier un scénario
- `DELETE /api/templates/scenarios/:id` - Supprimer un scénario

(Et bien d'autres...)

## 🔧 Configuration

### Variables d'environnement Backend (.env)
```env
# Database
DB_HOST=localhost
DB_USER=zak
DB_PASSWORD=Floflo1101*
DB_NAME=revive_wl
DB_PORT=3306

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development

# Discord Webhooks
DISCORD_WEBHOOK_INTERVIEWS=https://discord.com/api/webhooks/...
DISCORD_WEBHOOK_SECURITY=https://discord.com/api/webhooks/...
DISCORD_WEBHOOK_REPORTS=https://discord.com/api/webhooks/...

# Backups
BACKUP_SCHEDULE=0 4 * * *
BACKUP_RETENTION_DAYS=30

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Variables d'environnement Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=http://localhost:3000
```

## 🛡️ Sécurité

- Mots de passe hashés avec bcrypt (12 rounds)
- JWT avec expiration
- 2FA optionnel avec speakeasy
- Protection CSRF
- Rate limiting sur les endpoints sensibles
- Logs de sécurité détaillés
- Validation des entrées utilisateur
- Sanitization des données

## 📅 Tâches automatiques

- **Backup quotidien** : 4h00 du matin
- **Rapport quotidien** : Minuit
- **Rappel WL +48h** : Toutes les heures
- **Nettoyage sessions expirées** : Toutes les heures

## 🤝 Support

Pour toute question ou problème :
1. Créer un ticket via le panel
2. Consulter les logs dans `/logs/`
3. Vérifier la page changelog pour les mises à jour

## 📝 Changelog

Voir la page changelog du panel pour l'historique complet des versions.

## 👨‍💻 Développeur

Développé pour Revive RP - Panel de gestion whitelist FiveM

---

**Version** : 1.0.0
**Date** : 2025-12-01
