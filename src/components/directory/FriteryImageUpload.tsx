import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, Image as ImageIcon, Plus, Trash2, Eye, AlertCircle, Check } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import friteryImageService, { UploadProgress } from '../../services/friteryImageService';

interface FriteryImageUploadProps {
  friteryId: string;
  onSuccess: (imageUrl: string) => void;
  isMain?: boolean;
}

interface FileWithPreview extends File {
  preview: string;
  progress?: UploadProgress;
}

const FriteryImageUpload: React.FC<FriteryImageUploadProps> = ({
  friteryId,
  onSuccess,
  isMain = false
}) => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        preview
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

  const handleUpload = async () => {
    if (!currentUser || files.length === 0) return;

    setIsUploading(true);
    let uploadSuccessful = false;
    let uploadedImageUrl = '';

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        try {
          // Upload l'image
          const uploadedImage = await friteryImageService.uploadImage(
            file,
            friteryId,
            isMain,
            currentUser.id,
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
          
          if (uploadedImage && uploadedImage.url) {
            uploadSuccessful = true;
            uploadedImageUrl = uploadedImage.url;
            
            addNotification({
              type: 'success',
              title: 'Image ajoutée',
              message: 'L\'image a été ajoutée avec succès à la friterie.',
              category: 'content',
              priority: 'low'
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

      if (uploadSuccessful && uploadedImageUrl) {
        onSuccess(uploadedImageUrl);
        // Nettoyer les fichiers après un upload réussi
        setFiles([]);
      } else {
        addNotification({
          type: 'error',
          title: 'Erreur d\'upload',
          message: 'Aucune image n\'a pu être uploadée. Veuillez réessayer.',
          category: 'system',
          priority: 'high'
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      addNotification({
        type: 'error',
        title: 'Erreur d\'upload',
        message: 'Une erreur est survenue lors de l\'upload des images.',
        category: 'system',
        priority: 'high'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {files.length === 0 ? (
        /* Upload Zone */
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-4">
            <Upload className="h-8 w-8 text-white" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {dragActive ? 'Déposez l\'image ici' : 'Glissez votre image ici'}
          </h3>
          <p className="text-gray-600 mb-4">
            ou cliquez pour sélectionner un fichier
          </p>
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            type="button"
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            icon={<Plus className="h-4 w-4" />}
          >
            Sélectionner une image
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileInput}
            className="hidden"
          />
          
          <div className="mt-4 text-sm text-gray-500">
            <p>Formats supportés : JPG, PNG, WEBP</p>
            <p>Taille maximum : 50MB</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Files Preview */}
          <div className="space-y-4">
            {files.map((file, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  {/* Preview */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-20 h-20 object-cover rounded-lg"
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

                  {/* File Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900 truncate">{file.name}</div>
                      <div className="text-sm text-gray-500">
                        {friteryImageService.formatFileSize(file.size)}
                      </div>
                    </div>

                    {/* Progress */}
                    {file.progress && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
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
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <Button
              onClick={() => setFiles([])}
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
              disabled={files.length === 0 || isUploading}
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
      )}
    </div>
  );
};

export default FriteryImageUpload;