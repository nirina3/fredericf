import React, { useState } from 'react';
import { Heart, Download, Eye, Edit, Trash2, Star, Crown, Calendar, User, Tag, X } from 'lucide-react';
import Button from '../ui/Button';
import { ImageMetadata } from '../../services/storage';
import { useAuth } from '../../contexts/AuthContext';
import storageService from '../../services/storage';

interface ImageCardProps {
  image: ImageMetadata;
  viewMode: 'grid' | 'list';
  onClick?: () => void;
  onEdit?: (image: ImageMetadata) => void;
  onDelete?: (imageId: string) => void;
  onLike?: (imageId: string) => void;
  onDownload?: (imageId: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({
  image,
  viewMode,
  onClick,
  onEdit,
  onDelete,
  onLike,
  onDownload
}) => {
  const { currentUser, isSubscribed } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  const canAccessImage = () => {
    if (!currentUser) return image.requiredPlan === 'basic';
    return isSubscribed(image.requiredPlan);
  };

  const canEdit = () => {
    return currentUser && (
      currentUser.id === image.uploadedBy || 
      currentUser.role === 'admin' || 
      currentUser.role === 'editor'
    );
  };

  const handleLike = async () => {
    if (!currentUser || !onLike) return;
    
    try {
      await storageService.likeImage(image.id!);
      setIsLiked(!isLiked);
      onLike(image.id!);
    } catch (error) {
      console.error('Error liking image:', error);
    }
  };

  const handleDownload = async () => {
    if (!canAccessImage() || !onDownload) {
      alert('Vous devez avoir un abonnement approprié pour télécharger cette image.');
      return;
    }
    
    try {
      await storageService.downloadImage(image.id!);
      onDownload(image.id!);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleView = () => {
    if (canAccessImage()) {
      setShowFullImage(true);
    } else {
      alert('Vous devez avoir un abonnement approprié pour voir cette image en pleine résolution.');
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-green-500';
      case 'premium': return 'bg-blue-500';
      case 'pro': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getPlanName = (plan: string) => {
    switch (plan) {
      case 'basic': return 'Basic';
      case 'premium': return 'Premium';
      case 'pro': return 'Pro';
      default: return plan;
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex">
        {/* Image */}
        <div className="relative w-64 flex-shrink-0">
          <img
            src={canAccessImage() ? image.url : image.thumbnail}
            alt={image.title}
            className={`w-full h-full object-cover cursor-pointer ${!canAccessImage() ? 'filter blur-sm' : ''}`}
            onClick={onClick || handleView}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
            <div className="flex space-x-2">
              <button
                onClick={handleLike}
                className={`p-2 rounded-full transition-colors ${
                  isLiked ? 'bg-red-500 text-white' : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                }`}
              >
                <Heart className="h-4 w-4" />
              </button>
              <button
                onClick={handleDownload}
                className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={handleView}
                className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            {image.featured && (
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </span>
            )}
            <span className={`${getPlanColor(image.requiredPlan)} text-white px-2 py-1 rounded-md text-xs font-medium`}>
              {getPlanName(image.requiredPlan)}
            </span>
          </div>

          {!canAccessImage() && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white">
                <Crown className="h-6 w-6 mx-auto mb-2" />
                <p className="text-xs font-medium">Abonnement requis</p>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{image.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{image.description}</p>
            </div>
            
            {canEdit() && (
              <div className="flex space-x-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit?.(image)}
                  icon={<Edit className="h-4 w-4" />}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete?.(image.id!)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  icon={<Trash2 className="h-4 w-4" />}
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {image.tags.slice(0, 5).map((tag, index) => (
              <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-xs font-medium">
                {tag}
              </span>
            ))}
            {image.tags.length > 5 && (
              <span className="text-xs text-gray-500">+{image.tags.length - 5} autres</span>
            )}
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{new Date(image.uploadedAt).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{image.uploadedBy}</span>
            </div>
            <div>
              <span className="font-medium">{image.dimensions.width} × {image.dimensions.height}</span>
            </div>
            <div>
              <span>{storageService.formatFileSize(image.fileSize)}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                {image.likes}
              </span>
              <span className="flex items-center">
                <Download className="h-4 w-4 mr-1" />
                {image.downloads}
              </span>
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {Math.floor(Math.random() * 1000)} vues
              </span>
            </div>
            
            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs font-medium">
              {image.category}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
        {/* Image */}
        <div className="relative aspect-w-16 aspect-h-12">
          <img
            src={canAccessImage() ? image.url : image.thumbnail}
            alt={image.title}
            className={`w-full h-48 object-cover cursor-pointer ${!canAccessImage() ? 'filter blur-sm' : ''}`}
            onClick={onClick || handleView}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
            <div className="flex space-x-3">
              <button
                onClick={handleLike}
                className={`p-3 rounded-full transition-colors ${
                  isLiked ? 'bg-red-500 text-white' : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                }`}
              >
                <Heart className="h-5 w-5" />
              </button>
              <button
                onClick={handleDownload}
                className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={handleView}
                className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
              >
                <Eye className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            {image.featured && (
              <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </span>
            )}
            <span className={`${getPlanColor(image.requiredPlan)} text-white px-3 py-1 rounded-full text-xs font-medium`}>
              {getPlanName(image.requiredPlan)}
            </span>
          </div>

          {!canAccessImage() && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white">
                <Crown className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Abonnement requis</p>
              </div>
            </div>
          )}

          {/* Edit Actions */}
          {canEdit() && (
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(image)}
                className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                icon={<Edit className="h-4 w-4" />}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete?.(image.id!)}
                className="bg-white/20 backdrop-blur-sm text-white hover:bg-red-500"
                icon={<Trash2 className="h-4 w-4" />}
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1">{image.title}</h3>
          </div>
          
          <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{image.description}</p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {image.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-xs font-medium">
                {tag}
              </span>
            ))}
            {image.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{image.tags.length - 3}</span>
            )}
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <span className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(image.uploadedAt).toLocaleDateString('fr-FR')}
            </span>
            <span>{image.dimensions.width} × {image.dimensions.height}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                {image.likes}
              </span>
              <span className="flex items-center">
                <Download className="h-4 w-4 mr-1" />
                {image.downloads}
              </span>
            </div>
            
            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs font-medium">
              {image.category}
            </span>
          </div>
        </div>
      </div>

      {/* Full Image Modal */}
      {showFullImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors z-10"
            >
              <X className="h-6 w-6" />
            </button>
            
            <img
              src={image.url}
              alt={image.title}
              className="max-w-full max-h-full object-contain"
            />
            
            <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm text-white p-4 rounded-lg">
              <h3 className="text-xl font-bold mb-2">{image.title}</h3>
              <p className="text-gray-200 mb-2">{image.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span>{image.dimensions.width} × {image.dimensions.height}</span>
                <span>{storageService.formatFileSize(image.fileSize)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCard;