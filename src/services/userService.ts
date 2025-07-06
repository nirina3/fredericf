import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { User } from '../types';

export interface CreateAdminUserData {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'editor';
}

class UserService {
  // Créer un utilisateur admin/editor
  async createAdminUser(userData: CreateAdminUserData): Promise<void> {
    try {
      // Créer l'utilisateur dans Firebase Auth
      const { user } = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      
      // Créer le document utilisateur avec le rôle admin/editor
      const userDoc: Partial<User> = {
        email: user.email!,
        name: userData.name,
        role: userData.role,
        subscription: {
          id: '',
          userId: user.uid,
          planId: 'pro',
          plan: {
            id: 'pro',
            name: 'Pro',
            price: 99.99,
            currency: 'EUR',
            interval: 'month',
            features: [
              'Projets illimités',
              'Support prioritaire',
              'Galerie premium',
              'Fonctionnalités avancées',
              'Support téléphonique',
              'Accès admin'
            ],
            maxProjects: -1,
            support: 'Téléphone + Email'
          },
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 an
          amount: userData.role === 'admin' ? 0 : 99.99, // Gratuit pour admin
          currency: 'EUR'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'users', user.uid), userDoc);
      
      console.log(`Utilisateur ${userData.role} créé avec succès:`, userData.email);
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur admin:', error);
      throw error;
    }
  }

  // Mettre à jour le rôle d'un utilisateur existant
  async updateUserRole(userId: string, newRole: 'admin' | 'editor' | 'user'): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      
      // Vérifier que l'utilisateur existe
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        throw new Error('Utilisateur non trouvé');
      }

      // Mettre à jour le rôle
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: new Date()
      });

      console.log(`Rôle mis à jour pour l'utilisateur ${userId}: ${newRole}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle:', error);
      throw error;
    }
  }

  // Fonction utilitaire pour créer rapidement un admin
  async createQuickAdmin(email: string, name: string, password: string = 'Admin123!'): Promise<void> {
    return this.createAdminUser({
      email,
      name,
      password,
      role: 'admin'
    });
  }

  // Fonction utilitaire pour créer rapidement un éditeur
  async createQuickEditor(email: string, name: string, password: string = 'Editor123!'): Promise<void> {
    return this.createAdminUser({
      email,
      name,
      password,
      role: 'editor'
    });
  }
}

export const userService = new UserService();
export default userService;