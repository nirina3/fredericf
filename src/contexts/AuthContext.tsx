import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setCurrentUser({ id: user.uid, ...userDoc.data() } as User);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setCurrentUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string, name: string) => {
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
  };

  const logout = async () => {
    await signOut(auth);
  };

  const isSubscribed = (requiredPlan?: string) => {
    if (!currentUser?.subscription) return false;
    
    const planHierarchy = { 'basic': 1, 'premium': 2, 'pro': 3 };
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