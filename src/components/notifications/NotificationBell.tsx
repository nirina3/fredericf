import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationCenter from './NotificationCenter';

const NotificationBell: React.FC = () => {
  const { unreadCount, closeAllToasts } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const handleBellClick = () => {
    // Si le centre de notifications est déjà ouvert, on le ferme
    if (isOpen) {
      setIsOpen(false);
    } else {
      // Sinon, on ferme d'abord tous les toasts puis on ouvre le centre
      closeAllToasts();
      setIsOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handleBellClick}
        className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors rounded-lg hover:bg-orange-50"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <NotificationCenter
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default NotificationBell;