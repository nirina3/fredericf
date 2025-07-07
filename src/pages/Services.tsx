import React from 'react';
import { Crown, Users, BookOpen, Image, BarChart3, Headphones, Zap, Shield, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services: React.FC = () => {
  const mainServices = [
    {
      icon: <Crown className="h-12 w-12" />,
      title: "Abonnements Premium",
      description: "Accédez à du contenu exclusif et des fonctionnalités avancées avec nos plans d'abonnement flexibles.",
      features: ["Contenu exclusif", "Support prioritaire", "Outils avancés", "Communauté VIP"],
      color: "from-orange-500 to-red-600"
    },
    {
      icon: <Users className="h-12 w-12" />,
      title: "Communauté Active",
      description: "Rejoignez une communauté de passionnés et partagez vos expériences avec d'autres professionnels.",
      features: ["Forums de discussion", "Événements exclusifs", "Networking", "Partage d'expériences"],
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: <BookOpen className="h-12 w-12" />,
      title: "Formation & Conseils",
      description: "Bénéficiez de formations spécialisées et de conseils d'experts pour développer votre activité.",
      features: ["Formations en ligne", "Conseils d'experts", "Guides pratiques", "Webinaires"],
      color: "from-green-500 to-teal-600"
    },
    {
      icon: <Image className="h-12 w-12" />,
      title: "Galerie Premium",
      description: "Showcasez vos réalisations dans notre galerie premium et inspirez la communauté.",
      features: ["Galerie haute qualité", "Mise en avant", "Portfolio professionnel", "Visibilité accrue"],
      color: "from-purple-500 to-pink-600"
    }
  ];

  const additionalServices = [
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Analytics & Insights",
      description: "Analysez vos performances et optimisez votre stratégie avec nos outils d'analyse avancés."
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: "Support Dédié",
      description: "Bénéficiez d'un support client réactif et personnalisé pour tous vos besoins."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Outils Innovants",
      description: "Utilisez nos outils innovants pour moderniser et optimiser votre activité."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Sécurité Garantie",
      description: "Vos données sont protégées par les dernières technologies de sécurité."
    }
  ];

  const plans = [
    {
      name: "Basic",
      price: "19.99",
      description: "Parfait pour débuter",
      features: ["5 projets", "Support email", "Galerie de base", "Documentation"],
      popular: false
    },
    {
      name: "Premium",
      price: "49.99",
      description: "Le plus populaire",
      features: ["20 projets", "Support prioritaire", "Galerie premium", "Formations"],
      popular: true
    },
    {
      name: "Pro",
      price: "99.99",
      description: "Pour les professionnels",
      features: ["Projets illimités", "Support téléphonique", "Accès complet", "Consulting"],
      popular: false
    }
  ];

  const process = [
    {
      step: "1",
      title: "Inscription",
      description: "Créez votre compte en quelques minutes"
    },
    {
      step: "2",
      title: "Choix du plan",
      description: "Sélectionnez le plan qui vous convient"
    },
    {
      step: "3",
      title: "Configuration",
      description: "Personnalisez votre espace selon vos besoins"
    },
    {
      step: "4",
      title: "Lancement",
      description: "Commencez à utiliser tous nos services"
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-600 to-red-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-yellow-300 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-orange-300 rounded-full blur-3xl opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
              <Award className="h-5 w-5 text-yellow-300 mr-2" />
              <span className="text-yellow-100 font-medium">Nos Services</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-8">
              Services <span className="text-yellow-300">Premium</span>
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 leading-relaxed">
              Découvrez notre gamme complète de services conçus pour 
              développer votre passion et votre activité dans la friterie
            </p>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-orange-100 rounded-full px-6 py-3 mb-8">
              <Crown className="h-5 w-5 text-orange-600 mr-2" />
              <span className="text-orange-800 font-medium">Services Principaux</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Toutx ce dont vous avez <span className="text-orange-600">besoin</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une suite complète de services pour accompagner votre développement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mainServices.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                <div className={`bg-gradient-to-r ${service.color} p-8 text-white`}>
                  <div className="mb-4">{service.icon}</div>
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-white/90 leading-relaxed">{service.description}</p>
                </div>
                <div className="p-8">
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Services <span className="text-orange-600">complémentaires</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des services additionnels pour une expérience complète
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalServices.map((service, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-6 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto w-fit">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-orange-100 rounded-full px-6 py-3 mb-8">
              <Zap className="h-5 w-5 text-orange-600 mr-2" />
              <span className="text-orange-800 font-medium">Comment ça marche</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Commencer en <span className="text-orange-600">4 étapes</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full">
                    <ArrowRight className="h-6 w-6 text-orange-400 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-orange-100 rounded-full px-6 py-3 mb-8">
              <Crown className="h-5 w-5 text-orange-600 mr-2" />
              <span className="text-orange-800 font-medium">Nos Tarifs</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choisissez votre <span className="text-orange-600">plan</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des tarifs transparents et adaptés à tous les besoins
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div key={index} className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 transform hover:-translate-y-1 ${
                plan.popular ? 'border-orange-500 scale-105' : 'border-gray-200 hover:border-orange-300'
              }`}>
                {plan.popular && (
                  <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-center py-3 rounded-t-2xl">
                    <span className="font-bold">Plus Populaire</span>
                  </div>
                )}
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    <div className="text-4xl font-bold text-orange-600 mb-2">€{plan.price}</div>
                    <div className="text-gray-600">/mois</div>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link 
                    to="/pricing"
                    className={`block w-full text-center py-3 rounded-lg font-bold transition-colors duration-200 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700' 
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Choisir {plan.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à commencer votre <span className="text-yellow-300">transformation</span> ?
          </h2>
          <p className="text-xl mb-10 text-orange-100 max-w-2xl mx-auto">
            Rejoignez des centaines de professionnels qui font confiance à MonFritkot
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/pricing"
              className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold hover:bg-orange-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Voir tous les plans
            </Link>
            <Link 
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;