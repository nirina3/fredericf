// Configuration Firebase pour MonFritkot
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuration Firebase simplifiée
const firebaseConfig = {
  apiKey: "AIzaSyDrgrUqD9jDxp_jDTcqO0RkIZUjNFpio2Q",
  authDomain: "friterie-9c7d7.firebaseapp.com",
  projectId: "friterie-9c7d7",
  storageBucket: "friterie-9c7d7.appspot.com",
  messagingSenderId: "1050064325788",
  appId: "1:1050064325788:web:e429112319c873dfa07159"
};

// Initialisation avec gestion d'erreurs
let app;
let auth;
let db;
let storage;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  
  // Initialize Firebase services
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.error("Erreur d'initialisation Firebase:", error);
  
  // Créer des objets factices pour éviter les erreurs
  auth = {} as any;
  db = {} as any;
  storage = {} as any;
}

export { auth, db, storage };
export default app;