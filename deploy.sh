#!/bin/bash

# Moda Markazi Mini App Deployment Script

echo "🚀 Moda Markazi Mini App'ni Firebase'ga yuklash..."

# Firebase CLI o'rnatish (agar yo'q bo'lsa)
if ! command -v firebase &> /dev/null; then
    echo "📦 Firebase CLI o'rnatilmoqda..."
    npm install -g firebase-tools
fi

# Firebase'ga login qilish
echo "🔐 Firebase'ga kirish..."
firebase login

# Build qilish
echo "🔨 React app build qilinmoqda..."
npm run build

# Firebase'ga deploy qilish
echo "📤 Firebase'ga yuklanmoqda..."
firebase deploy --only hosting

echo "✅ Deployment muvaffaqiyatli yakunlandi!"
echo "🌐 URL: https://your-project-id.web.app"
echo ""
echo "📝 Eslatma:"
echo "1. Firebase Console'da hosting URL'ini oling"
echo "2. Bot sozlamalarida WEB_APP_URL'ni yangilang"
echo "3. Mini App'ni Telegram'da sinab ko'ring" 