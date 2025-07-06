import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Reservation } from '../types';

class ReservationService {
  // Créer une nouvelle réservation
  async createReservation(reservationData: Omit<Reservation, 'id' | 'createdAt' | 'status'>): Promise<string> {
    try {
      const newReservation = {
        ...reservationData,
        status: 'pending',
        createdAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'reservations'), newReservation);
      return docRef.id;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  }

  // Récupérer les réservations d'un utilisateur
  async getUserReservations(userId: string): Promise<Reservation[]> {
    try {
      const q = query(
        collection(db, 'reservations'),
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const reservations: Reservation[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reservations.push({
          id: doc.id,
          ...data,
          date: data.date.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined
        } as Reservation);
      });

      return reservations;
    } catch (error) {
      console.error('Error fetching user reservations:', error);
      throw error;
    }
  }

  // Récupérer les réservations d'une friterie
  async getFriteryReservations(friteryId: string): Promise<Reservation[]> {
    try {
      const q = query(
        collection(db, 'reservations'),
        where('friteryId', '==', friteryId),
        orderBy('date', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const reservations: Reservation[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reservations.push({
          id: doc.id,
          ...data,
          date: data.date.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined
        } as Reservation);
      });

      return reservations;
    } catch (error) {
      console.error('Error fetching fritery reservations:', error);
      throw error;
    }
  }

  // Mettre à jour le statut d'une réservation
  async updateReservationStatus(reservationId: string, status: Reservation['status']): Promise<void> {
    try {
      await updateDoc(doc(db, 'reservations', reservationId), {
        status,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating reservation status:', error);
      throw error;
    }
  }

  // Annuler une réservation
  async cancelReservation(reservationId: string): Promise<void> {
    return this.updateReservationStatus(reservationId, 'cancelled');
  }

  // Confirmer une réservation
  async confirmReservation(reservationId: string): Promise<void> {
    return this.updateReservationStatus(reservationId, 'confirmed');
  }

  // Marquer une réservation comme terminée
  async completeReservation(reservationId: string): Promise<void> {
    return this.updateReservationStatus(reservationId, 'completed');
  }

  // Supprimer une réservation (pour les admins)
  async deleteReservation(reservationId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'reservations', reservationId));
    } catch (error) {
      console.error('Error deleting reservation:', error);
      throw error;
    }
  }

  // Vérifier la disponibilité d'une friterie à une date et heure spécifiques
  async checkAvailability(friteryId: string, date: Date, time: string): Promise<boolean> {
    try {
      // Convertir la date en début de journée pour la comparaison
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, 'reservations'),
        where('friteryId', '==', friteryId),
        where('date', '>=', startOfDay),
        where('date', '<=', endOfDay),
        where('time', '==', time),
        where('status', 'in', ['pending', 'confirmed'])
      );

      const querySnapshot = await getDocs(q);
      
      // Si le nombre de réservations est inférieur à la capacité maximale
      // (ici on suppose une capacité de 10 réservations par créneau)
      return querySnapshot.size < 10;
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error;
    }
  }

  // Obtenir les créneaux disponibles pour une date donnée
  async getAvailableTimeSlots(friteryId: string, date: Date): Promise<string[]> {
    try {
      // Liste de tous les créneaux possibles
      const allTimeSlots = [
        '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', 
        '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
      ];
      
      // Créneaux déjà réservés
      const bookedTimeSlots = new Set<string>();
      
      // Convertir la date en début de journée pour la comparaison
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, 'reservations'),
        where('friteryId', '==', friteryId),
        where('date', '>=', startOfDay),
        where('date', '<=', endOfDay),
        where('status', 'in', ['pending', 'confirmed'])
      );

      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Si le créneau a atteint sa capacité maximale, on le marque comme indisponible
        if (data.time) {
          const timeSlot = data.time;
          const count = bookedTimeSlots.has(timeSlot) ? 1 : 0;
          if (count >= 10) { // Capacité maximale de 10 réservations par créneau
            bookedTimeSlots.add(timeSlot);
          }
        }
      });
      
      // Retourner les créneaux disponibles
      return allTimeSlots.filter(timeSlot => !bookedTimeSlots.has(timeSlot));
    } catch (error) {
      console.error('Error getting available time slots:', error);
      throw error;
    }
  }
}

export const reservationService = new ReservationService();
export default reservationService;