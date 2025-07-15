import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Image, FileText, Video, Upload, Search, Filter, Grid, List } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import ImageUploadModal from '../../components/gallery/ImageUploadModal';
import storageService, { ImageMetadata } from '../../services/storage';

const ContentManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('gallery');
  const [images, setImages] = useState<ImageMetadata[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImageMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const tabs = [
    { id: 'gallery', name: 'Galerie', icon: <Image className="h-5 w-5" />, count: images.length },
    { id: 'articles', name: 'Articles', icon: <FileText className="h-5 w-5" />, count: 0 },
    { id: 'videos', name: 'Vidéos', icon: <Video className="h-5 w-5" />, count: 0 }
  ];

  const categories = [
    { id: 'all', name: 'Toutes les catégories' },
    { id: 'friteries', name: 'Friteries' },
    { id: 'produits', name: 'Produits' },
    { id: 'equipement', name: 'Équipement' },
    { id: 'ambiance', name: 'Ambiance' },
    { id: 'formation', name: 'Formation' },
    { id: 'innovation', name: 'Innovation' }
  ];

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    filterImages();
  }, [images, searchTerm, selectedCategory]);

  const loadImages = async () => {
    try {
      setLoading(true);
      const galleryImages = await storageService.getGalleryImages();
      setImages(galleryImages);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterImages = () => {
    let filtered = images;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(img => img.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(img =>
        img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredImages(filtered);
  };

  const handleUploadSuccess = (newImages: ImageMetadata[]) => {
    console.log('Upload successful, received new images:', newImages.length);
    setImages(prev => [...newImages, ...prev]);
    // Le modal se fermera automatiquement après un court délai
    // Pas besoin de le fermer ici pour éviter les problèmes de redirection
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;

    try {
      await storageService.deleteImage(imageId);
      setImages(prev => prev.filter(img => img.id !== imageId));
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const canManageContent = () => {
    return currentUser && (currentUser.role === 'admin' || currentUser.role === 'editor');
  };

  if (!canManageContent()) {
    return (
      <div className="text-center py-12">
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
        <p className="text-gray-600">Seuls les administrateurs et éditeurs peuvent gérer le contenu.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion du contenu</h1>
            <p className="text-gray-600 mt-2">Gérez les images, articles et vidéos de la plateforme</p>
          </div>
          <Button
            onClick={() => setShowUploadModal(true)}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
            icon={<Plus className="h-4 w-4" />}
          >
            Ajouter du contenu
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="p-6">
            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
              <div className="flex items-center space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher des images..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
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

            {/* Images Grid/List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <span className="ml-2 text-gray-600">Chargement...</span>
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="text-center py-12">
                <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune image trouvée</h3>
                <p className="text-gray-600 mb-6">Commencez par ajouter des images à votre galerie</p>
                <Button
                  onClick={() => setShowUploadModal(true)}
                  icon={<Upload className="h-4 w-4" />}
                >
                  Ajouter des images
                </Button>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                : 'space-y-4'
              }>
                {filteredImages.map((image) => (
                  <div key={image.id} className={`bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}>
                    <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-w-16 aspect-h-12'}`}>
                      <img
                        src={image.thumbnail}
                        alt={image.title}
                        className={`object-cover ${viewMode === 'list' ? 'w-full h-32' : 'w-full h-48'}`}
                      />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <button
                          onClick={() => window.open(image.url, '_blank')}
                          className="bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteImage(image.id!)}
                          className="bg-red-500/80 text-white p-1 rounded-full hover:bg-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col space-y-1">
                        {image.featured && (
                          <span className="bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                            Featured
                          </span>
                        )}
                        <span className={`text-white px-2 py-1 rounded-md text-xs font-medium ${
                          image.requiredPlan === 'basic' ? 'bg-green-500' :
                          image.requiredPlan === 'premium' ? 'bg-blue-500' : 'bg-purple-500'
                        }`}>
                          {image.requiredPlan}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{image.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{image.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {image.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                            {tag}
                          </span>
                        ))}
                        {image.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{image.tags.length - 3}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{image.category}</span>
                        <span>{new Date(image.uploadedAt).toLocaleDateString('fr-FR')}</span>
                      </div>

                      <div className="flex items-center justify-between mt-3 text-sm">
                        <div className="flex items-center space-x-3 text-gray-500">
                          <span>👁 {Math.floor(Math.random() * 1000)}</span>
                          <span>❤️ {image.likes}</span>
                          <span>⬇️ {image.downloads}</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {storageService.formatFileSize(image.fileSize)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div className="p-6">
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestion des articles</h3>
              <p className="text-gray-600 mb-6">Fonctionnalité en cours de développement</p>
              <Button disabled>Bientôt disponible</Button>
            </div>
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div className="p-6">
            <div className="text-center py-12">
              <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestion des vidéos</h3>
              <p className="text-gray-600 mb-6">Fonctionnalité en cours de développement</p>
              <Button disabled>Bientôt disponible</Button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <ImageUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default ContentManagement;