# 📦 Guide d'Installation - Revive RP Whitelist Panel

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** 18+ ([Télécharger](https://nodejs.org/))
- **MariaDB/MySQL** 10.5+ ([Télécharger](https://mariadb.org/download/))
- **Git** ([Télécharger](https://git-scm.com/downloads))
- Un éditeur de code (VS Code recommandé)

## 🚀 Installation

### Étape 1 : Cloner le projet

```bash
git clone <url-du-repo>
cd revivewl
```

### Étape 2 : Configuration de la base de données

#### 2.1 Créer la base de données

Connectez-vous à MariaDB :

```bash
mysql -u zak -p
```

Entrez votre mot de passe : `Floflo1101*`

Créez la base de données :

```sql
CREATE DATABASE revive_wl CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE revive_wl;
```

#### 2.2 Importer le schéma

Quittez la console MySQL (tapez `exit;`) puis :

```bash
mysql -u zak -p revive_wl < database/schema.sql
```

Entrez votre mot de passe quand demandé.

### Étape 3 : Configuration du Backend

#### 3.1 Installer les dépendances

```bash
cd backend
npm install
```

#### 3.2 Configuration de l'environnement

Copiez le fichier d'exemple :

```bash
cp .env.example .env
```

Ouvrez `.env` et configurez les variables :

```env
# Database
DB_HOST=localhost
DB_USER=zak
DB_PASSWORD=Floflo1101*
DB_NAME=revive_wl
DB_PORT=3306

# JWT (Générez une clé sécurisée)
JWT_SECRET=votre-cle-secrete-tres-longue-et-aleatoire-changez-moi
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:5173

# Discord Webhooks (à configurer plus tard)
DISCORD_WEBHOOK_INTERVIEWS=
DISCORD_WEBHOOK_VALIDATIONS=
DISCORD_WEBHOOK_REFUSALS=
DISCORD_WEBHOOK_PENDING=
DISCORD_WEBHOOK_ADMIN=
DISCORD_WEBHOOK_SECURITY=
DISCORD_WEBHOOK_DAILY_REPORT=
DISCORD_WEBHOOK_REMINDERS=
DISCORD_WEBHOOK_BACKUPS=
```

⚠️ **Important** : Changez le `JWT_SECRET` par une chaîne aléatoire sécurisée !

Vous pouvez générer une clé avec cette commande :

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### 3.3 Créer le Master Admin

```bash
npm run create-admin
```

Cette commande va :
- Créer un compte Master Admin
- Afficher le mot de passe généré

⚠️ **IMPORTANT** : Notez bien le mot de passe affiché, vous en aurez besoin pour vous connecter !

Exemple de sortie :
```
╔════════════════════════════════════════╗
║   ✅ MASTER ADMIN CREATED            ║
╚════════════════════════════════════════╝

Username: admin
Email: admin@revive-rp.local
Password: abc123def456...

⚠️  IMPORTANT: Save this password! It will not be shown again.
⚠️  Please change it after first login!
```

#### 3.4 Démarrer le backend

```bash
npm run dev
```

Vous devriez voir :

```
╔════════════════════════════════════════╗
║                                        ║
║   🎮 REVIVE RP - WHITELIST PANEL      ║
║                                        ║
║   Server running on port 3000         ║
║   Environment: development            ║
║                                        ║
╚════════════════════════════════════════╝
```

Laissez ce terminal ouvert et le serveur tourner.

### Étape 4 : Configuration du Frontend

Ouvrez un **nouveau terminal** et :

#### 4.1 Installer les dépendances

```bash
cd frontend
npm install
```

#### 4.2 Configuration de l'environnement

```bash
cp .env.example .env
```

Le fichier `.env` devrait contenir :

```env
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=http://localhost:3000
```

#### 4.3 Démarrer le frontend

```bash
npm run dev
```

Le serveur frontend démarre sur `http://localhost:5173`

## 🎯 Première Connexion

1. Ouvrez votre navigateur sur `http://localhost:5173`
2. Connectez-vous avec :
   - **Username** : `admin`
   - **Password** : (le mot de passe généré à l'étape 3.3)
3. **Changez immédiatement votre mot de passe** dans les paramètres !

## 🔐 Configuration Discord Webhooks (Optionnel)

Pour activer les notifications Discord :

### 1. Créer les webhooks

Dans Discord :
1. Paramètres du serveur → Intégrations → Webhooks
2. Créer un webhook pour chaque type d'événement
3. Copier l'URL du webhook

### 2. Configurer dans le backend

Ouvrez `backend/.env` et ajoutez les URLs :

```env
DISCORD_WEBHOOK_INTERVIEWS=https://discord.com/api/webhooks/...
DISCORD_WEBHOOK_VALIDATIONS=https://discord.com/api/webhooks/...
DISCORD_WEBHOOK_REFUSALS=https://discord.com/api/webhooks/...
# etc.
```

### 3. Redémarrer le backend

```bash
# Dans le terminal backend, appuyez sur Ctrl+C puis :
npm run dev
```

## 📁 Structure des Fichiers

```
revivewl/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── config/         # Configuration (DB, constantes)
│   │   ├── controllers/    # Logique métier
│   │   ├── middleware/     # Auth, permissions
│   │   ├── models/         # Modèles Sequelize
│   │   ├── routes/         # Routes API
│   │   ├── scripts/        # Scripts utilitaires
│   │   └── server.ts       # Point d'entrée
│   ├── .env                # Variables d'environnement
│   └── package.json
│
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── pages/         # Pages
│   │   ├── stores/        # State management (Zustand)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env               # Variables d'environnement
│   └── package.json
│
├── database/              # Scripts SQL
│   └── schema.sql         # Schéma de la BDD
│
└── backups/              # Backups automatiques (créé auto)
```

## ✅ Vérification de l'Installation

### Backend

Testez l'API :

```bash
curl http://localhost:3000/health
```

Résultat attendu :
```json
{"status":"ok","timestamp":"2025-12-01T..."}
```

### Frontend

Ouvrez `http://localhost:5173` dans votre navigateur. Vous devriez voir la page de connexion.

### Base de données

Vérifiez que les tables sont créées :

```bash
mysql -u zak -p revive_wl -e "SHOW TABLES;"
```

Vous devriez voir environ 20 tables.

## 🐛 Dépannage

### Erreur : "Cannot connect to database"

- Vérifiez que MariaDB est bien démarré
- Vérifiez les credentials dans `backend/.env`
- Testez la connexion :
  ```bash
  mysql -u zak -p -e "SELECT 1;"
  ```

### Erreur : "Port 3000 already in use"

Un autre processus utilise le port 3000 :

```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Ou changez le port dans `backend/.env` :
```env
PORT=3001
```

### Erreur : "JWT_SECRET is required"

Vous n'avez pas configuré le JWT_SECRET dans `backend/.env`. Ajoutez-le !

### Le frontend ne se connecte pas à l'API

- Vérifiez que le backend tourne bien sur le port 3000
- Vérifiez le `VITE_API_URL` dans `frontend/.env`
- Vérifiez la console du navigateur (F12) pour voir les erreurs

## 🔄 Commandes Utiles

### Backend

```bash
npm run dev        # Démarrer en mode développement
npm run build      # Compiler en JavaScript
npm start          # Démarrer en production
npm run create-admin  # Créer un nouveau master admin
```

### Frontend

```bash
npm run dev        # Démarrer en mode développement
npm run build      # Build pour la production
npm run preview    # Prévisualiser le build
```

## 🚢 Mise en Production

### 1. Build du frontend

```bash
cd frontend
npm run build
```

Les fichiers sont dans `frontend/dist/`

### 2. Build du backend

```bash
cd backend
npm run build
```

### 3. Configuration de production

- Changez `NODE_ENV=production` dans `.env`
- Utilisez un serveur web (Nginx) pour servir le frontend
- Utilisez PM2 pour gérer le backend :

```bash
npm install -g pm2
pm2 start dist/server.js --name revive-wl
pm2 save
pm2 startup
```

## 📝 Prochaines Étapes

Maintenant que l'installation est terminée, vous pouvez :

1. **Créer des admins supplémentaires** (section Admins du panel)
2. **Configurer les scénarios et questions** (section Templates)
3. **Configurer les webhooks Discord** (voir ci-dessus)
4. **Personnaliser le règlement** (page Règlement)
5. **Commencer à faire des whitelists !**

## 🆘 Support

En cas de problème :

1. Vérifiez les logs du backend (dans le terminal)
2. Vérifiez la console du navigateur (F12)
3. Consultez le README.md
4. Créez un ticket dans le panel (une fois connecté)

---

**Bon développement avec Revive RP ! 🎮**
