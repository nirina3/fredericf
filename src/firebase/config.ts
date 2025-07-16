// Configuration Firebase pour MonFritkot
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Mode debug
const DEBUG = true;
const debugLog = (...args: any[]) => {
  if (DEBUG) {
    console.log('[FIREBASE CONFIG DEBUG]', ...args);
  }
};

const firebaseConfig = {
  apiKey: "AIzaSyDrgrUqD9jDxp_jDTcqO0RkIZUjNFpio2Q",
  authDomain: "friterie-9c7d7.firebaseapp.com",
  projectId: "friterie-9c7d7",
  storageBucket: "friterie-9c7d7.firebasestorage.app",
  messagingSenderId: "1050064325788",
  appId: "1:1050064325788:web:e429112319c873dfa07159"
};

debugLog('Initializing Firebase with config:', {
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
debugLog('Initializing Firebase services...');
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

debugLog('Firebase services initialized:', { auth: !!auth, db: !!db, storage: !!storage });

export default app;