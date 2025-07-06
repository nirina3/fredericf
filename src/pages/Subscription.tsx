import React, { useState } from 'react';
import { Crown, Check, X, CreditCard, Calendar, Download, ArrowRight, Star, Shield, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Subscription: React.FC = () => {
  const { currentUser, isSubscribed } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Parfait pour débuter',
      monthlyPrice: 19.99,
      yearlyPrice: 199.99,
      features: [
        { name: '5 projets maximum', included: true },
        { name: 'Support par email', included: true },
        { name: 'Accès galerie de base', included: true },
        { name: 'Documentation complète', included: true },
        { name: 'Support prioritaire', included: false },
        { name: 'Galerie premium', included: false },
        { name: 'Fonctionnalités avancées', included: false },
        { name: 'Support téléphonique', included: false }
      ],
      popular: false,
      color: 'border-gray-200',
      buttonColor: 'bg-gray-600 hover:bg-gray-700'
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Le plus populaire',
      monthlyPrice: 49.99,
      yearlyPrice: 499.99,
      features: [
        { name: '20 projets maximum', included: true },
        { name: 'Support par email', included: true },
        { name: 'Accès galerie de base', included: true },
        { name: 'Documentation complète', included: true },
        { name: 'Support prioritaire', included: true },
        { name: 'Galerie premium', included: true },
        { name: 'Fonctionnalités avancées', included: true },
        { name: 'Support téléphonique', included: false }
      ],
      popular: true,
      color: 'border-orange-500',
      buttonColor: 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Pour les professionnels',
      monthlyPrice: 99.99,
      yearlyPrice: 999.99,
      features: [
        { name: 'Projets illimités', included: true },
        { name: 'Support par email', included: true },
        { name: 'Accès galerie de base', included: true },
        { name: 'Documentation complète', included: true },
        { name: 'Support prioritaire', included: true },
        { name: 'Galerie premium', included: true },
        { name: 'Fonctionnalités avancées', included: true },
        { name: 'Support téléphonique', included: true }
      ],
      popular: false,
      color: 'border-purple-500',
      buttonColor: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  const benefits = [
    {
      icon: <Crown className="h-8 w-8" />,
      title: 'Accès Premium',
      description: 'Débloquez toutes les fonctionnalités avancées'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Support Prioritaire',
      description: 'Assistance rapide et personnalisée'
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Mises à jour',
      description: 'Accès anticipé aux nouvelles fonctionnalités'
    }
  ];

  const getCurrentPlan = () => {
    return currentUser?.subscription?.plan?.id || 'trial';
  };

  const getPrice = (plan: typeof plans[0]) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan: typeof plans[0]) => {
    const monthlyTotal = plan.monthlyPrice * 12;
    const yearlyPrice = plan.yearlyPrice;
    const savings = monthlyTotal - yearlyPrice;
    const percentage = Math.round((savings / monthlyTotal) * 100);
    return { amount: savings, percentage };
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-orange-100 rounded-full px-6 py-3 mb-6">
            <Crown className="h-5 w-5 text-orange-600 mr-2" />
            <span className="text-orange-800 font-medium">Mon Abonnement</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Gérez votre <span className="text-orange-600">abonnement</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choisissez le plan qui correspond le mieux à vos besoins et développez votre activité
          </p>
        </div>

        {/* Current Subscription Status */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Abonnement actuel</h2>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              currentUser.subscription.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : currentUser.subscription.status === 'trial'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {currentUser.subscription.status === 'active' ? 'Actif' : 
               currentUser.subscription.status === 'trial' ? 'Essai gratuit' : 'Inactif'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
              <Crown className="h-12 w-12 text-yellow-300 mb-4" />
              <h3 className="text-xl font-bold mb-2">{currentUser.subscription.plan.name}</h3>
              <div className="text-3xl font-bold mb-2">
                €{currentUser.subscription.plan.price}
                <span className="text-lg font-normal text-orange-200">/{currentUser.subscription.plan.interval}</span>
              </div>
              <p className="text-orange-100">
                {currentUser.subscription.status === 'trial' 
                  ? `Expire le ${new Date(currentUser.subscription.endDate).toLocaleDateString('fr-FR')}`
                  : `Prochain paiement le ${new Date(currentUser.subscription.endDate).toLocaleDateString('fr-FR')}`
                }
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Utilisation</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Projets</span>
                    <span>3 / {currentUser.subscription.plan.maxProjects === -1 ? '∞' : currentUser.subscription.plan.maxProjects}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Stockage</span>
                    <span>2.1 GB / 10 GB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '21%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Actions rapides</h4>
              <div className="space-y-3">
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger facture
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Gérer paiement
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Historique
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-2 shadow-lg">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-3 rounded-md font-medium transition-colors relative ${
                  billingCycle === 'yearly'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annuel
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  -20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const isCurrentPlan = getCurrentPlan() === plan.id;
            const savings = getSavings(plan);
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg border-2 ${plan.color} ${
                  plan.popular ? 'transform scale-105' : ''
                } transition-all duration-300 hover:shadow-xl`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center shadow-lg">
                      <Star className="h-4 w-4 mr-1" />
                      Populaire
                    </span>
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-4 right-4">
                    <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      Plan actuel
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    
                    <div className="mb-4">
                      <div className="text-5xl font-bold text-gray-900 mb-2">
                        €{getPrice(plan)}
                      </div>
                      <div className="text-gray-600">
                        /{billingCycle === 'monthly' ? 'mois' : 'an'}
                      </div>
                      {billingCycle === 'yearly' && (
                        <div className="text-sm text-green-600 font-medium mt-2">
                          Économisez €{savings.amount} ({savings.percentage}%)
                        </div>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                        )}
                        <span className={feature.included ? 'text-gray-900' : 'text-gray-500'}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${plan.buttonColor}`}
                    disabled={isCurrentPlan}
                  >
                    {isCurrentPlan ? 'Plan actuel' : `Choisir ${plan.name}`}
                    {!isCurrentPlan && <ArrowRight className="h-4 w-4 ml-2" />}
                  </Button>

                  {!isCurrentPlan && (
                    <p className="text-xs text-gray-500 text-center mt-3">
                      Changement immédiat • Annulation à tout moment
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Pourquoi choisir un abonnement premium ?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-4 rounded-2xl mb-4 mx-auto w-fit">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Questions fréquentes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "Puis-je changer de plan à tout moment ?",
                answer: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement."
              },
              {
                question: "Comment annuler mon abonnement ?",
                answer: "Vous pouvez annuler votre abonnement depuis votre profil. L'accès reste actif jusqu'à la fin de la période payée."
              },
              {
                question: "Y a-t-il des frais cachés ?",
                answer: "Non, nos prix sont transparents. Aucun frais caché ou surprise sur votre facture."
              },
              {
                question: "Puis-je obtenir un remboursement ?",
                answer: "Nous offrons une garantie de remboursement de 30 jours sans condition pour tous nos plans."
              }
            ].map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Besoin d'aide pour choisir le bon plan ?
          </p>
          <Link to="/contact">
            <Button variant="outline">
              Contacter le support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Subscription;