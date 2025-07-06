import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Check, X, MapPin, Search, Filter, Download, AlertCircle, User, Mail, Phone } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { Reservation } from '../../types';

const ReservationManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Mock data pour la démonstration
  const mockReservations: Reservation[] = [
    {
      id: '1',
      friteryId: '1',
      friteryName: 'Friterie Chez Marcel',
      userId: 'user1',
      userName: 'Marie Dubois',
      userEmail: 'marie.dubois@example.com',
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
      userId: 'user2',
      userName: 'Jean Martin',
      userEmail: 'jean.martin@example.com',
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
      userId: 'user3',
      userName: 'Sophie Lambert',
      userEmail: 'sophie.lambert@example.com',
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
      userId: 'user4',
      userName: 'Pierre Delacroix',
      userEmail: 'pierre.delacroix@example.com',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Il y a 2 jours
      time: '18:00',
      guests: 3,
      status: 'cancelled',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: '5',
      friteryId: '1',
      friteryName: 'Friterie Chez Marcel',
      userId: 'user5',
      userName: 'Luc Dupont',
      userEmail: 'luc.dupont@example.com',
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Demain
      time: '13:00',
      guests: 2,
      status: 'pending',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  ];

  useEffect(() => {
    // Simulation du chargement des réservations
    setTimeout(() => {
      setReservations(mockReservations);
      setFilteredReservations(mockReservations);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterReservations();
  }, [reservations, searchTerm, statusFilter, dateFilter]);

  const filterReservations = () => {
    let filtered = reservations;

    // Filtrer par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    // Filtrer par date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dateFilter === 'today') {
      filtered = filtered.filter(r => {
        const reservationDate = new Date(r.date);
        reservationDate.setHours(0, 0, 0, 0);
        return reservationDate.getTime() === today.getTime();
      });
    } else if (dateFilter === 'upcoming') {
      filtered = filtered.filter(r => r.date > today);
    } else if (dateFilter === 'past') {
      filtered = filtered.filter(r => r.date < today);
    }

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.friteryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReservations(filtered);
  };

  const handleUpdateStatus = (reservationId: string, newStatus: Reservation['status']) => {
    setReservations(prev => prev.map(r =>
      r.id === reservationId ? { ...r, status: newStatus, updatedAt: new Date() } : r
    ));

    addNotification({
      type: 'success',
      title: 'Statut mis à jour',
      message: `La réservation a été ${newStatus === 'confirmed' ? 'confirmée' : newStatus === 'cancelled' ? 'annulée' : 'marquée comme terminée'} avec succès.`,
      category: 'system',
      priority: 'medium'
    });
  };

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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
        <p className="text-gray-600">Seuls les administrateurs peuvent gérer les réservations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Calendar className="h-6 w-6 mr-2" />
              Gestion des réservations
            </h1>
            <p className="text-gray-600 mt-2">
              Gérez les réservations des clients dans les friteries partenaires
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              icon={<Download className="h-4 w-4" />}
            >
              Exporter
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmées</option>
              <option value="completed">Terminées</option>
              <option value="cancelled">Annulées</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">Toutes les dates</option>
              <option value="today">Aujourd'hui</option>
              <option value="upcoming">À venir</option>
              <option value="past">Passées</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            {filteredReservations.length} réservation{filteredReservations.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg mr-4">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {reservations.filter(r => r.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">En attente</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {reservations.filter(r => r.status === 'confirmed').length}
              </div>
              <div className="text-sm text-gray-600">Confirmées</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {reservations.filter(r => r.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Terminées</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg mr-4">
              <X className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {reservations.filter(r => r.status === 'cancelled').length}
              </div>
              <div className="text-sm text-gray-600">Annulées</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reservations List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="ml-2 text-gray-600">Chargement...</span>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune réservation trouvée</h3>
            <p className="text-gray-600">
              {reservations.length === 0 
                ? 'Aucune réservation n\'est disponible pour le moment.'
                : 'Aucune réservation ne correspond à vos critères de recherche.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Friterie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Heure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Personnes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {reservation.userName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{reservation.userName}</div>
                          <div className="text-sm text-gray-500">{reservation.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{reservation.friteryName}</div>
                      <div className="text-xs text-gray-500">ID: {reservation.friteryId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(reservation.date)}</div>
                      <div className="text-sm text-gray-500">{reservation.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {reservation.guests}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                        {getStatusText(reservation.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedReservation(reservation);
                            setShowDetailsModal(true);
                          }}
                        >
                          Détails
                        </Button>
                        {reservation.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleUpdateStatus(reservation.id, 'confirmed')}
                          >
                            Confirmer
                          </Button>
                        )}
                        {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleUpdateStatus(reservation.id, 'cancelled')}
                          >
                            Annuler
                          </Button>
                        )}
                        {reservation.status === 'confirmed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleUpdateStatus(reservation.id, 'completed')}
                          >
                            Terminer
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reservation Details Modal */}
      {showDetailsModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                Détails de la réservation
              </h3>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedReservation(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Friterie</h4>
                <p className="text-lg font-semibold text-gray-900">{selectedReservation.friteryName}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Date</h4>
                  <p className="text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-orange-500" />
                    {formatDate(selectedReservation.date)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Heure</h4>
                  <p className="text-gray-900 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-orange-500" />
                    {selectedReservation.time}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Nombre de personnes</h4>
                <p className="text-gray-900 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-orange-500" />
                  {selectedReservation.guests} {selectedReservation.guests > 1 ? 'personnes' : 'personne'}
                </p>
              </div>
              
              {selectedReservation.specialRequests && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Demandes spéciales</h4>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {selectedReservation.specialRequests}
                  </p>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Informations client</h4>
                <div className="space-y-2">
                  <p className="text-gray-900 flex items-center">
                    <User className="h-4 w-4 mr-2 text-orange-500" />
                    {selectedReservation.userName}
                  </p>
                  <p className="text-gray-900 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-orange-500" />
                    {selectedReservation.userEmail}
                  </p>
                  <p className="text-gray-900 flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-orange-500" />
                    Non renseigné
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Statut</h4>
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedReservation.status)}`}>
                    {getStatusText(selectedReservation.status)}
                  </span>
                  <span className="text-xs text-gray-500 ml-3">
                    Créée le {formatDate(selectedReservation.createdAt)}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                {selectedReservation.status === 'pending' && (
                  <Button
                    onClick={() => {
                      handleUpdateStatus(selectedReservation.id, 'confirmed');
                      setShowDetailsModal(false);
                      setSelectedReservation(null);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Confirmer
                  </Button>
                )}
                {(selectedReservation.status === 'pending' || selectedReservation.status === 'confirmed') && (
                  <Button
                    onClick={() => {
                      handleUpdateStatus(selectedReservation.id, 'cancelled');
                      setShowDetailsModal(false);
                      setSelectedReservation(null);
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Annuler
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedReservation(null);
                  }}
                >
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationManagement;