# 🚀 Quick Start Guide

Installation rapide en 5 minutes !

## 1️⃣ Installer les dépendances

```bash
# À la racine du projet
npm install
npm run install:all
```

## 2️⃣ Configurer la base de données

```bash
# Se connecter à MySQL/MariaDB
mysql -u zak -p

# Dans la console MySQL :
CREATE DATABASE revive_wl CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# Importer le schéma
mysql -u zak -p revive_wl < database/schema.sql
```

## 3️⃣ Configurer l'environnement

```bash
# Backend
cd backend
cp .env.example .env
# Modifier le JWT_SECRET dans .env !

# Frontend
cd ../frontend
cp .env.example .env

cd ..
```

## 4️⃣ Créer le Master Admin

```bash
npm run create-admin
```

**⚠️ NOTEZ LE MOT DE PASSE AFFICHÉ !**

## 5️⃣ Lancer l'application

```bash
npm run dev
```

Cela lance automatiquement :
- Backend sur `http://localhost:3000`
- Frontend sur `http://localhost:5173`

## 🎯 Se connecter

1. Ouvrez `http://localhost:5173`
2. Connectez-vous avec :
   - Username : `admin`
   - Password : (celui affiché à l'étape 4)

---

**C'est tout ! Vous êtes prêt ! 🎉**

Pour plus de détails, consultez [INSTALLATION.md](./INSTALLATION.md)
