import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Check, X, MapPin, Info, Filter, Search, Download } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

interface Reservation {
  id: string;
  friteryId: string;
  friteryName: string;
  userId: string;
  date: Date;
  time: string;
  guests: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
}

const ReservationHistory: React.FC = () => {
  const { currentUser } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data pour la démonstration
  const mockReservations: Reservation[] = [
    {
      id: '1',
      friteryId: '1',
      friteryName: 'Friterie Chez Marcel',
      userId: currentUser?.id || '',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Dans 2 jours
      time: '19:30',
      guests: 4,
      specialRequests: 'Table près de la fenêtre si possible',
      status: 'confirmed',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      friteryId: '2',
      friteryName: 'La Baraque à Frites',
      userId: currentUser?.id || '',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Dans 7 jours
      time: '12:30',
      guests: 2,
      status: 'pending',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      friteryId: '4',
      friteryName: 'Golden Fries',
      userId: currentUser?.id || '',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Il y a 5 jours
      time: '20:00',
      guests: 6,
      specialRequests: 'Anniversaire - gâteau prévu',
      status: 'completed',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    },
    {
      id: '4',
      friteryId: '3',
      friteryName: 'Friterie du Coin',
      userId: currentUser?.id || '',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Il y a 2 jours
      time: '18:00',
      guests: 3,
      status: 'cancelled',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }
  ];

  useEffect(() => {
    // Simulation du chargement des réservations
    setTimeout(() => {
      setReservations(mockReservations);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'confirmed':
        return 'Confirmée';
      case 'cancelled':
        return 'Annulée';
      case 'completed':
        return 'Terminée';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'confirmed':
        return <Check className="h-5 w-5" />;
      case 'cancelled':
        return <X className="h-5 w-5" />;
      case 'completed':
        return <Check className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
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

  const filteredReservations = statusFilter === 'all'
    ? reservations
    : reservations.filter(r => r.status === statusFilter);

  const cancelReservation = (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;
    
    setReservations(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'cancelled' } : r
    ));
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
          <p className="text-gray-600">Vous devez être connecté pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes Réservations</h1>
              <p className="text-gray-600">
                Gérez vos réservations dans les friteries partenaires
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">Toutes les réservations</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmées</option>
                <option value="completed">Terminées</option>
                <option value="cancelled">Annulées</option>
              </select>
              <Button
                variant="outline"
                icon={<Download className="h-4 w-4" />}
              >
                Exporter
              </Button>
            </div>
          </div>
        </div>

        {/* Reservations List */}
        <div className="space-y-6">
          {loading ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement de vos réservations...</p>
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucune réservation trouvée
              </h3>
              <p className="text-gray-600 mb-6">
                {reservations.length === 0 
                  ? 'Vous n\'avez pas encore effectué de réservation.'
                  : 'Aucune réservation ne correspond à votre filtre.'
                }
              </p>
              <Button
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                Explorer les friteries
              </Button>
            </div>
          ) : (
            filteredReservations.map((reservation) => (
              <div key={reservation.id} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mr-3">{reservation.friteryName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(reservation.status)}`}>
                        {getStatusIcon(reservation.status)}
                        <span className="ml-1">{getStatusText(reservation.status)}</span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-5 w-5 mr-2 text-orange-500" />
                        <span>{formatDate(reservation.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-5 w-5 mr-2 text-orange-500" />
                        <span>{reservation.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-5 w-5 mr-2 text-orange-500" />
                        <span>{reservation.guests} {reservation.guests > 1 ? 'personnes' : 'personne'}</span>
                      </div>
                    </div>
                    
                    {reservation.specialRequests && (
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Demandes spéciales</h4>
                        <p className="text-gray-600">{reservation.specialRequests}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>Réservation créée le {formatDate(reservation.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    {reservation.status === 'pending' || reservation.status === 'confirmed' ? (
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-red-600 border-red-300 hover:bg-red-50"
                          onClick={() => cancelReservation(reservation.id)}
                        >
                          Annuler
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        Réserver à nouveau
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationHistory;