import React, { useState, useRef, useCallback } from 'react';
import { X, Upload, Image as ImageIcon, Plus, Trash2, Eye, AlertCircle, Check, Crown } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import storageService, { UploadProgress, ImageMetadata } from '../../services/storage';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (images: ImageMetadata[]) => void;
}

interface FileWithPreview extends File {
  preview: string;
  metadata: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    requiredPlan: 'basic' | 'premium' | 'pro';
    featured: boolean;
  };
  progress?: UploadProgress;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [globalSettings, setGlobalSettings] = useState({
    category: 'friteries',
    requiredPlan: 'basic' as 'basic' | 'premium' | 'pro',
    featured: false
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { id: 'friteries', name: 'Friteries' },
    { id: 'produits', name: 'Produits' },
    { id: 'equipement', name: 'Équipement' },
    { id: 'ambiance', name: 'Ambiance' },
    { id: 'formation', name: 'Formation' },
    { id: 'innovation', name: 'Innovation' }
  ];

  const plans = [
    { id: 'basic', name: 'Basic', color: 'bg-green-500' },
    { id: 'premium', name: 'Premium', color: 'bg-blue-500' },
    { id: 'pro', name: 'Pro', color: 'bg-purple-500' }
  ];

  // Gestion du drag & drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    
    const filesWithPreview: FileWithPreview[] = imageFiles.map(file => {
      const preview = URL.createObjectURL(file);
      return Object.assign(file, {
        preview,
        metadata: {
          title: file.name.split('.')[0],
          description: '',
          category: globalSettings.category,
          tags: [],
          requiredPlan: globalSettings.requiredPlan,
          featured: globalSettings.featured
        }
      });
    });

    setFiles(prev => [...prev, ...filesWithPreview]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const updateFileMetadata = (index: number, field: string, value: any) => {
    setFiles(prev => {
      const newFiles = [...prev];
      newFiles[index].metadata = {
        ...newFiles[index].metadata,
        [field]: value
      };
      return newFiles;
    });
  };

  const addTag = (index: number, tag: string) => {
    if (tag.trim() && !files[index].metadata.tags.includes(tag.trim())) {
      updateFileMetadata(index, 'tags', [...files[index].metadata.tags, tag.trim()]);
    }
  };

  const removeTag = (index: number, tagToRemove: string) => {
    updateFileMetadata(
      index,
      'tags',
      files[index].metadata.tags.filter(tag => tag !== tagToRemove)
    );
  };

  const applyGlobalSettings = () => {
    setFiles(prev => prev.map(file => ({
      ...file,
      metadata: {
        ...file.metadata,
        category: globalSettings.category,
        requiredPlan: globalSettings.requiredPlan,
        featured: globalSettings.featured
      }
    })));
  };

  const handleUpload = async () => {
    if (!currentUser || files.length === 0) return;

    setIsUploading(true);
    const uploadedImages: ImageMetadata[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        try {
          // Préparer les métadonnées (s'assurer qu'elles sont correctement formatées)
          const uploadMetadata = {
            title: file.metadata?.title || file.name.split('.')[0],
            description: file.metadata?.description || '',
            category: file.metadata?.category || 'friteries',
            tags: file.metadata?.tags || [],
            requiredPlan: file.metadata?.requiredPlan || 'basic',
            featured: file.metadata?.featured || false,
            uploadedBy: currentUser.id
          };
          
          // Upload l'image
          const uploadedImage = await storageService.uploadImage(
            file,
            uploadMetadata,
            (progress: UploadProgress) => {
              setFiles(prev => {
                const newFiles = [...prev];
                if (newFiles[i]) {
                  newFiles[i].progress = progress;
                }
                return newFiles;
              });
            }
          );
          
          // Vérifier que l'image uploadée est valide et a un ID
          if (uploadedImage && uploadedImage.id) {
            uploadedImages.push(uploadedImage);
          } else {
            console.error('Uploaded image is missing ID or is invalid:', uploadedImage);
            
            // Mettre à jour le statut d'erreur pour cette image
            setFiles(prev => {
              const newFiles = [...prev];
              if (newFiles[i]) {
                newFiles[i].progress = { 
                  progress: 0, 
                  status: 'error', 
                  error: 'L\'upload a échoué - ID manquant' 
                };
              }
              return newFiles;
            });
          }
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          setFiles(prev => {
            const newFiles = [...prev];
            newFiles[i].progress = {
              progress: 0,
              status: 'error',
              error: (error as Error).message
            };
            return newFiles;
          });
        }
      }

      if (uploadedImages.length > 0) {
        // Appeler onSuccess et fermer le modal
        onSuccess(uploadedImages);
        setFiles([]);
        setIsUploading(false);
        onClose();
        return;
      } else {
        console.error('No images were successfully uploaded');
        alert('Erreur lors de l\'upload des images. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Erreur lors de l\'upload des images. Veuillez réessayer.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      // Nettoyer les URLs d'aperçu
      files.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
      setFiles([]);
      onClose();
    }
  };

  if (!isOpen) return null;
  
  // Entourer le rendu du composant dans un try-catch
  try {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full my-4 max-h-[90vh] overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Ajouter des images</h2>
                <p className="text-gray-600 mt-1">Uploadez vos images dans la galerie premium</p>
              </div>
              <button
                onClick={handleClose}
                disabled={isUploading}
                type="button"
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6" style={{ maxHeight: 'calc(80vh - 140px)' }}>
              {files.length === 0 ? (
                /* Upload Zone */
                <div
                  className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
                    dragActive
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="mx-auto w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-6">
                    <Upload className="h-12 w-12 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Glissez vos images ici
                  </h3>
                  <p className="text-gray-600 mb-6">
                    ou cliquez pour sélectionner des fichiers
                  </p>
                  
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                    icon={<Plus className="h-4 w-4" />}
                  >
                    Sélectionner des images
                  </Button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  
                  <div className="mt-6 text-sm text-gray-500">
                    <p>Formats supportés : JPG, PNG, WebP, GIF</p>
                    <p>Taille maximum : 10MB par image</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Global Settings */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres globaux</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Catégorie par défaut
                        </label>
                        <select
                          value={globalSettings.category}
                          onChange={(e) => setGlobalSettings(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Plan requis
                        </label>
                        <select
                          value={globalSettings.requiredPlan}
                          onChange={(e) => setGlobalSettings(prev => ({ ...prev, requiredPlan: e.target.value as any }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                          {plans.map(plan => (
                            <option key={plan.id} value={plan.id}>
                              {plan.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex items-end">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={globalSettings.featured}
                            onChange={(e) => setGlobalSettings(prev => ({ ...prev, featured: e.target.checked }))}
                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Image à la une</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button
                        onClick={applyGlobalSettings}
                        type="button"
                        variant="outline"
                        size="sm"
                      >
                        Appliquer à toutes les images
                      </Button>
                    </div>
                  </div>

                  {/* Files List */}
                    {files && files.length > 0 && files.map((file, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start space-x-6">
                          {/* Preview */}
                          <div className="relative flex-shrink-0">
                            <img
                              src={file.preview}
                              alt={file.name}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeFile(index)}
                              disabled={isUploading}
                              type="button"
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Metadata Form */}
                          <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Titre *
                                </label>
                                <input
                                  type="text"
                                  value={file.metadata.title || ''}
                                  onChange={(e) => updateFileMetadata(index, 'title', e.target.value)}
                                  disabled={isUploading}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
                                  placeholder="Titre de l'image"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Catégorie
                                </label>
                                <select
                                  value={file.metadata.category || ''}
                                  onChange={(e) => updateFileMetadata(index, 'category', e.target.value)}
                                  disabled={isUploading}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
                                >
                                  {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                      {category.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                              </label>
                              <textarea
                                value={file.metadata.description || ''}
                                onChange={(e) => updateFileMetadata(index, 'description', e.target.value)}
                                disabled={isUploading}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 resize-none"
                                placeholder="Description de l'image"
                              />
                            </div>

                            {/* Tags */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tags
                              </label>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {file.metadata.tags && file.metadata.tags.map((tag, tagIndex) => (
                                  <span
                                    key={tagIndex}
                                    className="inline-flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                                  >
                                    {tag}
                                    <button
                                      onClick={() => removeTag(index, tag)}
                                      disabled={isUploading}
                                      type="button"
                                      className="ml-2 text-orange-600 hover:text-orange-800 disabled:opacity-50"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                              <input
                                type="text"
                                disabled={isUploading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
                                placeholder="Ajouter un tag (Entrée pour valider)"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const input = e.target as HTMLInputElement;
                                    addTag(index, input.value);
                                    input.value = '';
                                  }
                                }}
                              />
                            </div>

                            {/* Settings */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Plan requis
                                  </label>
                                  <select
                                    value={file.metadata.requiredPlan || 'basic'}
                                    onChange={(e) => updateFileMetadata(index, 'requiredPlan', e.target.value)}
                                    disabled={isUploading}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
                                  >
                                    {plans.map(plan => (
                                      <option key={plan.id} value={plan.id}>
                                        {plan.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                
                                <div className="flex items-center">
                                  <label className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={file.metadata.featured || false}
                                      onChange={(e) => updateFileMetadata(index, 'featured', e.target.checked)}
                                      disabled={isUploading}
                                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded disabled:opacity-50"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">À la une</span>
                                  </label>
                                </div>
                              </div>

                              <div className="text-sm text-gray-500">
                                {storageService.formatFileSize(file.size)}
                              </div>
                            </div>

                            {/* Progress */}
                            {file.progress && (
                              <div className="mt-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-gray-700">
                                    {file.progress.status === 'uploading' && 'Upload en cours...'}
                                    {file.progress.status === 'processing' && 'Traitement...'}
                                    {file.progress.status === 'complete' && 'Terminé !'}
                                    {file.progress.status === 'error' && 'Erreur'}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {file.progress.progress}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                      file.progress.status === 'error' ? 'bg-red-500' :
                                      file.progress.status === 'complete' ? 'bg-green-500' :
                                      'bg-orange-500'
                                    }`}
                                    style={{ width: `${file.progress.progress}%` }}
                                  />
                                </div>
                                {file.progress.error && (
                                  <div className="mt-2 flex items-center text-red-600 text-sm">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {file.progress.error}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                  {/* Add More Files */}
                  <div className="text-center">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      type="button"
                      variant="outline"
                      disabled={isUploading}
                      icon={<Plus className="h-4 w-4" />}
                    >
                      Ajouter d'autres images
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {files.length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-white">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {files.length} image{files.length > 1 ? 's' : ''} sélectionnée{files.length > 1 ? 's' : ''}
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button
                      onClick={handleClose}
                      type="button"
                      variant="outline"
                      disabled={isUploading}
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleUpload}
                      type="button"
                      isLoading={isUploading}
                      disabled={files.length === 0 || files.some(f => !f.metadata.title?.trim()) || isUploading}
                      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                      icon={<Upload className="h-4 w-4" />}
                    >
                      {isUploading 
                        ? `Upload en cours (${files.filter(f => f.progress?.status === 'complete').length}/${files.length})` 
                        : `Uploader ${files.length} image${files.length > 1 ? 's' : ''}`
                      }
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in ImageUploadModal:', error);
    
    // Rendu de secours en cas d'erreur
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Erreur</h2>
            <p className="text-gray-600 mb-6">
              Une erreur s'est produite lors du chargement du modal d'upload.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-red-700 font-medium">Message d'erreur :</p>
              <p className="text-red-600 text-sm mt-1">
                {error instanceof Error ? error.message : 'Erreur inconnue'}
              </p>
            </div>
            <Button
              onClick={handleClose}
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Fermer
            </Button>
          </div>
        </div>
      </div>
    );
  }
};

export default ImageUploadModal;