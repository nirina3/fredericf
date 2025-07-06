import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Eye, Heart, Download, Star, Crown, Image as ImageIcon, Plus, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ImageUploadModal from '../components/gallery/ImageUploadModal';
import ImageCard from '../components/gallery/ImageCard';
import Button from '../components/ui/Button';
import storageService, { ImageMetadata } from '../services/storage';

const Gallery: React.FC = () => {
  const [items, setItems] = useState<ImageMetadata[]>([]);
  const [filteredItems, setFilteredItems] = useState<ImageMetadata[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { currentUser, isSubscribed } = useAuth();

  // Mock data - quelques images représentatives
  const mockItems: GalleryItem[] = [
    {
      id: '1',
      title: 'Friterie Traditionnelle Belge',
      description: 'Une authentique friterie belge avec son charme traditionnel',
      url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
      thumbnail: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'friteries',
      tags: ['traditionnel', 'belge', 'authentique'],
      uploadedAt: new Date('2024-01-15'),
      uploadedBy: 'Admin',
      requiredPlan: 'basic',
      likes: 45,
      downloads: 23,
      featured: true
    },
    {
      id: '2',
      title: 'Frites Dorées Parfaites',
      description: 'Des frites belges dorées à la perfection',
      url: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=800',
      thumbnail: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'produits',
      tags: ['frites', 'dorées', 'qualité'],
      uploadedAt: new Date('2024-01-20'),
      uploadedBy: 'Chef Marie',
      requiredPlan: 'basic',
      likes: 67,
      downloads: 34,
      featured: false
    },
    {
      id: '3',
      title: 'Équipement Professionnel',
      description: 'Friteuse professionnelle de haute qualité',
      url: 'https://images.pexels.com/photos/4253312/pexels-photo-4253312.jpeg?auto=compress&cs=tinysrgb&w=800',
      thumbnail: 'https://images.pexels.com/photos/4253312/pexels-photo-4253312.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'equipement',
      tags: ['friteuse', 'professionnel', 'équipement'],
      uploadedAt: new Date('2024-02-01'),
      uploadedBy: 'Tech Expert',
      requiredPlan: 'premium',
      likes: 32,
      downloads: 18,
      featured: true
    },
    {
      id: '4',
      title: 'Ambiance Conviviale',
      description: 'L\'atmosphère chaleureuse d\'une friterie familiale',
      url: 'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=800',
      thumbnail: 'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'ambiance',
      tags: ['convivial', 'familial', 'atmosphère'],
      uploadedAt: new Date('2024-02-10'),
      uploadedBy: 'Photo Pro',
      requiredPlan: 'premium',
      likes: 89,
      downloads: 45,
      featured: false
    },
    {
      id: '5',
      title: 'Formation Professionnelle',
      description: 'Session de formation pour futurs fritiers',
      url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
      thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'formation',
      tags: ['formation', 'apprentissage', 'professionnel'],
      uploadedAt: new Date('2024-02-15'),
      uploadedBy: 'Formateur',
      requiredPlan: 'pro',
      likes: 56,
      downloads: 28,
      featured: true
    },
    {
      id: '6',
      title: 'Innovation Culinaire',
      description: 'Nouvelles techniques de préparation moderne',
      url: 'https://images.pexels.com/photos/4253302/pexels-photo-4253302.jpeg?auto=compress&cs=tinysrgb&w=800',
      thumbnail: 'https://images.pexels.com/photos/4253302/pexels-photo-4253302.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'innovation',
      tags: ['innovation', 'moderne', 'technique'],
      uploadedAt: new Date('2024-02-20'),
      uploadedBy: 'Chef Innovation',
      requiredPlan: 'pro',
      likes: 73,
      downloads: 41,
      featured: false
    }
  ];

  const categories = [
    { id: 'all', name: 'Toutes les catégories', count: mockItems.length },
    { id: 'friteries', name: 'Friteries', count: mockItems.filter(item => item.category === 'friteries').length },
    { id: 'produits', name: 'Produits', count: mockItems.filter(item => item.category === 'produits').length },
    { id: 'equipement', name: 'Équipement', count: mockItems.filter(item => item.category === 'equipement').length },
    { id: 'ambiance', name: 'Ambiance', count: mockItems.filter(item => item.category === 'ambiance').length },
    { id: 'formation', name: 'Formation', count: mockItems.filter(item => item.category === 'formation').length },
    { id: 'innovation', name: 'Innovation', count: mockItems.filter(item => item.category === 'innovation').length }
  ];

  useEffect(() => {
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    try {
      setLoading(true);
      const images = await storageService.getGalleryImages();
      setItems(images);
      setFilteredItems(images);
    } catch (error) {
      console.error('Error loading gallery images:', error);
      // Fallback to mock data if service fails
      setItems(mockItems);
      setFilteredItems(mockItems);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = items;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredItems(filtered);
  }, [items, selectedCategory, searchTerm]);

  const canAccessItem = (item: ImageMetadata) => {
    if (!currentUser) return item.requiredPlan === 'basic';
    return isSubscribed(item.requiredPlan);
  };

  const handleUploadSuccess = (newImages: ImageMetadata[]) => {
    setItems(prev => [...newImages, ...prev]);
    setFilteredItems(prev => [...newImages, ...prev]);
  };

  const handleLike = (itemId: string) => {
    setItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, likes: item.likes + 1 } : item
    ));
    setFilteredItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, likes: item.likes + 1 } : item
    ));
  };

  const handleDownload = (itemId: string) => {
    setItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, downloads: item.downloads + 1 } : item
    ));
    setFilteredItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, downloads: item.downloads + 1 } : item
    ));
  };

  const handleEdit = (image: ImageMetadata) => {
    // TODO: Implement edit functionality
    console.log('Edit image:', image);
  };

  const handleDelete = async (imageId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      try {
        await storageService.deleteImage(imageId);
        setItems(prev => prev.filter(item => item.id !== imageId));
        setFilteredItems(prev => prev.filter(item => item.id !== imageId));
      } catch (error) {
        console.error('Error deleting image:', error);
        alert('Erreur lors de la suppression de l\'image');
      }
    }
  };

  const canUpload = () => {
    return currentUser && (
      currentUser.role === 'admin' || 
      currentUser.role === 'editor' ||
      (currentUser.subscription && currentUser.subscription.status === 'active')
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la galerie...</p>
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
              <ImageIcon className="h-5 w-5 text-yellow-300 mr-2" />
              <span className="text-yellow-100 font-medium">Galerie Premium</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-8">
              Galerie <span className="text-yellow-300">MonFritkot</span>
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 leading-relaxed">
              Découvrez notre collection d'images professionnelles, 
              d'équipements et d'inspirations pour votre friterie
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans la galerie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-4">
              {canUpload() && (
                <Button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  icon={<Upload className="h-4 w-4" />}
                >
                  Ajouter des images
                </Button>
              )}
              
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
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun résultat trouvé</h3>
              <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
              : 'space-y-6'
            }>
              {filteredItems.map((item) => (
                <ImageCard
                  key={item.id}
                  image={item}
                  viewMode={viewMode}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onLike={handleLike}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Accédez à plus de <span className="text-yellow-300">contenu</span>
          </h2>
          <p className="text-xl mb-10 text-orange-100 max-w-2xl mx-auto">
            Débloquez l'accès à notre galerie complète avec des milliers d'images professionnelles
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold hover:bg-orange-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Voir les abonnements
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Essai gratuit
            </button>
          </div>
        </div>
      </section>

      {/* Upload Modal */}
      <ImageUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default Gallery;