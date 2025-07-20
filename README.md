# Moda Markazi - Telegram Mini App

Bu loyiha Telegram Mini App va React.js'da yaratilgan onlayn do'kon.

## 🚀 O'rnatish

### 1. Paketlarni o'rnatish
```bash
npm install
```

### 2. Firebase sozlash
1. Firebase Console'da yangi loyiha yarating
2. Firestore Database'ni yoqing
3. Web app qo'shing va config'ni `src/firebase/config.js` ga joylashtiring

### 3. Development server'ni ishga tushirish
```bash
npm start
```

## 🧪 Test qilish

### Local development:
- Browser'da http://localhost:3000 ni oching
- O'ng yuqori burchakda "Test mahsulotlar" tugmasini bosing
- Mahsulotlar ro'yxatini ko'ring

### Telegram Mini App:
1. Bot'ga /start yuboring
2. "Do'konni ochish" tugmasini bosing
3. Mahsulotlarni ko'ring va tanlang

## 📱 Funksiyalar

- 🛍️ Mahsulotlar ro'yxati
- 🛒 Savatga qo'shish
- 📦 Buyurtma berish
- 👤 Profil sahifasi
- 📊 Buyurtmalar tarixi

## 🔧 Muhim fayllar

- `src/App.js` - Asosiy komponent
- `src/pages/HomePage.js` - Bosh sahifa
- `src/components/ProductCard.js` - Mahsulot karti
- `src/firebase/config.js` - Firebase sozlamalari
- `src/utils/addSampleProducts.js` - Test mahsulotlari

## 🚀 Deployment

### Firebase Hosting:
```bash
npm run build
firebase deploy --only hosting
```

### GitHub Actions (avtomatik):
1. GitHub'ga push qiling
2. Firebase'ga deploy avtomatik ishlaydi

## 📞 Yordam

Savollaringiz bo'lsa:
- Telegram: @admin_username
- Email: support@modamarkazi.uz
# bott
