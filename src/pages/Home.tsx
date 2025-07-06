import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Star, Users, TrendingUp, Shield, Crown, Zap, Award } from 'lucide-react';
import Button from '../components/ui/Button';

const Home: React.FC = () => {
  const features = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Communauté Active",
      description: "Rejoignez une communauté de passionnés de friterie belge et partagez vos expériences"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Contenu Premium",
      description: "Accédez à du contenu exclusif, des formations spécialisées et des conseils d'experts"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Sécurité Garantie",
      description: "Vos données sont protégées par les dernières technologies de sécurité"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Performance Optimale",
      description: "Une plateforme rapide et efficace pour une expérience utilisateur exceptionnelle"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Qualité Reconnue",
      description: "Des services de qualité reconnus par les professionnels du secteur"
    },
    {
      icon: <Crown className="h-8 w-8" />,
      title: "Service Premium",
      description: "Un support client dédié et des fonctionnalités avancées pour nos abonnés"
    }
  ];

  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Propriétaire de friterie",
      content: "MonFritkot m'a permis de moderniser mon établissement et d'attirer de nouveaux clients. Une plateforme indispensable !",
      rating: 5,
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      name: "Pierre Martin",
      role: "Entrepreneur",
      content: "Une plateforme indispensable pour quiconque veut réussir dans le secteur de la friterie. Les outils sont exceptionnels.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      name: "Sophie Lambert",
      role: "Consultante",
      content: "Les outils proposés sont d'une qualité exceptionnelle. Je recommande vivement MonFritkot à tous mes clients !",
      rating: 5,
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    }
  ];

  const stats = [
    { number: "500+", label: "Membres actifs" },
    { number: "50+", label: "Friteries partenaires" },
    { number: "1000+", label: "Recettes partagées" },
    { number: "98%", label: "Satisfaction client" }
  ];

  const plans = [
    {
      name: "Gratuit",
      price: "0",
      description: "Devenez parmi nos abonnés",
      features: ["Consultation de l'annuaire des Friterie", "Ajout d'1 Friterie pour 1 mois", "Alerté sur tous les évènement et nouveauté", "Désabonnement possible à tous moment"],
      popular: false
    },
    {
      name: "Client Accro",
      price: "10.00",
      description: "Profitez pleinement vos privilèges",
      features: ["Consultation de l'annuaire des Friterie", "Passer commande ou réserver une table", "Alerté sur tous les évènement et nouveauté", "Bénéficier des code promo", "Désabonnement possible à tous moment"],
      popular: true
    },
    {
      name: "Friteries Premium",
      price: "30.00",
      description: "Développez vos activités",
      features: ["Consultation de l'annuaire des Friterie", "Ajout d'1 Friterie pour 1 mois", "Accès à nos galléries photo premium", "Alerté sur tous les évènement et nouveauté", "Désabonnement possible à tous moment"],
      popular: false
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-600 via-red-600 to-red-700 text-white overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 to-red-600/30"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-yellow-300 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-orange-300 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
                <Crown className="h-5 w-5 text-yellow-300 mr-2" />
                <span className="text-yellow-100 font-medium">Plateforme Premium</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Bienvenue chez{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                MonFritkot
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-orange-100 leading-relaxed max-w-3xl mx-auto">
              Votre plateforme de référence pour tout ce qui concerne la friterie belge. 
              Découvrez nos services premium, rejoignez notre communauté et développez votre passion.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 px-8 py-4">
                <Link to="/pricing" className="flex items-center">
                  <span className="text-orange-600">Découvrir nos offres</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-white hover:bg-white hover:text-orange-600 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 px-8 py-4">
                <Link to="/initialize-admin">
                  <span className="text-white group-hover:text-orange-600">Initialiser Admin</span>
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">{stat.number}</div>
                  <div className="text-orange-200 text-sm md:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center bg-orange-100 rounded-full px-6 py-3 mb-8">
                <Award className="h-5 w-5 text-orange-600 mr-2" />
                <span className="text-orange-800 font-medium">À propos de nous</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                La référence pour les <span className="text-orange-600">friteries belges</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                MonFritkot.be est né de la passion pour la friterie belge authentique. 
                Notre mission est de créer un pont entre la tradition séculaire de nos 
                friteries et les outils modernes du digital.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Que vous soyez propriétaire d'une friterie ou simplement amateur de bonnes frites, 
                notre plateforme vous offre des services adaptés à vos besoins.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                alt="Friterie traditionnelle belge"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-orange-600 text-white p-6 rounded-2xl shadow-xl">
                <div className="text-3xl font-bold">4+</div>
                <div className="text-orange-200">Années d'expérience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-orange-100 rounded-full px-6 py-3 mb-6 text-center">
              <Star className="h-5 w-5 text-orange-600 mr-2" />
              <span className="text-orange-800 font-medium">Pourquoi nous choisir</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Une expérience <span className="text-orange-600">exceptionnelle</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Nous offrons une expérience complète avec des outils professionnels, 
              une communauté engagée et un support client de qualité.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="text-center mb-6">
                  <div className="text-orange-600 group-hover:scale-110 transition-transform duration-300 inline-block">
                  {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-orange-600 transition-colors text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-orange-100 rounded-full px-6 py-3 mb-6">
              <Zap className="h-5 w-5 text-orange-600 mr-2" />
              <span className="text-orange-800 font-medium">Nos Services</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Des solutions <span className="text-orange-600">adaptées</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez nos services conçus pour répondre aux besoins des professionnels et des amateurs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="h-48 bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                <div className="text-center">
                  <Users className="h-16 w-16 text-white mx-auto mb-4" />
                  <span className="text-white text-xl font-bold">Annuaire</span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Annuaire</h3>
                <p className="text-gray-600 mb-6">
                  Consultez notre annuaire complet des meilleures friteries de Belgique, avec avis, photos et informations pratiques.
                </p>
                <Link to="/directory" className="text-orange-600 font-medium flex items-center hover:text-orange-700">
                  Découvrir l'annuaire
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-center">
                  <Award className="h-16 w-16 text-white mx-auto mb-4" />
                  <span className="text-white text-xl font-bold">Galerie Premium</span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Galerie Premium</h3>
                <p className="text-gray-600 mb-6">
                  Accédez à notre collection d'images professionnelles pour vous inspirer et améliorer votre présentation.
                </p>
                <Link to="/gallery" className="text-orange-600 font-medium flex items-center hover:text-orange-700">
                  Explorer la galerie
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="h-48 bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-16 w-16 text-white mx-auto mb-4" />
                  <span className="text-white text-xl font-bold">Blog Expert</span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Blog Expert</h3>
                <p className="text-gray-600 mb-6">
                  Consultez nos articles rédigés par des experts pour rester à la pointe des tendances et techniques.
                </p>
                <Link to="/blog" className="text-orange-600 font-medium flex items-center hover:text-orange-700">
                  Lire nos articles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-orange-100 rounded-full px-6 py-3 mb-6">
              <Crown className="h-5 w-5 text-orange-600 mr-2" />
              <span className="text-orange-800 font-medium">Nos plans</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choisissez votre <span className="text-orange-600">formule</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des plans adaptés à tous vos besoins, du débutant au professionnel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-200 hover:border-orange-300 transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plans[0].name}</h3>
                <div className="text-4xl font-bold text-orange-600 mb-2">${plans[0].price}</div>
                <div className="text-gray-600">pour toujours</div>
              </div>
              <ul className="space-y-4 mb-8">
                {plans[0].features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-gray-600 hover:bg-gray-700">
                <Link to="/pricing">Commencer gratuitement</Link>
              </Button>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-8 rounded-2xl shadow-2xl transform scale-105 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-full text-sm font-bold flex items-center shadow-lg">
                  <Star className="h-4 w-4 mr-1" />
                  Populaire
                </span>
              </div>
              <div className="text-center mb-8 text-white">
                <h3 className="text-2xl font-bold mb-2">{plans[1].name}</h3>
                <div className="text-4xl font-bold mb-2">${plans[1].price}</div>
                <div className="text-orange-100">/mois</div>
              </div>
              <ul className="space-y-4 mb-8 text-white">
                {plans[1].features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-white text-orange-600 hover:bg-orange-50 font-bold">
                <Link to="/pricing"><span className="text-orange-600">Choisir {plans[1].name}</span></Link>
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-200 hover:border-orange-300 transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plans[2].name}</h3>
                <div className="text-4xl font-bold text-orange-600 mb-2">${plans[2].price}</div>
                <div className="text-gray-600">/mois</div>
              </div>
              <ul className="space-y-4 mb-8">
                {plans[2].features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-gray-900 hover:bg-black">
                <Link to="/pricing"><span className="text-white">Choisir {plans[2].name}</span></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-orange-100 rounded-full px-6 py-3 mb-6">
              <Users className="h-5 w-5 text-orange-600 mr-2" />
              <span className="text-orange-800 font-medium">Témoignages</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ce que disent nos <span className="text-orange-600">clients</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez les témoignages de ceux qui nous font confiance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-orange-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-300 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-orange-300 rounded-full blur-3xl opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Prêt à commencer votre <span className="text-yellow-300">aventure</span> ?
            </h2>
            <p className="text-xl mb-10 text-orange-100 leading-relaxed">
              Rejoignez des milliers d'utilisateurs satisfaits et transformez votre passion pour la 
              friterie en succès professionnel
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-white hover:bg-orange-50 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 px-8 py-4">
                <Link to="/pricing" className="flex items-center">
                  <span className="text-orange-600">Commencer maintenant</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-white hover:bg-white hover:text-orange-600 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 px-8 py-4">
                <Link to="/contact">
                  <span className="text-white group-hover:text-orange-600">Nous contacter</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;