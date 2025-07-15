import React, { useState, useEffect } from 'react';
import { Image, Upload, Edit, Trash2, Eye, Star, Crown, Search, Filter, Grid, List, Plus, Download } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import ImageUploadModal from '../../components/gallery/ImageUploadModal';
import storageService, { ImageMetadata } from '../../services/storage';

const GalleryManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const [images, setImages] = useState<ImageMetadata[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImageMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlan, setSelectedPlan] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const categories = [
    { id: 'all', name: 'Toutes les catégories' },
    { id: 'friteries', name: 'Friteries' },
    { id: 'produits', name: 'Produits' },
    { id: 'equipement', name: 'Équipement' },
    { id: 'ambiance', name: 'Ambiance' },
    { id: 'formation', name: 'Formation' },
    { id: 'innovation', name: 'Innovation' }
  ];

  const plans = [
    { id: 'all', name: 'Tous les plans' },
    { id: 'basic', name: 'Basic' },
    { id: 'premium', name: 'Premium' },
    { id: 'pro', name: 'Pro' }
  ];

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    filterImages();
  }, [images, searchTerm, selectedCategory, selectedPlan]);

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

    if (selectedPlan !== 'all') {
      filtered = filtered.filter(img => img.requiredPlan === selectedPlan);
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
    console.log('Upload successful in GalleryManagement, received new images:', newImages.length);
    setImages(prev => [...newImages, ...prev]);
    // Le modal se fermera automatiquement après un court délai
    // Pas besoin de le fermer ici pour éviter les problèmes de redirection
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;

    try {
      await storageService.deleteImage(imageId);
      setImages(prev => prev.filter(img => img.id !== imageId));
      setSelectedImages(prev => prev.filter(id => id !== imageId));
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) return;
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedImages.length} image(s) ?`)) return;

    try {
      await Promise.all(selectedImages.map(id => storageService.deleteImage(id)));
      setImages(prev => prev.filter(img => !selectedImages.includes(img.id!)));
      setSelectedImages([]);
    } catch (error) {
      console.error('Error deleting images:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages(prev =>
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedImages.length === filteredImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(filteredImages.map(img => img.id!));
    }
  };

  const toggleFeatured = async (imageId: string, currentFeatured: boolean) => {
    try {
      await storageService.updateImageMetadata(imageId, {
        featured: !currentFeatured
      });
      setImages(prev => prev.map(img =>
        img.id === imageId ? { ...img, featured: !currentFeatured } : img
      ));
    } catch (error) {
      console.error('Error updating featured status:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const canManageGallery = () => {
    return currentUser && (currentUser.role === 'admin' || currentUser.role === 'editor');
  };

  if (!canManageGallery()) {
    return (
      <div className="text-center py-12">
        <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
        <p className="text-gray-600">Seuls les administrateurs et éditeurs peuvent gérer la galerie.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion de la galerie</h1>
            <p className="text-gray-600 mt-2">
              {images.length} image{images.length > 1 ? 's' : ''} au total
              {selectedImages.length > 0 && ` • ${selectedImages.length} sélectionnée${selectedImages.length > 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {selectedImages.length > 0 && (
              <Button
                onClick={handleBulkDelete}
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50"
                icon={<Trash2 className="h-4 w-4" />}
              >
                Supprimer ({selectedImages.length})
              </Button>
            )}
            <Button
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
              icon={<Upload className="h-4 w-4" />}
            >
              Ajouter des images
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

            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={selectedImages.length === filteredImages.length && filteredImages.length > 0}
                onChange={toggleSelectAll}
                className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              Tout sélectionner
            </label>
            
            <div className="border-l border-gray-300 pl-2 ml-2">
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
      </div>

      {/* Images Grid/List */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="ml-2 text-gray-600">Chargement...</span>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune image trouvée</h3>
            <p className="text-gray-600 mb-6">
              {images.length === 0 
                ? 'Commencez par ajouter des images à votre galerie'
                : 'Aucune image ne correspond à vos critères de recherche'
              }
            </p>
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
              <div key={image.id} className={`bg-gray-50 border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all ${
                selectedImages.includes(image.id!) ? 'ring-2 ring-orange-500' : ''
              } ${viewMode === 'list' ? 'flex' : ''}`}>
                <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-w-16 aspect-h-12'}`}>
                  <img
                    src={image.thumbnail}
                    alt={image.title}
                    className={`object-cover ${viewMode === 'list' ? 'w-full h-32' : 'w-full h-48'}`}
                  />
                  
                  {/* Selection checkbox */}
                  <div className="absolute top-2 left-2">
                    <input
                      type="checkbox"
                      checked={selectedImages.includes(image.id!)}
                      onChange={() => toggleImageSelection(image.id!)}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      onClick={() => toggleFeatured(image.id!, image.featured)}
                      className={`p-1 rounded-full transition-colors ${
                        image.featured 
                          ? 'bg-yellow-500 text-white' 
                          : 'bg-black/50 text-white hover:bg-yellow-500'
                      }`}
                      title={image.featured ? 'Retirer de la une' : 'Mettre à la une'}
                    >
                      <Star className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => window.open(image.url, '_blank')}
                      className="bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                      title="Voir l'image"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image.id!)}
                      className="bg-red-500/80 text-white p-1 rounded-full hover:bg-red-500 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute bottom-2 left-2 flex space-x-1">
                    {image.featured && (
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </span>
                    )}
                    <span className={`text-white px-2 py-1 rounded-md text-xs font-medium flex items-center ${
                      image.requiredPlan === 'basic' ? 'bg-green-500' :
                      image.requiredPlan === 'premium' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}>
                      {image.requiredPlan === 'pro' && <Crown className="h-3 w-3 mr-1" />}
                      {image.requiredPlan}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{image.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{image.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {image.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-xs">
                        {tag}
                      </span>
                    ))}
                    {image.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{image.tags.length - 3}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>{image.category}</span>
                    <span>{new Date(image.uploadedAt).toLocaleDateString('fr-FR')}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-3 text-gray-500">
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {Math.floor(Math.random() * 1000)}
                      </span>
                      <span className="flex items-center">
                        ❤️ {image.likes}
                      </span>
                      <span className="flex items-center">
                        <Download className="h-3 w-3 mr-1" />
                        {image.downloads}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {storageService.formatFileSize(image.fileSize)}
                    </span>
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    Par {image.uploadedBy} • {image.dimensions.width} × {image.dimensions.height}
                  </div>
                </div>
              </div>
            ))}
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

export default GalleryManagement;