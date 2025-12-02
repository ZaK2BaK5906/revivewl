#!/bin/bash

# =====================================================
# Script de Démarrage - FiveM Whitelist Panel
# =====================================================

echo "=========================================="
echo "🚀 Démarrage du serveur..."
echo "=========================================="
echo ""

# Vérifier si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules non trouvé !"
    echo "📦 Lancez d'abord: npm install"
    exit 1
fi

# Vérifier si .env existe
if [ ! -f ".env" ]; then
    echo "❌ Fichier .env non trouvé !"
    echo "📋 Copiez .env.example vers .env et configurez-le"
    exit 1
fi

# Démarrer le serveur
echo "🔄 Démarrage en mode développement..."
echo ""
npm run dev
