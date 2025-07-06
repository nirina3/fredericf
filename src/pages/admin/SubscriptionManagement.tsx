import React, { useState, useEffect } from 'react';
import { CreditCard, Users, Calendar, Check, X, Edit, Trash2, Filter, Search, Download, Crown, Shield, AlertCircle, ArrowUpRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: string;
  planName: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trial';
  startDate: Date;
  endDate: Date;
  amount: number;
  currency: string;
  paymentMethod: string;
  autoRenew: boolean;
  lastPayment?: Date;
  nextPayment?: Date;
}

const SubscriptionManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Mock data pour la démonstration
  const mockSubscriptions: Subscription[] = [
    {
      id: 'sub_1',
      userId: 'user1',
      userName: 'Marie Dubois',
      userEmail: 'marie.dubois@example.com',
      planId: 'client-accro',
      planName: 'Client Accro',
      status: 'active',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000),
      amount: 10.00,
      currency: 'USD',
      paymentMethod: 'Visa •••• 4242',
      autoRenew: true,
      lastPayment: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      nextPayment: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'sub_2',
      userId: 'user2',
      userName: 'Jean Martin',
      userEmail: 'jean.martin@example.com',
      planId: 'gratuit',
      planName: 'Gratuit',
      status: 'active',
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      amount: 0,
      currency: 'USD',
      paymentMethod: 'Mastercard •••• 5555',
      autoRenew: true,
      lastPayment: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      nextPayment: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'sub_3',
      userId: 'user3',
      userName: 'Sophie Lambert',
      userEmail: 'sophie.lambert@example.com',
      planId: 'friteries-premium',
      planName: 'Friteries Premium',
      status: 'cancelled',
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      amount: 30.00,
      currency: 'USD',
      paymentMethod: 'Visa •••• 1234',
      autoRenew: false,
      lastPayment: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'sub_4',
      userId: 'user4',
      userName: 'Pierre Delacroix',
      userEmail: 'pierre.delacroix@example.com',
      planId: 'standard',
      planName: 'Standard',
      status: 'past_due',
      startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      amount: 9.99,
      currency: 'USD',
      paymentMethod: 'Mastercard •••• 8888',
      autoRenew: true,
      lastPayment: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      nextPayment: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'sub_5',
      userId: 'user5',
      userName: 'Luc Dupont',
      userEmail: 'luc.dupont@example.com',
      planId: 'gratuit',
      planName: 'Gratuit',
      status: 'trial',
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      amount: 0,
      currency: 'USD',
      paymentMethod: 'Aucun',
      autoRenew: false
    }
  ];

  useEffect(() => {
    // Simulation du chargement des abonnements
    setTimeout(() => {
      setSubscriptions(mockSubscriptions);
      setFilteredSubscriptions(mockSubscriptions);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterSubscriptions();
  }, [subscriptions, searchTerm, statusFilter, planFilter]);

  const filterSubscriptions = () => {
    let filtered = subscriptions;

    // Filtrer par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sub => sub.status === statusFilter);
    }

    // Filtrer par plan
    if (planFilter !== 'all') {
      filtered = filtered.filter(sub => sub.planId === planFilter);
    }

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(sub =>
        sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSubscriptions(filtered);
  };

  const handleCancelSubscription = (subscriptionId: string) => {
    if (!selectedSubscription) return;
    
    // Simuler l'annulation d'un abonnement
    setSubscriptions(prev => prev.map(sub =>
      sub.id === subscriptionId ? { ...sub, status: 'cancelled', autoRenew: false } : sub
    ));

    addNotification({
      type: 'success',
      title: 'Abonnement annulé',
      message: `L'abonnement de ${selectedSubscription.userName} a été annulé avec succès.`,
      category: 'billing',
      priority: 'medium'
    });

    setShowCancelModal(false);
    setSelectedSubscription(null);
  };

  const handleChangePlan = (subscriptionId: string, newPlan: string) => {
    // Simuler le changement de plan
    const planNames: {[key: string]: string} = {
      'gratuit': 'Gratuit',
      'standard': 'Standard',
      'pro': 'Pro'
    };
    
    const planPrices: {[key: string]: number} = {
      'gratuit': 0,
      'standard': 9.99,
      'pro': 19.99
    };

    setSubscriptions(prev => prev.map(sub =>
      sub.id === subscriptionId ? { 
        ...sub, 
        planId: newPlan,
        planName: planNames[newPlan],
        amount: planPrices[newPlan]
      } : sub
    ));

    addNotification({
      type: 'success',
      title: 'Plan modifié',
      message: `Le plan a été changé avec succès vers ${planNames[newPlan]}.`,
      category: 'billing',
      priority: 'medium'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'past_due':
        return 'bg-red-100 text-red-800';
      case 'trial':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'cancelled':
        return 'Annulé';
      case 'past_due':
        return 'Paiement en retard';
      case 'trial':
        return 'Essai';
      default:
        return status;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'gratuit':
        return 'bg-green-100 text-green-800';
      case 'standard':
        return 'bg-blue-100 text-blue-800';
      case 'pro':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const canManageSubscriptions = () => {
    return currentUser && currentUser.role === 'admin';
  };

  if (!canManageSubscriptions()) {
    return (
      <div className="text-center py-12">
        <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
        <p className="text-gray-600">Seuls les administrateurs peuvent gérer les abonnements.</p>
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
              <CreditCard className="h-6 w-6 mr-2" />
              Gestion des abonnements
            </h1>
            <p className="text-gray-600 mt-2">
              Gérez les abonnements et les paiements des utilisateurs
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {subscriptions.filter(s => s.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Abonnements actifs</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {subscriptions.filter(s => s.status === 'trial').length}
              </div>
              <div className="text-sm text-gray-600">Essais en cours</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg mr-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {subscriptions.filter(s => s.status === 'past_due').length}
              </div>
              <div className="text-sm text-gray-600">Paiements en retard</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(
                  subscriptions
                    .filter(s => s.status === 'active')
                    .reduce((sum, sub) => sum + sub.amount, 0),
                  'EUR'
                )}
              </div>
              <div className="text-sm text-gray-600">Revenu mensuel</div>
            </div>
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
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="trial">Essais</option>
              <option value="past_due">En retard</option>
              <option value="cancelled">Annulés</option>
            </select>

            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les plans</option>
              <option value="gratuit">Gratuit</option>
              <option value="standard">Standard</option>
              <option value="pro">Pro</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            {filteredSubscriptions.length} abonnement{filteredSubscriptions.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Chargement...</span>
          </div>
        ) : filteredSubscriptions.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun abonnement trouvé</h3>
            <p className="text-gray-600">
              {subscriptions.length === 0 
                ? 'Aucun abonnement n\'est disponible pour le moment.'
                : 'Aucun abonnement ne correspond à vos critères de recherche.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubscriptions.map((subscription) => (
                  <tr key={subscription.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {subscription.userName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{subscription.userName}</div>
                          <div className="text-sm text-gray-500">{subscription.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlanColor(subscription.planId)}`}>
                        {subscription.planName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                        {getStatusText(subscription.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(subscription.amount, subscription.currency)}</div>
                      <div className="text-xs text-gray-500">
                        {subscription.autoRenew ? 'Renouvellement auto' : 'Pas de renouvellement'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {subscription.startDate.toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {subscription.nextPayment 
                          ? `Prochain paiement: ${subscription.nextPayment.toLocaleDateString('fr-FR')}`
                          : `Expire le: ${subscription.endDate.toLocaleDateString('fr-FR')}`
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Edit className="h-4 w-4" />}
                          onClick={() => {
                            // Ouvrir un modal pour changer le plan
                            const newPlan = subscription.planId === 'basic' ? 'premium' : 
                                           subscription.planId === 'premium' ? 'pro' : 'basic';
                            handleChangePlan(subscription.id, newPlan);
                          }}
                        >
                          Modifier
                        </Button>
                        {subscription.status === 'active' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            icon={<X className="h-4 w-4" />}
                            onClick={() => {
                              setSelectedSubscription(subscription);
                              setShowCancelModal(true);
                            }}
                          >
                            Annuler
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<ArrowUpRight className="h-4 w-4" />}
                          onClick={() => {
                            // Ouvrir le portail de facturation Stripe
                            alert('Cette fonctionnalité nécessite une intégration complète avec Stripe.');
                          }}
                        >
                          Portail
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Annuler l'abonnement
            </h3>
            
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir annuler l'abonnement de <span className="font-medium">{selectedSubscription.userName}</span> ?
              L'utilisateur aura accès aux fonctionnalités jusqu'à la fin de la période payée.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <div>
                  ${subscriptions
                    .filter(s => s.status === 'active')
                    .reduce((sum, sub) => sum + sub.amount, 0)
                    .toFixed(2)}
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedSubscription(null);
                }}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={() => handleCancelSubscription(selectedSubscription.id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Confirmer l'annulation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;