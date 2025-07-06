import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Calendar, Clock, Users, AlertCircle, Check, X } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

interface ReservationFormProps {
  friteryId: string;
  friteryName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const schema = yup.object({
  date: yup.date().required('Date requise').min(new Date(), 'La date doit être dans le futur'),
  time: yup.string().required('Heure requise'),
  guests: yup.number().required('Nombre de personnes requis').min(1, 'Minimum 1 personne').max(20, 'Maximum 20 personnes'),
  specialRequests: yup.string().max(500, 'Maximum 500 caractères'),
  termsAccepted: yup.boolean().oneOf([true], 'Vous devez accepter les conditions')
});

type FormData = yup.InferType<typeof schema>;

const ReservationForm: React.FC<ReservationFormProps> = ({ friteryId, friteryName, onSuccess, onCancel }) => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      date: undefined,
      time: '',
      guests: 2,
      specialRequests: '',
      termsAccepted: false
    }
  });

  const availableTimes = [
    '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', 
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
  ];

  const onSubmit = async (data: FormData) => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Réservation soumise:', {
        friteryId,
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        ...data,
        status: 'pending',
        createdAt: new Date()
      });
      
      addNotification({
        type: 'success',
        title: 'Réservation effectuée',
        message: `Votre réservation chez ${friteryName} a été enregistrée avec succès.`,
        category: 'system',
        priority: 'medium'
      });
      
      setSuccess(true);
      reset();
      
      // Attendre un peu avant de fermer le modal pour montrer le message de succès
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Une erreur est survenue lors de la réservation. Veuillez réessayer.',
        category: 'system',
        priority: 'high'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (success) {
    return (
      <div className="text-center py-8 animate-fade-in">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6 animate-pulse">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          Réservation confirmée !
        </h3>
        
        <p className="text-gray-600 mb-6">
          Votre réservation chez {friteryName} a été enregistrée avec succès. Vous recevrez un email de confirmation dans quelques instants.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Réserver chez {friteryName}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="date"
              {...register('date')}
              min={new Date().toISOString().split('T')[0]}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          {errors.date && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.date.message}
            </p>
          )}
        </div>

        {/* Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Heure *
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              {...register('time')}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Sélectionnez une heure</option>
              {availableTimes.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          {errors.time && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.time.message}
            </p>
          )}
        </div>
      </div>

      {/* Number of guests */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre de personnes *
        </label>
        <div className="relative">
          <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="number"
            {...register('guests', { valueAsNumber: true })}
            min="1"
            max="20"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        {errors.guests && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.guests.message}
          </p>
        )}
      </div>

      {/* Special requests */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Demandes spéciales
        </label>
        <textarea
          {...register('specialRequests')}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
          placeholder="Allergies, préférences, occasions spéciales..."
        />
        {errors.specialRequests && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.specialRequests.message}
          </p>
        )}
      </div>

      {/* Terms */}
      <div className="flex items-start">
        <input
          type="checkbox"
          id="termsAccepted"
          {...register('termsAccepted')}
          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mt-1"
        />
        <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-700">
          J'accepte les conditions de réservation et la politique d'annulation *
        </label>
      </div>
      {errors.termsAccepted && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {errors.termsAccepted.message}
        </p>
      )}

      {/* User info */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Informations de contact</h4>
        <div className="text-sm text-gray-600">
          <p className="mb-1">Nom: {currentUser?.name}</p>
          <p className="mb-1">Email: {currentUser?.email}</p>
          <p className="mb-1">Téléphone: {currentUser?.phone || 'Non renseigné'}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
        >
          {isSubmitting ? 'Réservation en cours...' : 'Confirmer la réservation'}
        </Button>
      </div>
    </form>
  );
};

export default ReservationForm;