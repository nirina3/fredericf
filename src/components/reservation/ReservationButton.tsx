import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import Button from '../ui/Button';
import ReservationModal from './ReservationModal';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

interface ReservationButtonProps {
  friteryId: string;
  friteryName: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const ReservationButton: React.FC<ReservationButtonProps> = ({
  friteryId,
  friteryName,
  className,
  variant = 'primary',
  size = 'md'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser, isSubscribed } = useAuth();
  const { addNotification } = useNotifications();
  
  const handleOpenModal = () => {
    if (!currentUser) {
      addNotification({
        type: 'info',
        title: 'Connexion requise',
        message: 'Vous devez être connecté pour effectuer une réservation.',
        category: 'system',
        priority: 'medium',
        actionUrl: '/login',
        actionText: 'Se connecter'
      });
      return;
    }

    if (!isSubscribed('standard')) {
      addNotification({
        type: 'warning',
        title: 'Abonnement requis',
        message: 'La réservation est disponible uniquement pour les abonnés Client Accro ou supérieur.',
        category: 'system',
        priority: 'medium',
        actionUrl: '/pricing',
        actionText: 'Voir les abonnements'
      });
      return;
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        onClick={handleOpenModal}
        variant={variant}
        size={size}
        className={className}
        icon={variant !== 'ghost' ? <Calendar className="h-4 w-4" /> : undefined}
      >
        {variant === 'ghost' ? 'Réserver' : 'Réserver une table'}
      </Button>

      <ReservationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        friteryId={friteryId}
        friteryName={friteryName}
      />
    </>
  );
};

export default ReservationButton;