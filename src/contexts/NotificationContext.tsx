import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Bell, Check, X, Info, AlertTriangle, AlertCircle, XCircle } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  category: 'system' | 'user' | 'content' | 'billing' | 'security';
  priority: 'low' | 'medium' | 'high';
  persistent?: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  closeAllToasts: () => void;
  showToast: (type: Notification['type'], title: string, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<Notification[]>([]);

  // Fonction pour fermer tous les toasts
  const closeAllToasts = () => {
    setToasts([]);
  };

  // Mock notifications pour la démonstration
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'success',
        title: 'Bienvenue !',
        message: 'Votre compte a été créé avec succès. Découvrez toutes nos fonctionnalités.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        category: 'system',
        priority: 'medium',
        actionUrl: '/services',
        actionText: 'Découvrir'
      },
      {
        id: '2',
        type: 'info',
        title: 'Nouvelle image ajoutée',
        message: 'Une nouvelle image a été ajoutée à la galerie premium.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false,
        category: 'content',
        priority: 'low',
        actionUrl: '/gallery',
        actionText: 'Voir'
      },
      {
        id: '3',
        type: 'warning',
        title: 'Abonnement bientôt expiré',
        message: 'Votre abonnement expire dans 3 jours. Renouvelez-le pour continuer à profiter de nos services.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
        category: 'billing',
        priority: 'high',
        actionUrl: '/subscription',
        actionText: 'Renouveler'
      },
      {
        id: '4',
        type: 'info',
        title: 'Nouvel article de blog',
        message: 'Découvrez notre dernier article sur les tendances friterie 2024.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: true,
        category: 'content',
        priority: 'low',
        actionUrl: '/blog',
        actionText: 'Lire'
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Ajouter aussi comme toast si ce n'est pas persistant
    if (!notification.persistent) {
      setToasts(prev => [...prev, newNotification]);
      
      // Supprimer le toast après 5 secondes
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newNotification.id));
      }, 5000);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const showToast = (type: Notification['type'], title: string, message: string) => {
    addNotification({
      type,
      title,
      message,
      category: 'system',
      priority: 'medium'
    });
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <Check className="h-5 w-5" />;
      case 'error':
        return <AlertCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'info':
        return <Info className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getToastColors = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    showToast,
    closeAllToasts
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`max-w-sm w-full border rounded-lg shadow-lg p-4 transition-all duration-300 transform ${getToastColors(toast.type)}`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getIcon(toast.type)}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">{toast.title}</p>
                <p className="text-sm mt-1 opacity-90">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-4 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
              </div>
            </div>
          </div>
        ))}
        {toasts.length > 1 && (
          <button 
            onClick={closeAllToasts}
            className="ml-auto block bg-white text-gray-700 px-3 py-1 rounded-md text-sm font-medium shadow-md hover:bg-gray-50 transition-colors"
            title="Fermer toutes les notifications"
          >
            <div className="flex items-center">
              <XCircle className="h-4 w-4 mr-1" />
              Fermer toutes ({toasts.length})
            </div>
          </button>
        )}
      </div>
    </NotificationContext.Provider>
  );
};