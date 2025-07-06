import React from 'react';
import { X } from 'lucide-react';
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
  if (!isOpen) return null;

  const handleSuccess = () => {
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
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
            onSuccess={handleSuccess}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}