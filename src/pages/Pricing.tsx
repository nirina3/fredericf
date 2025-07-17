import React from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Crown, Star } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

const Pricing: React.FC = () => {
  const { currentUser } = useAuth();

  // Updated plans to match the design style
  const plans = [
    {
      id: 'gratuit',
      name: 'Gratuit', 
      price: 0, 
      currency: 'USD',
      interval: 'mois',
      description: 'Devenez parmi nos abonnés',
      features: [
        { name: 'Consultation de l\'annuaire des Friterie', included: true },
        { name: 'Ajout d\'1 Friterie pour 1 mois', included: true },
        { name: 'Alerté sur tous les évènement et nouveauté', included: true },
        { name: 'Désabonnement possible à tous moment', included: true }
      ],
      popular: false,
      color: 'border-gray-200'
    },
    {
      id: 'standard',
      name: 'Client Accro',
      price: 10.00,
      currency: 'USD',
      interval: 'mois',
      description: 'Profitez pleinement vos privilèges',
      features: [
        { name: 'Consultation de l\'annuaire des Friterie', included: true },
        { name: 'Passer commande ou réserver une table', included: true },
        { name: 'Alerté sur tous les évènement et nouveauté', included: true },
        { name: 'Bénéficier des code promo', included: true },
        { name: 'Désabonnement possible à tous moment', included: true }
      ],
      popular: true,
      color: 'border-blue-500'
    },
    {
      id: 'pro',
      name: 'Friteries Premium',
      price: 30.00,
      currency: 'USD',
      interval: 'mois',
      description: 'Développez vos activités',
      features: [
        { name: 'Consultation de l\'annuaire des Friterie', included: true },
        { name: 'Ajout d\'1 Friterie pour 1 mois', included: true },
        { name: 'Accès à nos galléries photo premium', included: true },
        { name: 'Alerté sur tous les évènement et nouveauté', included: true },
        { name: 'Désabonnement possible à tous moment', included: true }
      ],
      popular: false,
      color: 'border-purple-500'
    }
  ];

  const faq = [
    {
      question: "Puis-je changer de plan à tout moment ?",
      answer: "Oui, vous pouvez passer à un plan supérieur ou inférieur à tout moment. Les changements prendront effet immédiatement."
    },
    {
      question: "Y a-t-il une période d'essai gratuite ?",
      answer: "Oui, nous offrons une période d'essai gratuite de 7 jours sur nos plans Standard et Pro."
    },
    {
      question: "Comment puis-je annuler mon abonnement ?",
      answer: "Vous pouvez annuler votre abonnement à tout moment depuis votre espace client. L'accès restera actif jusqu'à la fin de la période payée."
    },
    {
      question: "Acceptez-vous les remboursements ?",
      answer: "Nous offrons une garantie de remboursement de 30 jours sans condition pour tous nos plans."
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section - Updated to match site style */}
      <section className="relative bg-gradient-to-br from-orange-600 to-red-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-yellow-300 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-orange-300 rounded-full blur-3xl opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
            <Crown className="h-5 w-5 text-yellow-300 mr-2" />
            <span className="text-yellow-100 font-medium">Nos Abonnements</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-8">
            Des plans adaptés à <span className="text-yellow-300">vos besoins</span>
          </h1>
          <p className="text-xl md:text-2xl text-orange-100 leading-relaxed max-w-3xl mx-auto">
            Sélectionnez le plan qui correspond le mieux à vos besoins et à votre budget
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-orange-100 rounded-full px-6 py-3 mb-6">
              <Crown className="h-5 w-5 text-orange-600 mr-2" />
              <span className="text-orange-800 font-medium">Nos Formules</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choisissez votre <span className="text-orange-600">plan</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des tarifs transparents et adaptés à tous les besoins
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg border-2 ${plan.color} ${
                  plan.popular ? 'transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center shadow-lg">
                      <Star className="h-4 w-4 mr-1" />
                      Populaire
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{plan.name}</h3>
                    <p className="text-gray-600 mb-5">{plan.description}</p>
                    {plan.price === 0 ? (
                      <div className="text-5xl font-bold text-orange-600 mb-2">
                        Gratuit
                      </div>
                    ) : (
                      <div className="text-5xl font-bold text-orange-600 mb-2">
                        €{plan.price}
                      </div>
                    )}
                    <div className="text-gray-600">/{plan.interval}</div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-orange-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                        )}
                        <span className={feature.included ? 'text-gray-900' : 'text-gray-500'}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-3">
                    {currentUser ? (
                      <Button
                        className="w-full"
                        className={`w-full ${plan.popular ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700' : plan.id === 'gratuit' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                        disabled={currentUser.subscription?.plan?.id === plan.id}
                      >
                        <span className={plan.popular ? 'text-white' : plan.id === 'gratuit' ? 'text-gray-700' : 'text-white'}>
                          {currentUser.subscription?.plan?.id === plan.id ? 'Plan actuel' : `Choisir ${plan.name}`}
                        </span>
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        className={`w-full ${plan.popular ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700' : plan.id === 'gratuit' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                      >
                        <Link to="/signup">
                          <span className={plan.popular ? 'text-white' : plan.id === 'gratuit' ? 'text-gray-700' : 'text-white'}>
                            {plan.id === 'gratuit' ? 'Commencer gratuitement' : 'Commencer l\'essai gratuit'}
                          </span>
                        </Link>
                      </Button>
                    )}
                    <p className="text-xs text-gray-500 text-center">
                      {plan.id === 'gratuit' ? 'Sans carte de crédit' : 'Aucun engagement • Annulation à tout moment'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-orange-100 rounded-full px-6 py-3 mb-6">
              <Star className="h-5 w-5 text-orange-600 mr-2" />
              <span className="text-orange-800 font-medium">Comparaison</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Comparaison <span className="text-orange-600">détaillée</span>
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez en détail ce qui est inclus dans chaque plan
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-orange-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fonctionnalités
                    </th>
                    {plans.map(plan => (
                      <th key={plan.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {plans[0].features.map((feature, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {feature.name}
                      </td>
                      {plans.map((plan) => (
                        <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-center">
                          {plan.features[index].included ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-gray-400 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-xl text-gray-600">
              Trouvez les réponses aux questions les plus courantes
            </p>
          </div>

          <div className="space-y-8">
            {faq.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {item.question}
                </h3>
                <p className="text-gray-600">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à <span className="text-yellow-300">commencer</span> ?
          </h2>
          <p className="text-xl mb-10 text-orange-100 max-w-2xl mx-auto">
            Commencez gratuitement ou essayez nos plans payants pendant 7 jours
          </p>
          <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 px-8 py-4">
            <Link to="/signup" className="flex items-center">
              <span className="text-orange-600">Créer un compte</span>
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Pricing;