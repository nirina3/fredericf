import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Headphones, Users } from 'lucide-react';
import Button from '../components/ui/Button';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useNotifications } from '../contexts/NotificationContext';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [contactInfo, setContactInfo] = useState({
    email: 'contact@monfritkot.be',
    phone: '+32 2 123 45 67',
    address: 'Rue de la Friterie 123, 1000 Bruxelles',
    hours: 'Lun-Ven: 9h-18h, Sam: 10h-16h, Dim: Fermé'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNotification } = useNotifications();

  // Récupérer les informations de contact depuis Firestore
  React.useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'contact'));
        if (settingsDoc.exists()) {
          const data = settingsDoc.data();
          setContactInfo({
            email: data.email || contactInfo.email,
            phone: data.phone || contactInfo.phone,
            address: data.address || contactInfo.address,
            hours: data.hours || contactInfo.hours
          });
        }
      } catch (error) {
        console.error('Error fetching contact info:', error);
      }
    };
    
    fetchContactInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Enregistrer le message dans Firestore
      await addDoc(collection(db, 'contact_messages'), {
        ...formData,
        createdAt: new Date(),
        status: 'new'
      });
      
      // Notification de succès
      addNotification({
        type: 'success',
        title: 'Message envoyé',
        message: 'Nous vous répondrons dans les plus brefs délais.',
        category: 'system',
        priority: 'medium'
      });
      
      // Réinitialiser le formulaire
      setFormData({ name: '', email: '', subject: '', message: '', type: 'general' });
    } catch (error) {
      console.error('Error sending message:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Une erreur est survenue lors de l\'envoi du message.',
        category: 'system',
        priority: 'high'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfoDisplay = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      details: contactInfo.email,
      description: "Écrivez-nous pour toute question"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Téléphone",
      details: contactInfo.phone,
      description: "Du lundi au vendredi, 9h-18h"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Adresse",
      details: contactInfo.address,
      description: "Belgique"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Horaires",
      details: contactInfo.hours.split(',')[0],
      description: contactInfo.hours.split(',').slice(1).join(',')
    }
  ];

  const supportOptions = [
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Chat en Direct",
      description: "Obtenez une réponse immédiate via notre chat",
      action: "Démarrer le chat",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: "Support Téléphonique",
      description: "Appelez-nous pour un support personnalisé",
      action: "Nous appeler",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Communauté",
      description: "Posez vos questions à la communauté",
      action: "Rejoindre",
      color: "from-purple-500 to-purple-600"
    }
  ];

  const faq = [
    {
      question: "Comment puis-je m'abonner ?",
      answer: "Vous pouvez vous abonner directement sur notre page de tarification. Choisissez le plan qui vous convient et suivez les étapes d'inscription."
    },
    {
      question: "Puis-je changer de plan à tout moment ?",
      answer: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment depuis votre espace client. Les changements prennent effet immédiatement."
    },
    {
      question: "Y a-t-il une période d'essai ?",
      answer: "Oui, nous offrons une période d'essai gratuite de 7 jours sur tous nos plans premium pour que vous puissiez tester nos services."
    },
    {
      question: "Comment puis-je annuler mon abonnement ?",
      answer: "Vous pouvez annuler votre abonnement à tout moment depuis votre espace client. L'accès restera actif jusqu'à la fin de la période payée."
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
              <MessageCircle className="h-5 w-5 text-yellow-300 mr-2" />
              <span className="text-yellow-100 font-medium">Contactez-nous</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-8">
              Parlons de votre <span className="text-yellow-300">projet</span>
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 leading-relaxed">
              Notre équipe est là pour répondre à toutes vos questions 
              et vous accompagner dans votre démarche
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {contactInfoDisplay.map((info, index) => (
              <div key={index} className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-4 rounded-2xl mb-4 mx-auto w-fit">
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{info.title}</h3>
                <p className="text-orange-600 font-semibold mb-2">{info.details}</p>
                <p className="text-gray-600 text-sm">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Support Options */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <div className="inline-flex items-center bg-orange-100 rounded-full px-6 py-3 mb-6">
                  <Send className="h-5 w-5 text-orange-600 mr-2" />
                  <span className="text-orange-800 font-medium">Envoyez-nous un message</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Contactez notre <span className="text-orange-600">équipe</span>
                </h2>
                <p className="text-lg text-gray-600">
                  Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Type de demande
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  >
                    <option value="general">Question générale</option>
                    <option value="support">Support technique</option>
                    <option value="billing">Facturation</option>
                    <option value="partnership">Partenariat</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Sujet de votre message"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                    placeholder="Décrivez votre demande en détail..."
                  />
                </div>

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-4 text-lg font-semibold"
                  icon={isSubmitting ? undefined : <Send className="h-5 w-5" />}
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                </Button>
              </form>
            </div>

            {/* Support Options */}
            <div>
              <div className="mb-8">
                <div className="inline-flex items-center bg-orange-100 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6">
                  <Headphones className="h-5 w-5 text-orange-600 mr-2" />
                  <span className="text-orange-800 font-medium">Autres options</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Besoin d'aide <span className="text-orange-600">immédiate</span> ?
                </h2>
                <p className="text-lg text-gray-600">
                  Choisissez l'option qui vous convient le mieux pour obtenir de l'aide rapidement.
                </p>
              </div>

              <div className="space-y-6 mb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3 gap-4">
                  {supportOptions.map((option, index) => (
                    <div key={index} className="bg-white border-2 border-gray-200 rounded-2xl p-4 sm:p-6 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className={`bg-gradient-to-r ${option.color} text-white p-2 sm:p-3 rounded-xl flex-shrink-0`}>
                        <div className={`bg-gradient-to-r ${option.color} text-white p-2 sm:p-3 rounded-xl flex-shrink-0`}>
                          {option.icon}
                        </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{option.title}</h3>
                          <p className="text-gray-600 mb-4 text-sm sm:text-base">{option.description}</p>
                          <button className="text-orange-600 font-semibold hover:text-orange-700 transition-colors text-sm sm:text-base">
                            {option.action} →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Section */}
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Questions fréquentes</h3>
                <div className="space-y-3 sm:space-y-4">
                  {faq.map((item, index) => (
                    <details key={index} className="bg-gray-50 rounded-lg p-3 sm:p-4 hover:bg-gray-100 transition-colors">
                      <summary className="font-semibold text-gray-900 cursor-pointer hover:text-orange-600 transition-colors text-sm sm:text-base">
                        {item.question}
                      </summary>
                      <p className="mt-3 text-gray-600 leading-relaxed text-sm sm:text-base">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Venez nous <span className="text-orange-600">rencontrer</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Notre bureau est situé au cœur de Bruxelles
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 flex items-center justify-center h-64 sm:h-80">
              <div className="text-center">
                <MapPin className="h-12 w-12 sm:h-16 sm:w-16 text-orange-600 mx-auto mb-4" />
                <p className="text-gray-600">Carte interactive disponible prochainement</p>
                <p className="text-sm text-gray-500 mt-2">{contactInfo.address}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;