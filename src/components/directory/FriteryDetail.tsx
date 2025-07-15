import React, { useState } from 'react';
import { MapPin, Phone, Mail, Globe, Star, Clock, Calendar, Heart, Share2, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import FriteryImageUpload from './FriteryImageUpload';
import ReservationButton from '../reservation/ReservationButton';
import CommentSystem from '../comments/CommentSystem';

interface FriteryDetailProps {
  friteryId: string;
  name: string;
  description: string;
  category: string;
  contact: {
    email: string;
    phone: string;
    website?: string;
    address: string;
    city: string;
    postalCode: string;
    region: string;
  };
  logo?: string;
  images: string[];
  verified: boolean;
  premium: boolean;
  rating: number;
  reviewCount: number;
  openingHours: {
    [key: string]: string;
  };
  specialties: string[];
  features: string[];
  priceRange: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  socialMedia?: {
    facebook: string;
    instagram: string;
    other: string;
  };
  mapsUrl?: string;
  onClose: () => void;
}

const FriteryDetail: React.FC<FriteryDetailProps> = ({
  friteryId,
  name,
  description,
  category,
  contact,
  logo,
  images,
  verified,
  premium,
  rating,
  reviewCount,
  openingHours,
  specialties,
  features,
  priceRange,
  coordinates,
  socialMedia,
  mapsUrl,
  onClose
}) => {
  const { currentUser, isSubscribed } = useAuth();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<'info' | 'photos' | 'reviews'>('info');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const canEditFritery = () => {
    return currentUser && (
      currentUser.role === 'admin' || 
      currentUser.role === 'editor' ||
      (premium && isSubscribed('premium'))
    );
  };

  const handleImageUploadSuccess = (imageUrl: string) => {
    addNotification({
      type: 'success',
      title: 'Image ajoutée',
      message: 'L\'image a été ajoutée avec succès à la friterie.',
      category: 'content',
      priority: 'low'
    });
    setShowImageUpload(false);
  };

  const getDayOfWeek = () => {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return days[new Date().getDay()];
  };

  const getTodayHours = () => {
    const today = getDayOfWeek();
    return openingHours[today] || 'Fermé';
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col">
      {/* Header with image */}
      <div className="relative h-64">
        <img
          src={images[0] || logo || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
        >
          <Trash2 className="h-5 w-5" />
        </button>
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{name}</h1>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {renderStars(rating)}
                  <span className="text-white ml-2">{rating} ({reviewCount} avis)</span>
                </div>
                {premium && (
                  <span className="bg-purple-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                    Premium
                  </span>
                )}
                {verified && (
                  <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                    Vérifié
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                icon={<Heart className="h-4 w-4" />}
              >
                Favoris
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                icon={<Share2 className="h-4 w-4" />}
              >
                Partager
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-6 py-4 font-medium text-sm transition-colors ${
              activeTab === 'info'
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Informations
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-6 py-4 font-medium text-sm transition-colors ${
              activeTab === 'photos'
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Photos ({images.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-4 font-medium text-sm transition-colors ${
              activeTab === 'reviews'
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Avis ({reviewCount})
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">À propos</h2>
              <p className="text-gray-600">{description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 text-orange-500 mr-3" />
                    <span>{contact.address}, {contact.postalCode} {contact.city}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-5 w-5 text-orange-500 mr-3" />
                    <span>{contact.phone}</span>
                  </div>
                  {contact.email && (
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-5 w-5 text-orange-500 mr-3" />
                      <span>{contact.email}</span>
                    </div>
                  )}
                  {contact.website && (
                    <div className="flex items-center text-gray-600">
                      <Globe className="h-5 w-5 text-orange-500 mr-3" />
                      <a href={contact.website} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700">
                        {contact.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Opening Hours */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Horaires d'ouverture</h3>
                <div className="space-y-2">
                  {Object.entries(openingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className={`${day === getDayOfWeek() ? 'font-semibold text-orange-600' : 'text-gray-600'}`}>
                        {day}
                      </span>
                      <span className={`${day === getDayOfWeek() ? 'font-semibold text-orange-600' : 'text-gray-600'}`}>
                        {hours}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center text-orange-800">
                    <Clock className="h-4 w-4 mr-2 text-orange-600" />
                    <span className="font-medium">Aujourd'hui: {getTodayHours()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Specialties & Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Spécialités</h3>
                <div className="flex flex-wrap gap-2">
                  {specialties.map((specialty, index) => (
                    <span key={index} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Caractéristiques</h3>
                <div className="flex flex-wrap gap-2">
                  {features.map((feature, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Map */}
            {coordinates && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Localisation</h3>
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                    <p className="text-gray-600">Carte interactive disponible prochainement</p>
                    {mapsUrl && (
                      <a 
                        href={mapsUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-orange-700 font-medium mt-2 inline-block"
                      >
                        Ouvrir dans Google Maps
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Photos</h2>
              {canEditFritery() && (
                <Button
                  onClick={() => setShowImageUpload(!showImageUpload)}
                  icon={<ImageIcon className="h-4 w-4" />}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                >
                  Ajouter des photos
                </Button>
              )}
            </div>
            
            {showImageUpload && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter une photo</h3>
                <FriteryImageUpload
                  friteryId={friteryId}
                  onSuccess={handleImageUploadSuccess}
                />
              </div>
            )}
            
            {images.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune photo disponible</h3>
                <p className="text-gray-600 mb-6">
                  {canEditFritery() 
                    ? 'Ajoutez des photos pour mettre en valeur cette friterie'
                    : 'Aucune photo n\'a encore été ajoutée pour cette friterie'
                  }
                </p>
                {canEditFritery() && (
                  <Button
                    onClick={() => setShowImageUpload(true)}
                    icon={<ImageIcon className="h-4 w-4" />}
                  >
                    Ajouter la première photo
                  </Button>
                )}
              </div>
            ) : (
              <div>
                {/* Selected Image */}
                {selectedImage && (
                  <div className="mb-6">
                    <div className="relative">
                      <img
                        src={selectedImage}
                        alt={name}
                        className="w-full h-96 object-contain bg-black rounded-lg"
                      />
                      <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Image Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div 
                      key={index} 
                      className="relative aspect-square cursor-pointer"
                      onClick={() => setSelectedImage(image)}
                    >
                      <img
                        src={image}
                        alt={`${name} - Photo ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                        <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Avis et commentaires</h2>
            <CommentSystem
              entityId={friteryId}
              entityType="directory"
              allowReplies={true}
              allowImages={false}
            />
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Aujourd'hui: {getTodayHours()}</span>
          </div>
          
          <div className="flex space-x-3">
            {canEditFritery() && (
              <Button
                variant="outline"
                size="sm"
                icon={<Edit className="h-4 w-4" />}
              >
                Modifier
              </Button>
            )}
            <ReservationButton
              friteryId={friteryId}
              friteryName={name}
              size="sm"
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriteryDetail;