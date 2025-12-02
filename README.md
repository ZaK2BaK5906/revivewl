# 🎮 FiveM Whitelist Panel - Panel d'Administration Ultra-Complet

Panel d'administration moderne et complet pour gérer les whitelists d'un serveur FiveM RP avec des fonctionnalités avancées.

## 📋 Sommaire

- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Utilisation](#-utilisation)
- [Structure du Projet](#-structure-du-projet)
- [API Documentation](#-api-documentation)
- [Contribuer](#-contribuer)
- [Licence](#-licence)

## ✨ Fonctionnalités

### 🔐 Système de Gestion des Utilisateurs
- **Master Admin** avec contrôle total
- Création et gestion des comptes administrateurs
- Permissions granulaires personnalisables
- Authentification sécurisée avec JWT
- 2FA optionnel (Google Authenticator)
- Rate limiting et protection contre les attaques

### 📝 Processus de Whitelist Complet
- Interface d'entretien en 5 étapes
- Génération automatique de scénarios RP
- 70+ questions de règlement
- Notation en temps réel
- Système de flags (douteux, excellent, à surveiller)
- Sauvegarde automatique (brouillons)
- Chronomètre intégré

### 📊 Dashboard & Statistiques
- Widgets interactifs en temps réel
- Graphiques d'évolution sur 30 jours
- Top 5 des admins les plus actifs
- Taux de réussite des whitelists
- Temps moyen de traitement
- Répartition par catégorie

### 🔔 Webhooks Discord Automatiques
- Entretien démarré
- WL validée/refusée/en attente
- Création/modification d'admin
- Alertes de sécurité
- Rapport quotidien automatique
- Backups effectués

### 📚 Système de Formation
- Modules de formation interactifs
- Quiz de validation
- Certification des nouveaux admins
- Mode entretien fictif pour s'entraîner

### 💬 Communication Interne
- Tchat en temps réel (Socket.IO)
- Système de notifications
- Commentaires sur les WL
- Mentions entre admins

### 🛠️ Fonctionnalités Avancées
- Système de réclamations joueurs
- Tickets support technique
- Backup automatique quotidien
- Mode maintenance
- Changelog intégré
- Gestion de templates scénarios/questions
- Export CSV/Excel
- API REST publique (optionnelle)

## 🚀 Technologies

### Backend
- **Node.js** 20+ avec **Express.js**
- **TypeScript** pour la robustesse
- **MariaDB/MySQL** avec mysql2
- **Socket.IO** pour temps réel
- **JWT** pour l'authentification
- **Bcrypt** pour hashage sécurisé
- **Speakeasy** pour 2FA
- **Winston** pour logging
- **Node-Cron** pour tâches automatiques

### Frontend (À venir)
- **React 18** avec **TypeScript**
- **Vite** pour bundling rapide
- **React Router** pour navigation
- **Axios** pour requêtes HTTP
- **Socket.IO Client** pour temps réel
- **Chart.js** ou **Recharts** pour graphiques
- **React Hook Form** + **Yup** pour formulaires
- CSS pur avec variables (design moderne)

### Base de Données
- **MariaDB 10.6+** / **MySQL 8.0+**
- Schéma complet avec indexes optimisés
- Triggers et procédures stockées
- Contraintes foreign keys

## 📦 Installation

### Prérequis
- Node.js 20+ ([Télécharger](https://nodejs.org/))
- MariaDB 10.6+ ou MySQL 8.0+ ([Télécharger](https://mariadb.org/download/))
- Git

### 1️⃣ Cloner le dépôt

```bash
git clone https://github.com/votre-repo/revivewl.git
cd revivewl
```

### 2️⃣ Installer les dépendances Backend

```bash
cd backend
npm install
```

### 3️⃣ Configurer la base de données

```bash
# Se connecter à MySQL/MariaDB
mysql -u root -p

# Créer la base de données et importer le schéma
source ../database/migrations/001_initial_schema.sql

# Importer les données par défaut (scénarios, questions)
source ../database/seeds/002_default_data.sql

# Quitter MySQL
exit
```

Ou via HeidiSQL :
1. Ouvrir HeidiSQL
2. Connexion à votre serveur MariaDB
3. Fichier > Exécuter fichier SQL
4. Sélectionner `database/migrations/001_initial_schema.sql`
5. Puis `database/seeds/002_default_data.sql`

### 4️⃣ Configurer les variables d'environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer .env avec vos paramètres
nano .env  # ou votre éditeur préféré
```

**Variables importantes à configurer :**
```env
# Base de données
DB_HOST=localhost
DB_PORT=3306
DB_USER=zak
DB_PASSWORD=Floflo1101*
DB_NAME=fivem_whitelist

# JWT (CHANGEZ CES CLÉS EN PRODUCTION !)
JWT_SECRET=VOTRE_CLE_SECRETE_TRES_LONGUE_ET_ALEATOIRE
JWT_REFRESH_SECRET=VOTRE_CLE_REFRESH_AUSSI_TRES_LONGUE

# Webhooks Discord (optionnel)
DISCORD_WEBHOOK_WL_VALIDEE=https://discord.com/api/webhooks/...
DISCORD_WEBHOOK_WL_REFUSEE=https://discord.com/api/webhooks/...
# ... etc
```

### 5️⃣ Démarrer le serveur

**Mode développement :**
```bash
npm run dev
```

**Mode production :**
```bash
# Compiler TypeScript
npm run build

# Démarrer avec PM2
npm run start:prod
```

Le serveur démarre sur **http://localhost:5000**

### 6️⃣ Connexion Master Admin

**Identifiants par défaut :**
- **Username :** `master`
- **Password :** `ChangeMeOnFirstLogin!`

⚠️ **IMPORTANT :** Changez le mot de passe immédiatement après la première connexion !

## ⚙️ Configuration

### Webhooks Discord

1. Créer des webhooks dans votre serveur Discord
2. Copier les URLs dans `.env`
3. Redémarrer le serveur

### Backup Automatique

Par défaut, un backup est effectué tous les jours à 4h du matin.

Modifier dans `.env` :
```env
BACKUP_CRON_SCHEDULE=0 4 * * *  # Format cron
BACKUP_RETENTION_DAYS=30
```

### Permissions Granulaires

Les permissions disponibles pour les admins :
- `voir_toutes_wl` - Voir toutes les whitelists
- `voir_propres_wl` - Voir uniquement ses propres WL
- `creer_wl` - Créer des whitelists
- `valider_wl` - Valider des whitelists
- `refuser_wl` - Refuser des whitelists
- `mettre_en_attente` - Mettre en attente
- `modifier_wl` - Modifier des WL validées
- `supprimer_wl` - Supprimer des WL
- `gerer_templates` - Gérer scénarios/questions
- `acces_statistiques` - Accès aux stats
- `gerer_reclamations` - Gérer réclamations
- `acces_tchat` - Accès au tchat interne
- `creer_tickets` - Créer tickets support
- `gerer_admins` - Gérer autres admins (Master uniquement)

## 📖 Utilisation

### Créer une Nouvelle Whitelist

1. Se connecter au panel
2. Cliquer sur **"Nouvelle WL"** ou `Ctrl+N`
3. **Étape 1 :** Remplir les infos du candidat
4. **Étape 2 :** Choisir la catégorie (Legal/Illégal/etc.)
5. **Étape 3 :** 3 scénarios sont générés automatiquement
   - Lire chaque scénario au candidat (vocal Discord)
   - Noter ses réponses
   - Attribuer une note /10
6. **Étape 4 :** 7 questions de règlement générées
   - Lire chaque question
   - Noter les réponses
   - Quick check ✅/❌
7. **Étape 5 :** Décision finale
   - Score calculé automatiquement
   - Valider ✅ / Refuser ❌ / En attente 📝
   - Webhook Discord envoyé automatiquement

### Gérer les Admins (Master uniquement)

1. Menu **"Gestion des Admins"**
2. **Créer un admin :**
   - Username, email, mot de passe
   - Sélectionner les permissions
   - Activer/désactiver 2FA
3. **Modifier/Supprimer :**
   - Cliquer sur un admin
   - Modifier ses permissions
   - Désactiver ou supprimer

### Consulter les Statistiques

- **Dashboard :** Vue d'ensemble en temps réel
- **Analytics :** Graphiques détaillés
- **Classement admins :** Top performers
- **Export :** Télécharger les données CSV/Excel

## 🗂️ Structure du Projet

```
revivewl/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration (BDD, etc.)
│   │   ├── controllers/     # Controllers API
│   │   ├── middlewares/     # Middlewares (auth, validation, etc.)
│   │   ├── models/          # Modèles de données
│   │   ├── routes/          # Routes Express
│   │   ├── services/        # Logique métier
│   │   ├── types/           # Types TypeScript
│   │   ├── utils/           # Utilitaires (JWT, bcrypt, Discord, etc.)
│   │   └── server.ts        # Point d'entrée
│   ├── tests/               # Tests unitaires
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # (À venir)
│   └── src/
├── database/
│   ├── migrations/          # Scripts SQL de création
│   └── seeds/               # Données par défaut
├── docs/                    # Documentation
├── backups/                 # Backups automatiques
├── logs/                    # Logs applicatifs
└── README.md
```

## 📡 API Documentation

### Authentification

#### POST `/api/auth/login`
Connexion d'un admin.

**Body :**
```json
{
  "username": "master",
  "password": "ChangeMeOnFirstLogin!",
  "two_fa_token": "123456" // Optionnel si 2FA activé
}
```

**Response :**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "admin": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "..."
  }
}
```

#### GET `/api/auth/me`
Récupérer le profil de l'admin connecté.

**Headers :**
```
Authorization: Bearer <token>
```

**Response :**
```json
{
  "success": true,
  "message": "Profil récupéré",
  "data": {
    "id": 1,
    "username": "master",
    "email": "admin@fivemserver.com",
    "is_master": true,
    ...
  }
}
```

#### POST `/api/auth/logout`
Déconnexion.

**Headers :**
```
Authorization: Bearer <token>
```

**Body :**
```json
{
  "refreshToken": "..."
}
```

### Routes à venir
- `/api/whitelist` - Gestion des whitelists
- `/api/admin` - Gestion des admins
- `/api/scenarios` - Templates scénarios
- `/api/questions` - Templates questions
- `/api/stats` - Statistiques
- `/api/notifications` - Notifications
- `/api/messages` - Tchat interne
- etc.

## 🔒 Sécurité

### Mesures Implémentées

✅ **Hashage Bcrypt** (12 salt rounds)
✅ **JWT** avec tokens refresh
✅ **Rate Limiting** (5 tentatives connexion / 15 min)
✅ **Blocage IP** automatique après échecs
✅ **2FA optionnel** (TOTP)
✅ **CSRF Protection**
✅ **Helmet.js** (headers sécurisés)
✅ **Sanitization** des inputs (XSS)
✅ **Logs de sécurité** avec alertes Discord
✅ **Sessions expirables** (24h par défaut)
✅ **HTTPS obligatoire** en production

### Recommandations

⚠️ **Changez immédiatement :**
- Le mot de passe du Master Admin
- Les clés JWT dans `.env`
- Les identifiants de base de données

⚠️ **En production :**
- Activez HTTPS avec certificat SSL
- Configurez un firewall
- Utilisez PM2 pour gérer le processus
- Activez les backups automatiques
- Surveillez les logs régulièrement

## 🤝 Contribuer

Les contributions sont les bienvenues !

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

MIT License - Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**ZaK**

## 🙏 Remerciements

- Communauté FiveM RP
- Tous les testeurs et contributeurs

---

**⭐ Si ce projet vous aide, n'hésitez pas à lui donner une étoile !**
