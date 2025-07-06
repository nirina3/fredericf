import React from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Crown, Star } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

const Pricing: React.FC = () => {
  const { currentUser } = useAuth();

  const plans = [
    {
      id: 'gratuit',
      name: 'Gratuit', 
      price: 0, 
      currency: '$',
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
      currency: '$',
      interval: 'mois',
      description: 'Profitez pleinement vos privilèges en tant que client accro',
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
      currency: '$',
      interval: 'mois',
      description: 'Développez vos activités avec monfritkot.be',
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
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Des plans adaptés à vos besoins
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Sélectionnez le plan qui correspond le mieux à vos besoins et à votre budget.
            Nos plans payants incluent une période d'essai gratuite de 7 jours.
          </p>
          <div className="flex items-center justify-center space-x-2">
            <Crown className="h-6 w-6 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">Essai gratuit de 7 jours</span>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-lg shadow-lg border-2 ${plan.color} ${
                  plan.popular ? 'transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      Populaire
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    {plan.price === 0 ? (
                      <div className="text-5xl font-bold text-blue-600 mb-2">
                        Gratuit
                      </div>
                    ) : (
                      <div className="text-5xl font-bold text-blue-600 mb-2">
                        {plan.currency}{plan.price}
                      </div>
                    )}
                    <div className="text-gray-600">/{plan.interval}</div>
                  </div>

                  <ul className="space-y-3 mb-8">
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

                  <div className="space-y-3">
                    {currentUser ? (
                      <Button
                        className="w-full"
                        variant={plan.popular ? 'primary' : plan.id === 'gratuit' ? 'outline' : 'primary'}
                        disabled={currentUser.subscription?.plan?.id === plan.id}
                      >
                        {currentUser.subscription?.plan?.id === plan.id ? 'Plan actuel' : `Choisir ${plan.name}`}
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        variant={plan.popular ? 'primary' : plan.id === 'gratuit' ? 'outline' : 'primary'}
                      >
                        <Link to="/signup">{plan.id === 'gratuit' ? 'Commencer gratuitement' : 'Commencer l\'essai gratuit'}</Link>
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comparaison détaillée
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez en détail ce qui est inclus dans chaque plan
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
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
      <section className="py-16">
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
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
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
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Commencez gratuitement ou essayez nos plans payants pendant 7 jours
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
            <Link to="/signup">Créer un compte</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Pricing;