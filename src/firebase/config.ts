// Configuration Firebase pour MonFritkot
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDrgrUqD9jDxp_jDTcqO0RkIZUjNFpio2Q",
  authDomain: "friterie-9c7d7.firebaseapp.com",
  projectId: "friterie-9c7d7",
  storageBucket: "friterie-9c7d7.firebasestorage.app",
  messagingSenderId: "1050064325788",
  appId: "1:1050064325788:web:e429112319c873dfa07159"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app, "gs://friterie-9c7d7.appspot.com");

// Vérifier si le bucket de stockage est correctement configuré
console.log('Firebase Storage bucket:', storage.bucket);

export default app;