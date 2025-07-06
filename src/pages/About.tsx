import React from 'react';
import { Crown, Users, Award, Target, Heart, Zap } from 'lucide-react';

const About: React.FC = () => {
  const values = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Passion",
      description: "Notre amour pour la friterie belge authentique guide chacune de nos actions"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Excellence",
      description: "Nous visons l'excellence dans tous nos services et contenus"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Communauté",
      description: "Nous créons des liens durables entre les passionnés de friterie"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Innovation",
      description: "Nous modernisons la tradition avec les dernières technologies"
    }
  ];

  const team = [
    {
      name: "Jean-Baptiste Dumont",
      role: "Fondateur & CEO",
      description: "Passionné de friterie depuis 20 ans, Jean-Baptiste a créé MonFritkot pour partager sa passion.",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
    },
    {
      name: "Marie-Claire Vandenberghe",
      role: "Directrice Technique",
      description: "Experte en développement web, Marie-Claire assure la qualité technique de notre plateforme.",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
    },
    {
      name: "Pierre Delacroix",
      role: "Chef de Communauté",
      description: "Pierre anime notre communauté et veille à ce que chaque membre se sente chez lui.",
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
    }
  ];

  const milestones = [
    { year: "2020", title: "Création", description: "Lancement de MonFritkot.be" },
    { year: "2021", title: "Expansion", description: "500+ membres actifs" },
    { year: "2022", title: "Partenariats", description: "50+ friteries partenaires" },
    { year: "2023", title: "Innovation", description: "Lancement des services premium" },
    { year: "2024", title: "Croissance", description: "1000+ utilisateurs satisfaits" }
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
              <Crown className="h-5 w-5 text-yellow-300 mr-2" />
              <span className="text-yellow-100 font-medium">Notre Histoire</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-8">
              À propos de <span className="text-yellow-300">MonFritkot</span>
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 leading-relaxed">
              Découvrez l'histoire de la plateforme qui révolutionne 
              l'univers de la friterie belge depuis 2020
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center bg-orange-100 rounded-full px-6 py-3 mb-8">
                <Target className="h-5 w-5 text-orange-600 mr-2" />
                <span className="text-orange-800 font-medium">Notre Mission</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Préserver et moderniser la <span className="text-orange-600">tradition belge</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                MonFritkot.be est né de la passion pour la friterie belge authentique. 
                Notre mission est de créer un pont entre la tradition séculaire de nos 
                friteries et les outils modernes du digital.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Nous croyons que chaque friterie a une histoire unique à raconter, 
                et nous mettons tout en œuvre pour aider nos membres à partager leur 
                passion et développer leur activité.
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

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-orange-100 rounded-full px-6 py-3 mb-8">
              <Heart className="h-5 w-5 text-orange-600 mr-2" />
              <span className="text-orange-800 font-medium">Nos Valeurs</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ce qui nous <span className="text-orange-600">guide</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nos valeurs fondamentales qui orientent chaque décision et chaque action
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-6 rounded-2xl mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-orange-100 rounded-full px-6 py-3 mb-8">
              <Award className="h-5 w-5 text-orange-600 mr-2" />
              <span className="text-orange-800 font-medium">Notre Parcours</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Une croissance <span className="text-orange-600">constante</span>
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-orange-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <div className="text-2xl font-bold text-orange-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-orange-600 rounded-full border-4 border-white shadow-lg">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-orange-100 rounded-full px-6 py-3 mb-8">
              <Users className="h-5 w-5 text-orange-600 mr-2" />
              <span className="text-orange-800 font-medium">Notre Équipe</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Rencontrez notre <span className="text-orange-600">équipe</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des passionnés dévoués qui travaillent chaque jour pour vous offrir la meilleure expérience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-48 h-48 rounded-full mx-auto object-cover shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-600/20 to-transparent rounded-full group-hover:from-orange-600/40 transition-all duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <div className="text-orange-600 font-medium mb-4">{member.role}</div>
                <p className="text-gray-600 leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Rejoignez notre <span className="text-yellow-300">aventure</span>
          </h2>
          <p className="text-xl mb-10 text-orange-100 max-w-2xl mx-auto">
            Découvrez comment MonFritkot peut transformer votre passion en succès
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold hover:bg-orange-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Découvrir nos services
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Nous contacter
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;