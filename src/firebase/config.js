import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLiWXbJRVeSN8li1UNeXvqHTOlZyKYDBE",
  authDomain: "restorann1.firebaseapp.com",
  projectId: "restorann1",
  storageBucket: "restorann1.firebasestorage.app",
  messagingSenderId: "675833806645",
  appId: "1:675833806645:web:df3e4eb8576bdf5caf567c",
  measurementId: "G-DH19Y5GBPG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics'ni faqat production'da ishlatish
let analytics = null;
if (process.env.NODE_ENV === 'production') {
    try {
        analytics = getAnalytics(app);
    } catch (error) {
        console.log('Analytics yuklanmadi:', error);
    }
}

const db = getFirestore(app);

export { db };