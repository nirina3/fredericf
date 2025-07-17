import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Crown, Users, BookOpen, Image as ImageIcon, BarChart3, Headphones, Zap, Shield, Award, ArrowRight, Search, Check } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db, storage } from '../firebase/config';
import { ref, getDownloadURL } from 'firebase/storage';

const Home: React.FC = () => {
  const [stats, setStats] = useState({
    users: 500,
    friteries: 50,
    recipes: 1000,
    satisfaction: 98
  });

  const [friteryImage, setFriteryImage] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch users count
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersCount = usersSnapshot.size;
        
        // Fetch friteries count
        const friteriesSnapshot = await getDocs(collection(db, 'directory'));
        const friteriesCount = friteriesSnapshot.size;
        
        // Fetch recipes/articles count
        const articlesSnapshot = await getDocs(collection(db, 'blog'));
        const articlesCount = articlesSnapshot.size;
        
        // Update stats with real data, fallback to default values if count is 0
        setStats({
          users: usersCount || 500,
          friteries: friteriesCount || 50,
          recipes: articlesCount || 1000,
          satisfaction: 98 // Hardcoded as this would typically come from a different source
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Keep default values in case of error
      }
    };
    
    fetchStats();
  }, []);

  // Charger l'image WhatsApp depuis le dossier public
  useEffect(() => {
    setFriteryImage('/WhatsApp Image 2025-07-17 at 3.08.26 PM.jpeg');
  }, []);

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
      description: "Bénéficiez de formations spécialisées et de conseils d'experts pour votre activité.",
      features: ["Formations en ligne", "Conseils d'experts", "Guides pratiques", "Webinaires"],
      color: "from-green-500 to-teal-600"
    },
    {
      icon: <ImageIcon className="h-12 w-12" />,
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
      name: "Abonné",
      price: "0",
      description: "Parfait pour débuter",
      features: ["Consultation de l'annuaire des Friterie", "Ajout d'1 Friterie pour 1 mois", "Désabonnement possible à tous moment"],
      popular: false
    },
    {
      name: "Client Accro",
      price: "10.00",
      description: "Le plus populaire",
      features: ["Consultation de l'annuaire des Friterie", "Passer commande ou réserver une table", "Bénéficier des code promo", "Désabonnement possible à tous moment"],
      popular: true
    },
    {
      name: "Friterie Premium",
      price: "30.00",
      description: "Pour les professionnels",
      features: ["Consultation de l'annuaire des Friterie", "Ajout de 3 friteries pour un an", "Tableau de bord pour gérer ses friteries", "Accès à la galerie photo premium", "Désabonnement possible à tout moment"],
      popular: false
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-red-700 to-red-600 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-8">
            Bienvenue chez <span className="text-yellow-300">MonFritkot</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-white max-w-3xl mx-auto mb-4 sm:mb-8">
            Votre plateforme de référence pour tout ce qui concerne la friterie belge.
          </p>
          
          <div className="mb-4 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
              Trouvez vos meilleures friteries
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white mb-2 sm:mb-4 md:mb-6">
              Flamande, Wallonne et Bruxelloise
            </p>
            
            <div className="max-w-4xl mx-auto px-4">
              <form action="/directory" method="get" className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="search"
                    placeholder="Entrez un mot clé"
                    className="w-full pl-10 px-4 py-3 md:py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <input
                  type="text"
                  name="location"
                  placeholder="Adresse, proximité..."
                  className="flex-1 px-4 py-3 md:py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  defaultValue=""
                />
                <button 
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Rechercher
                </button>
              </form>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 md:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300 mb-1 sm:mb-2">{stats.users}+</div>
              <div className="text-orange-100 text-sm sm:text-base">Membres actifs</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300 mb-1 sm:mb-2">{stats.friteries}+</div>
              <div className="text-orange-100 text-sm sm:text-base">Friteries partenaires</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300 mb-1 sm:mb-2">{stats.recipes}+</div>
              <div className="text-orange-100 text-sm sm:text-base">Recettes partagées</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300 mb-1 sm:mb-2">{stats.satisfaction}%</div>
              <div className="text-orange-100 text-sm sm:text-base">Satisfaction client</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
                La référence pour les friteries belges
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-4 md:mb-6 leading-relaxed">
                MonFritkot.be est né de la passion pour la friterie belge authentique. Notre mission est de créer un pont entre la tradition séculaire de nos friteries et les outils modernes du digital.
              </p>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Que vous soyez propriétaire d'une friterie ou simplement amateur de bonnes frites, notre plateforme vous offre des services adaptés à vos besoins.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <div className="rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300 mx-auto max-w-md md:max-w-full">
                <img 
                  src={friteryImage} 
                  alt="Friterie belge authentique" 
                  className="w-full h-auto object-cover rounded-2xl max-h-[400px]"
                  onError={(e) => {
                    // Fallback to a default image if the WhatsApp image fails to load
                    e.currentTarget.src = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800';
                  }}
                />
              </div>
            </div>
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
              Tout ce dont vous avez <span className="text-orange-600">besoin</span>
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
                <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-4 sm:p-6 rounded-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto w-fit">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
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
                plan.popular ? 'border-orange-500 md:scale-105' : 'border-gray-200 hover:border-orange-300'
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
                    {plan.price === "0" ? (
                      <div className="text-4xl font-bold text-orange-600 mb-2">Gratuit</div>
                    ) : (
                      <>
                        <div className="text-4xl font-bold text-orange-600 mb-2">€{plan.price}</div>
                        <div className="text-gray-600">/mois</div>
                      </>
                    )}
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <div className="flex-shrink-0 mt-1.5">
                          <Check className="h-5 w-5 text-orange-500" />
                        </div>
                        <span className="ml-3">{feature}</span>
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
                    style={{ padding: '0.875rem 1rem' }}
                  >
                    Choisir {plan.name}
                  </Link>
                </div>
                <div className="text-xs text-gray-500 text-center mt-3">
                  {plan.name === "Gratuit" ? "Sans carte de crédit" : "Aucun engagement • Annulation à tout moment"}
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
          <div className="flex justify-center">
            <Link
              to="/pricing" 
              className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold hover:bg-orange-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Découvrir nos offres
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;