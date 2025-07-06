import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Phone, Mail, Globe, Star, Filter, Grid, List, Clock, Award, Verified } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ReservationButton from '../components/reservation/ReservationButton';

interface DirectoryEntry {
  id: string;
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
  createdAt: Date;
  lastUpdated: Date;
}

const Directory: React.FC = () => {
  const [entries, setEntries] = useState<DirectoryEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<DirectoryEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const { currentUser, isSubscribed } = useAuth();

  // Mock data - Friteries représentatives
  const mockEntries: DirectoryEntry[] = [
    {
      id: '1',
      name: 'Friterie Chez Marcel',
      description: 'Friterie familiale traditionnelle depuis 1952. Spécialiste des frites belges authentiques et des sauces maison.',
      category: 'Friterie Traditionnelle',
      contact: {
        email: 'contact@chezmarcel.be',
        phone: '+32 2 123 45 67',
        website: 'https://chezmarcel.be',
        address: 'Rue de la Frite 15',
        city: 'Bruxelles',
        postalCode: '1000',
        region: 'Bruxelles-Capitale'
      },
      logo: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
      images: [
        'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      verified: true,
      premium: true,
      rating: 4.8,
      reviewCount: 127,
      openingHours: {
        'Lundi': '11:30 - 14:00, 17:30 - 22:00',
        'Mardi': '11:30 - 14:00, 17:30 - 22:00',
        'Mercredi': '11:30 - 14:00, 17:30 - 22:00',
        'Jeudi': '11:30 - 14:00, 17:30 - 22:00',
        'Vendredi': '11:30 - 14:00, 17:30 - 23:00',
        'Samedi': '11:30 - 23:00',
        'Dimanche': '17:30 - 22:00'
      },
      specialties: ['Frites belges', 'Sauces maison', 'Boulettes', 'Fricadelles'],
      features: ['Terrasse', 'Livraison', 'Paiement carte', 'WiFi'],
      priceRange: '€€',
      createdAt: new Date('2023-01-15'),
      lastUpdated: new Date('2024-02-20')
    },
    {
      id: '2',
      name: 'La Baraque à Frites',
      description: 'Friterie moderne avec un concept innovant. Produits bio et locaux, ambiance contemporaine.',
      category: 'Friterie Moderne',
      contact: {
        email: 'info@labaraque.be',
        phone: '+32 9 876 54 32',
        website: 'https://labaraque.be',
        address: 'Avenue des Saveurs 42',
        city: 'Gand',
        postalCode: '9000',
        region: 'Flandre-Orientale'
      },
      logo: 'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
      images: [
        'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/4253312/pexels-photo-4253312.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      verified: true,
      premium: false,
      rating: 4.6,
      reviewCount: 89,
      openingHours: {
        'Lundi': 'Fermé',
        'Mardi': '12:00 - 14:30, 18:00 - 22:30',
        'Mercredi': '12:00 - 14:30, 18:00 - 22:30',
        'Jeudi': '12:00 - 14:30, 18:00 - 22:30',
        'Vendredi': '12:00 - 14:30, 18:00 - 23:00',
        'Samedi': '12:00 - 23:00',
        'Dimanche': '18:00 - 22:00'
      },
      specialties: ['Frites bio', 'Burgers artisanaux', 'Salades', 'Smoothies'],
      features: ['Bio', 'Végétarien', 'Terrasse', 'Parking'],
      priceRange: '€€€',
      createdAt: new Date('2023-03-10'),
      lastUpdated: new Date('2024-02-18')
    },
    {
      id: '3',
      name: 'Friterie du Coin',
      description: 'Petite friterie de quartier conviviale. Ambiance familiale et prix abordables.',
      category: 'Friterie de Quartier',
      contact: {
        email: 'friterie.ducoin@gmail.com',
        phone: '+32 4 567 89 01',
        address: 'Place du Marché 8',
        city: 'Liège',
        postalCode: '4000',
        region: 'Liège'
      },
      logo: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
      images: [
        'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      verified: false,
      premium: false,
      rating: 4.3,
      reviewCount: 45,
      openingHours: {
        'Lundi': '11:00 - 14:00, 17:00 - 21:00',
        'Mardi': '11:00 - 14:00, 17:00 - 21:00',
        'Mercredi': '11:00 - 14:00, 17:00 - 21:00',
        'Jeudi': '11:00 - 14:00, 17:00 - 21:00',
        'Vendredi': '11:00 - 14:00, 17:00 - 22:00',
        'Samedi': '11:00 - 22:00',
        'Dimanche': 'Fermé'
      },
      specialties: ['Frites classiques', 'Mitraillette', 'Snacks'],
      features: ['Prix abordables', 'Ambiance familiale'],
      priceRange: '€',
      createdAt: new Date('2023-06-20'),
      lastUpdated: new Date('2024-01-15')
    },
    {
      id: '4',
      name: 'Golden Fries',
      description: 'Friterie haut de gamme avec service premium. Spécialités gastronomiques et produits d\'exception.',
      category: 'Friterie Premium',
      contact: {
        email: 'contact@goldenfries.be',
        phone: '+32 2 345 67 89',
        website: 'https://goldenfries.be',
        address: 'Boulevard Royal 123',
        city: 'Namur',
        postalCode: '5000',
        region: 'Namur'
      },
      logo: 'https://images.pexels.com/photos/4253302/pexels-photo-4253302.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
      images: [
        'https://images.pexels.com/photos/4253302/pexels-photo-4253302.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      verified: true,
      premium: true,
      rating: 4.9,
      reviewCount: 203,
      openingHours: {
        'Lundi': 'Fermé',
        'Mardi': '12:00 - 15:00, 19:00 - 23:00',
        'Mercredi': '12:00 - 15:00, 19:00 - 23:00',
        'Jeudi': '12:00 - 15:00, 19:00 - 23:00',
        'Vendredi': '12:00 - 15:00, 19:00 - 24:00',
        'Samedi': '12:00 - 24:00',
        'Dimanche': '19:00 - 23:00'
      },
      specialties: ['Frites truffe', 'Homard frites', 'Caviar', 'Champagne'],
      features: ['Service premium', 'Réservation', 'Valet parking', 'Terrasse VIP'],
      priceRange: '€€€€',
      createdAt: new Date('2023-02-28'),
      lastUpdated: new Date('2024-02-22')
    },
    {
      id: '5',
      name: 'Friterie Mobile Max',
      description: 'Food truck spécialisé dans les frites belges. Présent sur les marchés et événements.',
      category: 'Food Truck',
      contact: {
        email: 'max@friteriemax.be',
        phone: '+32 6 789 01 23',
        website: 'https://friteriemax.be',
        address: 'Itinérant',
        city: 'Région de Charleroi',
        postalCode: '6000',
        region: 'Hainaut'
      },
      logo: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
      images: [
        'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      verified: true,
      premium: false,
      rating: 4.4,
      reviewCount: 67,
      openingHours: {
        'Lundi': 'Variable selon événements',
        'Mardi': 'Variable selon événements',
        'Mercredi': 'Variable selon événements',
        'Jeudi': 'Variable selon événements',
        'Vendredi': 'Variable selon événements',
        'Samedi': 'Variable selon événements',
        'Dimanche': 'Variable selon événements'
      },
      specialties: ['Frites fraîches', 'Service rapide', 'Événements'],
      features: ['Mobile', 'Événements', 'Marchés', 'Festivals'],
      priceRange: '€€',
      createdAt: new Date('2023-05-15'),
      lastUpdated: new Date('2024-02-10')
    },
    {
      id: '6',
      name: 'Friterie Artisanale',
      description: 'Friterie artisanale avec production locale. Pommes de terre cultivées sur place.',
      category: 'Friterie Artisanale',
      contact: {
        email: 'info@friterie-artisanale.be',
        phone: '+32 8 234 56 78',
        address: 'Chemin des Champs 56',
        city: 'Bastogne',
        postalCode: '6600',
        region: 'Luxembourg'
      },
      logo: 'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
      images: [
        'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      verified: true,
      premium: false,
      rating: 4.7,
      reviewCount: 34,
      openingHours: {
        'Lundi': 'Fermé',
        'Mardi': 'Fermé',
        'Mercredi': '16:00 - 20:00',
        'Jeudi': '16:00 - 20:00',
        'Vendredi': '16:00 - 21:00',
        'Samedi': '12:00 - 21:00',
        'Dimanche': '12:00 - 20:00'
      },
      specialties: ['Pommes de terre locales', 'Production artisanale', 'Sauces maison'],
      features: ['Local', 'Artisanal', 'Écologique', 'Visite ferme'],
      priceRange: '€€',
      createdAt: new Date('2023-04-05'),
      lastUpdated: new Date('2024-01-28')
    }
  ];

  const categories = [
    { id: 'all', name: 'Toutes les catégories', count: mockEntries.length },
    { id: 'Friterie Traditionnelle', name: 'Traditionnelle', count: mockEntries.filter(e => e.category === 'Friterie Traditionnelle').length },
    { id: 'Friterie Moderne', name: 'Moderne', count: mockEntries.filter(e => e.category === 'Friterie Moderne').length },
    { id: 'Friterie de Quartier', name: 'De Quartier', count: mockEntries.filter(e => e.category === 'Friterie de Quartier').length },
    { id: 'Friterie Premium', name: 'Premium', count: mockEntries.filter(e => e.category === 'Friterie Premium').length },
    { id: 'Food Truck', name: 'Food Truck', count: mockEntries.filter(e => e.category === 'Food Truck').length },
    { id: 'Friterie Artisanale', name: 'Artisanale', count: mockEntries.filter(e => e.category === 'Friterie Artisanale').length }
  ];

  const regions = [
    { id: 'all', name: 'Toutes les régions' },
    { id: 'Bruxelles-Capitale', name: 'Bruxelles-Capitale' },
    { id: 'Flandre-Orientale', name: 'Flandre-Orientale' },
    { id: 'Liège', name: 'Liège' },
    { id: 'Namur', name: 'Namur' },
    { id: 'Hainaut', name: 'Hainaut' },
    { id: 'Luxembourg', name: 'Luxembourg' }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setEntries(mockEntries);
      setFilteredEntries(mockEntries);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = entries;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(entry => entry.category === selectedCategory);
    }

    // Filter by region
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(entry => entry.contact.region === selectedRegion);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.contact.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviewCount - a.reviewCount;
        case 'recent':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        default:
          return 0;
      }
    });

    setFilteredEntries(filtered);
  }, [entries, selectedCategory, selectedRegion, searchTerm, sortBy]);

  const canAccessDetails = (entry: DirectoryEntry) => {
    if (entry.premium && !isSubscribed('premium')) {
      return false;
    }
    return true;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'annuaire...</p>
        </div>
      </div>
    );
  }

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
              <MapPin className="h-5 w-5 text-yellow-300 mr-2" />
              <span className="text-yellow-100 font-medium">Annuaire MonFritkot</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-8">
              Annuaire des <span className="text-yellow-300">Friteries</span>
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 leading-relaxed">
              Découvrez les meilleures friteries de Belgique, 
              leurs spécialités et toutes les informations pratiques
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une friterie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              >
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              >
                <option value="name">Nom A-Z</option>
                <option value="rating">Mieux notées</option>
                <option value="reviews">Plus d'avis</option>
                <option value="recent">Récemment mises à jour</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="mt-6 flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 shadow-sm'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            {filteredEntries.length} friterie{filteredEntries.length > 1 ? 's' : ''} trouvée{filteredEntries.length > 1 ? 's' : ''}
          </div>
        </div>
      </section>

      {/* Directory Listings */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-16">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune friterie trouvée</h3>
              <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
              : 'space-y-6'
            }>
              {filteredEntries.map((entry) => (
                <div key={entry.id} className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ${
                  viewMode === 'list' ? 'flex' : ''
                }`}>
                  {/* Image */}
                  <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'h-48'}`}>
                    <img
                      src={entry.images[0]}
                      alt={entry.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col space-y-2">
                      {entry.verified && (
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                          <Verified className="h-3 w-3 mr-1" />
                          Vérifié
                        </span>
                      )}
                      {entry.premium && (
                        <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                          <Award className="h-3 w-3 mr-1" />
                          Premium
                        </span>
                      )}
                    </div>

                    {/* Price Range */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {entry.priceRange}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{entry.name}</h3>
                      <div className="flex items-center space-x-1 ml-2">
                        {renderStars(entry.rating)}
                        <span className="text-sm text-gray-600 ml-1">({entry.reviewCount})</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{entry.description}</p>
                    
                    {/* Location */}
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{entry.contact.city}, {entry.contact.region}</span>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {entry.specialties.slice(0, 3).map((specialty, index) => (
                        <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-xs font-medium">
                          {specialty}
                        </span>
                      ))}
                      {entry.specialties.length > 3 && (
                        <span className="text-xs text-gray-500">+{entry.specialties.length - 3} autres</span>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{entry.contact.phone}</span>
                      </div>
                      {entry.contact.website && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Globe className="h-4 w-4 mr-2" />
                          <a href={entry.contact.website} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700">
                            Site web
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Opening Hours Today */}
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Aujourd'hui: {entry.openingHours[Object.keys(entry.openingHours)[0]]}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                          Voir détails
                        </button>
                        {canAccessDetails(entry) && (
                        <ReservationButton
                          friteryId={entry.id}
                          friteryName={entry.name}
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                        />
                        )}
                      </div>
                      
                      {!canAccessDetails(entry) && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          Premium requis
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Votre friterie n'est pas <span className="text-yellow-300">listée</span> ?
          </h2>
          <p className="text-xl mb-10 text-orange-100 max-w-2xl mx-auto">
            Rejoignez notre annuaire et augmentez votre visibilité auprès de milliers de clients potentiels
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/signup" className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold hover:bg-orange-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Ajouter ma friterie
            </Link>
            <Link to="/contact" className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              En savoir plus
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Directory;