// Configuration Firebase pour MonFritkot
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDrgrUqD9jDxp_jDTcqO0RkIZUjNFpio2Q",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "friterie-9c7d7.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "friterie-9c7d7",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "friterie-9c7d7.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1050064325788",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1050064325788:web:e429112319c873dfa07159"
};

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
  // Fallback pour éviter que l'application ne plante
  app = {} as any;
}

// Initialize Firebase services
export const auth = app.name ? getAuth(app) : {} as any;
export const db = app.name ? getFirestore(app) : {} as any;
export const storage = app.name ? getStorage(app) : {} as any;

export default app;