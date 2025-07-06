import { useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';

// Hook pour simuler les notifications en temps réel
export const useRealTimeNotifications = () => {
  const { addNotification } = useNotifications();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    // Simuler des notifications en temps réel
    const intervals: NodeJS.Timeout[] = [];

    // Notification de bienvenue après 3 secondes
    const welcomeTimeout = setTimeout(() => {
      if (currentUser.subscription.status === 'trial') {
        addNotification({
          type: 'info',
          title: 'Période d\'essai active',
          message: 'Profitez de votre essai gratuit de 7 jours pour découvrir toutes nos fonctionnalités !',
          category: 'system',
          priority: 'medium',
          actionUrl: '/pricing',
          actionText: 'Voir les plans'
        });
      }
    }, 3000);

    // Notifications périodiques (toutes les 30 secondes pour la démo)
    const periodicInterval = setInterval(() => {
      const notifications = [
        {
          type: 'info' as const,
          title: 'Nouvelle image ajoutée',
          message: 'Une nouvelle image vient d\'être ajoutée à la galerie premium.',
          category: 'content' as const,
          priority: 'low' as const,
          actionUrl: '/gallery',
          actionText: 'Voir'
        },
        {
          type: 'success' as const,
          title: 'Profil mis à jour',
          message: 'Vos informations de profil ont été sauvegardées avec succès.',
          category: 'user' as const,
          priority: 'low' as const
        },
        {
          type: 'warning' as const,
          title: 'Maintenance programmée',
          message: 'Une maintenance est prévue dimanche de 2h à 4h du matin.',
          category: 'system' as const,
          priority: 'medium' as const
        }
      ];

      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      addNotification(randomNotification);
    }, 30000);

    intervals.push(periodicInterval);

    // Notification spéciale pour les admins
    if (currentUser.role === 'admin') {
      const adminInterval = setInterval(() => {
        addNotification({
          type: 'info',
          title: 'Nouveau utilisateur inscrit',
          message: 'Un nouvel utilisateur vient de s\'inscrire sur la plateforme.',
          category: 'user',
          priority: 'low',
          actionUrl: '/admin/users',
          actionText: 'Voir'
        });
      }, 45000);

      intervals.push(adminInterval);
    }

    // Nettoyage
    return () => {
      clearTimeout(welcomeTimeout);
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [currentUser, addNotification]);
};