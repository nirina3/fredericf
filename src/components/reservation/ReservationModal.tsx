import React, { useEffect, useRef } from 'react';
import { X, Calendar } from 'lucide-react';
import ReservationForm from './ReservationForm';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  friteryId: string;
  friteryName: string;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  friteryId,
  friteryName
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Empêcher le défilement du body quand le modal est ouvert
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    // Fonction de nettoyage pour restaurer le défilement
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    // Gestionnaire pour fermer le modal en cliquant à l'extérieur
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Gestionnaire pour fermer le modal avec la touche Escape
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-2 rounded-lg mr-3">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Réservation</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <ReservationForm
            friteryId={friteryId}
            friteryName={friteryName}
            onSuccess={onClose}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;