import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, MapPin, Phone, Mail, Globe, Star, Search, Filter, Verified, Upload, FileText } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import CSVImportModal from '../../components/directory/CSVImportModal';

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
}

const DirectoryManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState<DirectoryEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<DirectoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showImportModal, setShowImportModal] = useState(false);

  // Mock data
  const mockEntries: DirectoryEntry[] = [
    {
      id: '1',
      name: 'Friterie Chez Marcel',
      description: 'Friterie familiale traditionnelle depuis 1952.',
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
      logo: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200',
      verified: true,
      premium: true,
      images: [
        'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
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
      lastUpdated: new Date('2024-02-20'),
      coordinates: {
        latitude: 50.6327095,
        longitude: 4.652785778
      },
      socialMedia: {
        facebook: 'https://facebook.com/chezmarcel',
        instagram: 'https://instagram.com/chezmarcel',
        other: ''
      },
      mapsUrl: 'https://maps.google.com/?q=50.6327095,4.652785778'
    },
    {
      id: '2',
      name: 'La Baraque à Frites',
      description: 'Friterie moderne avec un concept innovant.',
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
      verified: true,
      premium: false,
      images: [
        'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/4253312/pexels-photo-4253312.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
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
      lastUpdated: new Date('2024-02-18'),
      coordinates: {
        latitude: 51.0543422,
        longitude: 3.7174243
      },
      socialMedia: {
        facebook: 'https://facebook.com/labaraque',
        instagram: 'https://instagram.com/labaraque',
        other: ''
      },
      mapsUrl: 'https://maps.google.com/?q=51.0543422,3.7174243'
    },
    {
      id: '3',
      name: 'Friterie du Coin',
      description: 'Petite friterie de quartier conviviale.',
      category: 'Friterie de Quartier',
      contact: {
        email: 'friterie.ducoin@gmail.com',
        phone: '+32 4 567 89 01',
        address: 'Place du Marché 8',
        city: 'Liège',
        postalCode: '4000',
        region: 'Liège'
      },
      verified: false,
      premium: false,
      images: [
        'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
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
      lastUpdated: new Date('2024-01-15'),
      coordinates: {
        latitude: 50.6412,
        longitude: 5.5718
      },
      socialMedia: {
        facebook: '',
        instagram: '',
        other: ''
      },
      mapsUrl: 'https://maps.google.com/?q=50.6412,5.5718'
    }
  ];

  const categories = [
    { id: 'all', name: 'Toutes les catégories' },
    { id: 'Friterie Traditionnelle', name: 'Traditionnelle' },
    { id: 'Friterie Moderne', name: 'Moderne' },
    { id: 'Friterie de Quartier', name: 'De Quartier' },
    { id: 'Friterie Premium', name: 'Premium' },
    { id: 'Food Truck', name: 'Food Truck' }
  ];

  useEffect(() => {
    setTimeout(() => {
      setEntries(mockEntries);
      setFilteredEntries(mockEntries);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterEntries();
  }, [entries, searchTerm, categoryFilter, statusFilter]);

  const filterEntries = () => {
    let filtered = entries;

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(entry => entry.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'verified') {
        filtered = filtered.filter(entry => entry.verified);
      } else if (statusFilter === 'premium') {
        filtered = filtered.filter(entry => entry.premium);
      } else if (statusFilter === 'pending') {
        filtered = filtered.filter(entry => !entry.verified);
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.contact.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEntries(filtered);
  };

  const handleImportEntries = (newEntries: DirectoryEntry[]) => {
    // Dans une application réelle, vous enverriez ces données à votre backend
    // Pour cette démo, nous les ajoutons simplement à l'état local
    setEntries(prev => [...prev, ...newEntries]);
    setFilteredEntries(prev => [...prev, ...newEntries]);
  };

  const toggleVerification = (entryId: string) => {
    setEntries(prev => prev.map(entry =>
      entry.id === entryId ? { ...entry, verified: !entry.verified } : entry
    ));
  };

  const togglePremium = (entryId: string) => {
    setEntries(prev => prev.map(entry =>
      entry.id === entryId ? { ...entry, premium: !entry.premium } : entry
    ));
  };

  const deleteEntry = (entryId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) return;
    setEntries(prev => prev.filter(entry => entry.id !== entryId));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const canManageDirectory = () => {
    return currentUser && (currentUser.role === 'admin' || currentUser.role === 'editor');
  };

  if (!canManageDirectory()) {
    return (
      <div className="text-center py-12">
        <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
        <p className="text-gray-600">Seuls les administrateurs et éditeurs peuvent gérer l'annuaire.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion de l'annuaire</h1>
            <p className="text-gray-600 mt-2">
              {entries.length} friterie{entries.length > 1 ? 's' : ''} dans l'annuaire
            </p>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={() => setShowImportModal(true)}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              icon={<FileText className="h-4 w-4" />}
            >
              Importer CSV
            </Button>
            <Button
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
              icon={<Plus className="h-4 w-4" />}
            >
              Ajouter une friterie
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une friterie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="verified">Vérifiées</option>
              <option value="premium">Premium</option>
              <option value="pending">En attente</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            {filteredEntries.length} résultat{filteredEntries.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Entries List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <span className="ml-2 text-gray-600">Chargement...</span>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune friterie trouvée</h3>
            <p className="text-gray-600 mb-6">
              {entries.length === 0 
                ? 'Commencez par ajouter des friteries à l\'annuaire'
                : 'Aucune friterie ne correspond à vos critères'
              }
            </p>
            <Button icon={<Plus className="h-4 w-4" />}>
              Ajouter une friterie
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    {entry.logo ? (
                      <img
                        src={entry.logo}
                        alt={entry.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <MapPin className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{entry.name}</h3>
                          <div className="flex items-center space-x-2">
                            {entry.verified && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                                <Verified className="h-3 w-3 mr-1" />
                                Vérifié
                              </span>
                            )}
                            {entry.premium && (
                              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                                Premium
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-600 mb-3">{entry.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center text-gray-600">
                              <MapPin className="h-4 w-4 mr-2" />
                              {entry.contact.address}, {entry.contact.city}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Phone className="h-4 w-4 mr-2" />
                              {entry.contact.phone}
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center text-gray-600">
                              <Mail className="h-4 w-4 mr-2" />
                              {entry.contact.email}
                            </div>
                            {entry.contact.website && (
                              <div className="flex items-center text-gray-600">
                                <Globe className="h-4 w-4 mr-2" />
                                <a href={entry.contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                  Site web
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              {renderStars(entry.rating)}
                              <span className="text-sm text-gray-600 ml-1">
                                {entry.rating} ({entry.reviewCount} avis)
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">{entry.category}</span>
                          </div>

                          <div className="text-sm text-gray-500">
                            Mis à jour le {entry.lastUpdated.toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleVerification(entry.id)}
                          className={entry.verified ? 'text-green-600' : 'text-gray-600'}
                          title={entry.verified ? 'Retirer la vérification' : 'Vérifier'}
                        >
                          <Verified className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePremium(entry.id)}
                          className={entry.premium ? 'text-purple-600' : 'text-gray-600'}
                          title={entry.premium ? 'Retirer le premium' : 'Marquer premium'}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Eye className="h-4 w-4" />}
                          title="Voir les détails"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Edit className="h-4 w-4" />}
                          title="Modifier"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteEntry(entry.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          icon={<Trash2 className="h-4 w-4" />}
                          title="Supprimer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Import Modal */}
      <CSVImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportEntries}
        existingEntries={entries}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <Verified className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {entries.filter(e => e.verified).length}
              </div>
              <div className="text-sm text-gray-600">Vérifiées</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {entries.filter(e => e.premium).length}
              </div>
              <div className="text-sm text-gray-600">Premium</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg mr-4">
              <MapPin className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {entries.filter(e => !e.verified).length}
              </div>
              <div className="text-sm text-gray-600">En attente</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {entries.reduce((sum, entry) => sum + entry.reviewCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Avis totaux</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectoryManagement;