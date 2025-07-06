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
              <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                <Link to="/pricing" className="flex items-center">
                  Découvrir nos offres
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-orange-600 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                <Link to="/initialize-admin">Initialiser Admin</Link>
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

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-orange-100 rounded-full px-6 py-3 mb-6">
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
                <div className="text-orange-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-orange-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
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
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Gratuit</h3>
                <div className="text-4xl font-bold text-orange-600 mb-2">€0</div>
                <div className="text-gray-600">pour toujours</div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Accès limité à la galerie</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Accès au blog</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Accès à l'annuaire</span>
                </li>
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
                <h3 className="text-2xl font-bold mb-2">Standard</h3>
                <div className="text-4xl font-bold mb-2">€9.99</div>
                <div className="text-orange-100">/mois</div>
              </div>
              <ul className="space-y-4 mb-8 text-white">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0" />
                  <span>Téléchargements limités</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0" />
                  <span>Commentaires illimités</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0" />
                  <span>Contenu exclusif</span>
                </li>
              </ul>
              <Button className="w-full bg-white text-orange-600 hover:bg-orange-50 font-bold">
                <Link to="/pricing">Choisir Standard</Link>
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-200 hover:border-orange-300 transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                <div className="text-4xl font-bold text-orange-600 mb-2">€19.99</div>
                <div className="text-gray-600">/mois</div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Accès complet à la galerie</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Support prioritaire</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Accès aux événements</span>
                </li>
              </ul>
              <Button className="w-full bg-gray-900 hover:bg-black">
                <Link to="/pricing">Choisir Pro</Link>
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
              Rejoignez des milliers d'utilisateurs satisfaits et transformez votre passion 
              pour la friterie en succès professionnel
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                <Link to="/pricing" className="flex items-center">
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-orange-600 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                <Link to="/contact">Nous contacter</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;