#!/bin/bash

# =====================================================
# Script de Setup Rapide - FiveM Whitelist Panel
# =====================================================

echo "=========================================="
echo "🚀 FiveM Whitelist Panel - Setup"
echo "=========================================="
echo ""

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé !"
    echo "📥 Téléchargez-le sur: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé !"
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

echo "✅ Dépendances installées avec succès"
echo ""

# Vérifier si .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Fichier .env non trouvé"
    echo "📋 Copie de .env.example vers .env..."
    cp .env.example .env
    echo "✅ Fichier .env créé"
    echo ""
    echo "⚠️  IMPORTANT: Éditez le fichier .env et configurez:"
    echo "   - Les identifiants de base de données"
    echo "   - Les clés JWT"
    echo "   - Les webhooks Discord (optionnel)"
    echo ""
else
    echo "✅ Fichier .env déjà présent"
fi

echo ""
echo "=========================================="
echo "✅ Setup terminé avec succès !"
echo "=========================================="
echo ""
echo "📚 Prochaines étapes:"
echo ""
echo "1️⃣  Configurer la base de données MariaDB/MySQL"
echo "   mysql -u root -p < ../database/migrations/001_initial_schema.sql"
echo "   mysql -u root -p < ../database/seeds/002_default_data.sql"
echo ""
echo "2️⃣  Éditer le fichier .env avec vos paramètres"
echo "   nano .env"
echo ""
echo "3️⃣  Démarrer le serveur en mode développement"
echo "   npm run dev"
echo ""
echo "4️⃣  Accéder au panel"
echo "   http://localhost:5000"
echo ""
echo "👤 Master Admin par défaut:"
echo "   Username: master"
echo "   Password: ChangeMeOnFirstLogin!"
echo "   ⚠️  Changez le mot de passe immédiatement !"
echo ""
echo "=========================================="
