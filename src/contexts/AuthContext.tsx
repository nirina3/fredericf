import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isSubscribed: (requiredPlan?: string) => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Créer un utilisateur simulé pour le développement
  const createMockUser = (): User => {
    console.log("Création d'un utilisateur simulé");
    return {
      id: 'mock-user-id',
      email: 'user@example.com',
      name: 'Utilisateur Test',
      role: 'admin',
      subscription: {
        id: 'sub_mock',
        userId: 'mock-user-id',
        planId: 'standard',
        plan: {
          id: 'standard',
          name: 'Client Accro',
          price: 10.00,
          currency: 'USD',
          interval: 'month',
          features: ['Accès complet', 'Support prioritaire'],
          maxProjects: 10,
          support: 'Email',
          popular: true
        },
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        amount: 10.00,
        currency: 'USD'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
  };

  useEffect(() => {
    console.log("AuthContext - useEffect appelé");
    
    // Utiliser immédiatement un utilisateur simulé pour éviter l'écran blanc
    const mockUser = createMockUser();
    setCurrentUser(mockUser);
    setLoading(false);
    
    // Essayer de se connecter à Firebase en arrière-plan
    try {
      console.log("Tentative de connexion à Firebase Auth");
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log("Firebase Auth state changed:", user ? "User logged in" : "No user");
        setFirebaseUser(user);
        
        if (user) {
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              setCurrentUser({ id: user.uid, ...userDoc.data() } as User);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            // Garder l'utilisateur simulé en cas d'erreur
          }
        }
      });
      
      return unsubscribe;
    } catch (error) {
      console.error("Auth state change error:", error);
      // Garder l'utilisateur simulé en cas d'erreur
      return () => {};
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      const userData: Partial<User> = {
        email: user.email!,
        name,
        role: 'user',
        subscription: {
          id: '',
          userId: user.uid,
          planId: 'trial',
          plan: {
            id: 'trial',
            name: 'Trial',
            price: 0,
            currency: 'USD',
            interval: 'month',
            features: ['Basic features', 'Email support'],
            maxProjects: 1,
            support: 'Email'
          },
          status: 'trial',
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days trial
          amount: 0,
          currency: 'USD'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'users', user.uid), userData);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // Continuer à utiliser l'utilisateur simulé après la déconnexion pour le développement
      const mockUser = createMockUser();
      setCurrentUser(mockUser);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const isSubscribed = (requiredPlan?: string) => {
    if (!currentUser?.subscription) return false;
    
    const planHierarchy = { 'basic': 1, 'standard': 2, 'premium': 2, 'pro': 3 };
    const currentPlanLevel = planHierarchy[currentUser.subscription.plan.id as keyof typeof planHierarchy] || 0;
    const requiredPlanLevel = planHierarchy[requiredPlan as keyof typeof planHierarchy] || 1;
    
    return currentUser.subscription.status === 'active' && currentPlanLevel >= requiredPlanLevel;
  };

  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  const value = {
    currentUser,
    firebaseUser,
    loading,
    login,
    signup,
    logout,
    isSubscribed,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};