import React, { createContext, useContext, useState, ReactNode } from 'react';
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

  // Simuler un utilisateur pour le développement
  React.useEffect(() => {
    try {
      // Écouter les changements d'authentification
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setFirebaseUser(user);
        
        if (user) {
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              setCurrentUser({ id: user.uid, ...userDoc.data() } as User);
            } else {
              console.log("User document doesn't exist in Firestore");
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            // Créer un utilisateur simulé pour le développement
            createMockUser(user);
          }
        } else {
          setCurrentUser(null);
        }
        
        setLoading(false);
      });
      
      return unsubscribe;
    } catch (error) {
      console.error("Auth state change error:", error);
      // Créer un utilisateur simulé pour le développement
      createMockUser();
      setLoading(false);
      return () => {};
    }
  }, []);

  // Fonction pour créer un utilisateur simulé
  const createMockUser = (user?: FirebaseUser) => {
    console.log("Creating mock user for development");
    const mockUser: User = {
      id: user?.uid || 'mock-user-id',
      email: user?.email || 'user@example.com',
      name: user?.displayName || 'Utilisateur Test',
      role: 'user',
      subscription: {
        id: 'sub_mock',
        userId: user?.uid || 'mock-user-id',
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
    
    setCurrentUser(mockUser);
  };

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