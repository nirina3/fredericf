// Configuration Firebase simplifiée pour MonFritkot
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

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;