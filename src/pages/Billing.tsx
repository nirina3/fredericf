import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Download, Calendar, Settings, AlertCircle, Crown, ExternalLink } from 'lucide-react';
import Button from '../components/ui/Button';
import PaymentMethodCard from '../components/payment/PaymentMethodCard';
import InvoiceCard from '../components/payment/InvoiceCard';
import AddPaymentMethodModal from '../components/payment/AddPaymentMethodModal';
import { useAuth } from '../contexts/AuthContext';
import stripeService, { PaymentMethod, Invoice } from '../services/stripe';

const Billing: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('payment-methods');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock customer ID - in real app, this would come from your user data
  const customerId = currentUser?.stripeCustomerId || 'cus_mock_customer_id';

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, these would be actual API calls
      // For demo purposes, we'll use mock data
      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: 'pm_1',
          type: 'card',
          card: {
            brand: 'visa',
            last4: '4242',
            exp_month: 12,
            exp_year: 2025,
          },
        },
        {
          id: 'pm_2',
          type: 'card',
          card: {
            brand: 'mastercard',
            last4: '5555',
            exp_month: 8,
            exp_year: 2026,
          },
        },
      ];

      const mockInvoices: Invoice[] = [
        {
          id: 'in_1',
          amount_paid: 4999,
          amount_due: 0,
          currency: 'eur',
          status: 'paid',
          created: Math.floor(Date.now() / 1000) - 86400 * 30,
          invoice_pdf: 'https://example.com/invoice.pdf',
          hosted_invoice_url: 'https://example.com/invoice',
        },
        {
          id: 'in_2',
          amount_paid: 0,
          amount_due: 4999,
          currency: 'eur',
          status: 'open',
          created: Math.floor(Date.now() / 1000) - 86400 * 5,
          invoice_pdf: '',
          hosted_invoice_url: 'https://example.com/invoice2',
        },
      ];

      setPaymentMethods(mockPaymentMethods);
      setInvoices(mockInvoices);
    } catch (error: any) {
      setError(error.message || 'Erreur lors du chargement des données de facturation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePaymentMethod = (paymentMethodId: string) => {
    setPaymentMethods(prev => prev.filter(pm => pm.id !== paymentMethodId));
  };

  const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
    // In a real app, this would update the default payment method via API
    console.log('Setting default payment method:', paymentMethodId);
  };

  const handleOpenBillingPortal = async () => {
    try {
      await stripeService.redirectToBillingPortal(customerId);
    } catch (error: any) {
      // Show a more user-friendly error message for demo mode
      setError(error.message || 'Le portail de facturation nécessite une configuration backend complète.');
    }
  };

  const tabs = [
    { id: 'payment-methods', name: 'Méthodes de paiement', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'invoices', name: 'Factures', icon: <Download className="h-5 w-5" /> },
    { id: 'billing-info', name: 'Informations', icon: <Settings className="h-5 w-5" /> },
  ];

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 px-8 py-12 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Facturation</h1>
                <p className="text-orange-100">
                  Gérez vos méthodes de paiement, factures et informations de facturation
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-orange-200 mb-1">Plan actuel</div>
                <div className="text-2xl font-bold">{currentUser.subscription.plan.name}</div>
                <div className="text-orange-200">
                  €{currentUser.subscription.plan.price}/{currentUser.subscription.plan.interval}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-orange-100 text-orange-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Actions rapides</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleOpenBillingPortal}
                    icon={<ExternalLink className="h-4 w-4" />}
                  >
                    Portail Stripe
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    icon={<Crown className="h-4 w-4" />}
                  >
                    Changer de plan
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Payment Methods Tab */}
              {activeTab === 'payment-methods' && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Méthodes de paiement</h2>
                    <Button
                      onClick={() => setShowAddPaymentModal(true)}
                      icon={<Plus className="h-4 w-4" />}
                      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                    >
                      Ajouter une carte
                    </Button>
                  </div>

                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="animate-pulse bg-gray-200 h-24 rounded-xl"></div>
                      ))}
                    </div>
                  ) : paymentMethods.length === 0 ? (
                    <div className="text-center py-12">
                      <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Aucune méthode de paiement
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Ajoutez une carte de crédit pour gérer vos paiements
                      </p>
                      <Button
                        onClick={() => setShowAddPaymentModal(true)}
                        icon={<Plus className="h-4 w-4" />}
                        className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                      >
                        Ajouter votre première carte
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {paymentMethods.map((paymentMethod, index) => (
                        <PaymentMethodCard
                          key={paymentMethod.id}
                          paymentMethod={paymentMethod}
                          isDefault={index === 0}
                          onDelete={handleDeletePaymentMethod}
                          onSetDefault={handleSetDefaultPaymentMethod}
                        />
                      ))}
                    </div>
                  )}

                  {/* Security Notice */}
                  <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-lg mr-4">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-blue-900 mb-2">Sécurité des paiements</h3>
                        <p className="text-sm text-blue-800 mb-3">
                          Vos informations de paiement sont sécurisées par Stripe, leader mondial 
                          du paiement en ligne. Nous ne stockons jamais vos données de carte.
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-blue-700">
                          <span className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                            Cryptage SSL 256-bit
                          </span>
                          <span className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                            Conformité PCI DSS
                          </span>
                          <span className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                            3D Secure
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Invoices Tab */}
              {activeTab === 'invoices' && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Factures</h2>
                    <div className="flex items-center space-x-4">
                      <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm">
                        <option>Toutes les factures</option>
                        <option>Payées</option>
                        <option>En attente</option>
                        <option>Annulées</option>
                      </select>
                      <Button
                        variant="outline"
                        icon={<Download className="h-4 w-4" />}
                      >
                        Exporter
                      </Button>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-xl"></div>
                      ))}
                    </div>
                  ) : invoices.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Aucune facture
                      </h3>
                      <p className="text-gray-600">
                        Vos factures apparaîtront ici une fois que vous aurez effectué des paiements
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {invoices.map((invoice) => (
                        <InvoiceCard key={invoice.id} invoice={invoice} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Billing Info Tab */}
              {activeTab === 'billing-info' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Informations de facturation</h2>
                  
                  <div className="space-y-8">
                    {/* Billing Address */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Adresse de facturation</h3>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nom complet
                            </label>
                            <input
                              type="text"
                              defaultValue={currentUser.name}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email
                            </label>
                            <input
                              type="email"
                              defaultValue={currentUser.email}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Adresse
                            </label>
                            <input
                              type="text"
                              defaultValue={currentUser.address || ''}
                              placeholder="Rue de la Friterie 123"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Ville
                            </label>
                            <input
                              type="text"
                              defaultValue={currentUser.city || ''}
                              placeholder="Bruxelles"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Code postal
                            </label>
                            <input
                              type="text"
                              defaultValue={currentUser.postalCode || ''}
                              placeholder="1000"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                          </div>
                        </div>
                        <div className="mt-6">
                          <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                            Mettre à jour l'adresse
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Tax Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations fiscales</h3>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Numéro de TVA (optionnel)
                            </label>
                            <input
                              type="text"
                              placeholder="BE0123456789"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Pays
                            </label>
                            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                              <option value="BE">Belgique</option>
                              <option value="FR">France</option>
                              <option value="NL">Pays-Bas</option>
                              <option value="DE">Allemagne</option>
                            </select>
                          </div>
                        </div>
                        <div className="mt-6">
                          <Button variant="outline">
                            Mettre à jour les informations fiscales
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Billing Preferences */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Préférences de facturation</h3>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">Factures par email</h4>
                              <p className="text-sm text-gray-600">Recevoir les factures par email</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                            </label>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">Rappels de paiement</h4>
                              <p className="text-sm text-gray-600">Recevoir des rappels avant échéance</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      <AddPaymentMethodModal
        isOpen={showAddPaymentModal}
        onClose={() => setShowAddPaymentModal(false)}
        customerId={customerId}
        onSuccess={loadBillingData}
      />
    </div>
  );
};

export default Billing;