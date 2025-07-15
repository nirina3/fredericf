import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { DirectoryEntry } from '../types';

class DirectoryService {
  // Récupérer toutes les entrées de l'annuaire
  async getAllEntries(): Promise<DirectoryEntry[]> {
    try {
      const q = query(collection(db, 'directory'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const entries: DirectoryEntry[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        entries.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          lastUpdated: data.lastUpdated.toDate()
        } as DirectoryEntry);
      });
      
      return entries;
    } catch (error) {
      console.error('Error fetching directory entries:', error);
      throw error;
    }
  }

  // Ajouter une nouvelle entrée
  async addEntry(entry: Omit<DirectoryEntry, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'directory'), {
        ...entry,
        createdAt: new Date(),
        lastUpdated: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding directory entry:', error);
      throw error;
    }
  }

  // Ajouter plusieurs entrées (pour l'import CSV)
  async addMultipleEntries(entries: Omit<DirectoryEntry, 'id'>[]): Promise<string[]> {
    try {
      const ids: string[] = [];
      
      // Utiliser Promise.all pour traiter toutes les entrées en parallèle
      const promises = entries.map(async (entry) => {
        const docRef = await addDoc(collection(db, 'directory'), {
          ...entry,
          createdAt: new Date(),
          lastUpdated: new Date()
        });
        ids.push(docRef.id);
      });
      
      await Promise.all(promises);
      return ids;
    } catch (error) {
      console.error('Error adding multiple directory entries:', error);
      throw error;
    }
  }

  // Mettre à jour une entrée
  async updateEntry(id: string, data: Partial<DirectoryEntry>): Promise<void> {
    try {
      await updateDoc(doc(db, 'directory', id), {
        ...data,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error updating directory entry:', error);
      throw error;
    }
  }

  // Supprimer une entrée
  async deleteEntry(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'directory', id));
    } catch (error) {
      console.error('Error deleting directory entry:', error);
      throw error;
    }
  }

  // Rechercher des entrées
  async searchEntries(searchTerm: string): Promise<DirectoryEntry[]> {
    try {
      // Récupérer toutes les entrées et filtrer côté client
      // Note: Firestore ne supporte pas la recherche plein texte native
      const entries = await this.getAllEntries();
      
      return entries.filter(entry => 
        entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.contact.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.contact.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching directory entries:', error);
      throw error;
    }
  }

  // Filtrer par catégorie
  async getEntriesByCategory(category: string): Promise<DirectoryEntry[]> {
    try {
      const q = query(
        collection(db, 'directory'),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      const entries: DirectoryEntry[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        entries.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          lastUpdated: data.lastUpdated.toDate()
        } as DirectoryEntry);
      });
      
      return entries;
    } catch (error) {
      console.error('Error fetching entries by category:', error);
      throw error;
    }
  }

  // Filtrer par région
  async getEntriesByRegion(region: string): Promise<DirectoryEntry[]> {
    try {
      const q = query(
        collection(db, 'directory'),
        where('contact.region', '==', region),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      const entries: DirectoryEntry[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        entries.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          lastUpdated: data.lastUpdated.toDate()
        } as DirectoryEntry);
      });
      
      return entries;
    } catch (error) {
      console.error('Error fetching entries by region:', error);
      throw error;
    }
  }

  // Obtenir les entrées vérifiées
  async getVerifiedEntries(): Promise<DirectoryEntry[]> {
    try {
      const q = query(
        collection(db, 'directory'),
        where('verified', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      const entries: DirectoryEntry[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        entries.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          lastUpdated: data.lastUpdated.toDate()
        } as DirectoryEntry);
      });
      
      return entries;
    } catch (error) {
      console.error('Error fetching verified entries:', error);
      throw error;
    }
  }

  // Obtenir les entrées premium
  async getPremiumEntries(): Promise<DirectoryEntry[]> {
    try {
      const q = query(
        collection(db, 'directory'),
        where('premium', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      const entries: DirectoryEntry[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        entries.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          lastUpdated: data.lastUpdated.toDate()
        } as DirectoryEntry);
      });
      
      return entries;
    } catch (error) {
      console.error('Error fetching premium entries:', error);
      throw error;
    }
  }

  // Mettre à jour le statut vérifié
  async toggleVerifiedStatus(id: string, verified: boolean): Promise<void> {
    try {
      await updateDoc(doc(db, 'directory', id), {
        verified,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error updating verified status:', error);
      throw error;
    }
  }

  // Mettre à jour le statut premium
  async togglePremiumStatus(id: string, premium: boolean): Promise<void> {
    try {
      await updateDoc(doc(db, 'directory', id), {
        premium,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error updating premium status:', error);
      throw error;
    }
  }
}

export const directoryService = new DirectoryService();
export default directoryService;