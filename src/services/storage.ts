import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { storage, db, auth } from '../firebase/config';

// Mode debug
const DEBUG = true;
const debugLog = (...args: any[]) => {
  if (DEBUG) {
    console.log('[STORAGE DEBUG]', ...args);
  }
};

export interface UploadProgress {
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

export interface ImageMetadata {
  id?: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  url: string;
  thumbnail: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  dimensions: {
    width: number;
    height: number;
  };
  uploadedAt: Date;
  uploadedBy: string;
  requiredPlan: 'basic' | 'premium' | 'pro';
  featured: boolean;
  likes: number;
  downloads: number;
}

class StorageService {
  // Upload une image avec génération automatique de thumbnail
  async uploadImage(
    file: File,
    metadata: {
      title: string;
      description: string;
      category: string;
      tags: string[];
      requiredPlan: 'basic' | 'premium' | 'pro';
      featured: boolean;
      uploadedBy: string;
    },
    onProgress?: (progress: UploadProgress) => void,
  ): Promise<ImageMetadata> {
    try {
      debugLog('Starting upload process for file:', file.name, 'size:', this.formatFileSize(file.size));
      debugLog('Firebase config check:', storage ? 'Storage initialized' : 'Storage NOT initialized');
      debugLog('Current user:', auth.currentUser?.uid);
      
      onProgress?.({ progress: 0, status: 'uploading' });
      
      // Vérifier la configuration Firebase
      if (!storage) {
        debugLog('Firebase Storage not initialized!');
        throw new Error('Firebase Storage n\'est pas initialisé correctement. Vérifiez votre configuration.');
      }

      // Validation du fichier
      debugLog('Validating file...');
      this.validateFile(file);
      debugLog('File validation passed');

      // Génération d'un nom de fichier unique
      const fileName = this.generateFileName(file);
      const imagePath = `friterie/test-${fileName}`;
      debugLog('Generated file path:', imagePath);

      // Upload de l'image originale
      const imageRef = ref(storage, imagePath);
      debugLog('Created storage reference:', imageRef.fullPath);
      
      // Upload de l'image
      try {
        debugLog('Starting uploadBytes...');
        await uploadBytes(imageRef, file);
        debugLog('uploadBytes completed successfully');
        onProgress?.({ progress: 50, status: 'processing' });
      } catch (error) {
        debugLog('ERROR during uploadBytes:', error);
        onProgress?.({ progress: 0, status: 'error', error: 'Erreur lors de l\'upload: ' + (error instanceof Error ? error.message : 'Erreur inconnue') });
        throw error;
      }

      // Bypass thumbnail generation for debugging
      debugLog('Bypassing thumbnail generation for debug');
      let thumbnailUrl = '';
      onProgress?.({ progress: 75, status: 'processing' });

      // Obtention des URLs
      let imageUrl;
      try {
        debugLog('Getting download URL...');
        imageUrl = await getDownloadURL(imageRef); 
        debugLog('Download URL obtained:', imageUrl);
        thumbnailUrl = imageUrl; // Use same URL for thumbnail in debug mode
      } catch (error) {
        debugLog('ERROR getting download URL:', error);
        onProgress?.({ progress: 0, status: 'error', error: 'Erreur lors de l\'obtention de l\'URL de l\'image' });
        throw error;
      }
      
      onProgress?.({ progress: 85, status: 'processing' });

      // Obtention des dimensions de l'image avec gestion d'erreur
      debugLog('Getting image dimensions...');
      let dimensions;
      try {
        dimensions = await this.getImageDimensions(file);
        debugLog('Image dimensions:', dimensions);
      } catch (error) {
        debugLog('ERROR getting dimensions, using defaults:', error);
        dimensions = { width: 800, height: 600 }; // Valeurs par défaut
      }

      // Préparation des métadonnées
      debugLog('Preparing metadata...');
      const metadataToSave: Omit<ImageMetadata, 'id'> = {
        title: metadata.title || file.name.split('.')[0],
        description: metadata.description || '',
        category: metadata.category || 'friteries',
        tags: metadata.tags || [],
        url: imageUrl,
        thumbnail: thumbnailUrl,
        fileName,
        fileSize: file.size,
        mimeType: file.type,
        dimensions,
        uploadedAt: new Date(),
        uploadedBy: metadata.uploadedBy || 'unknown',
        requiredPlan: metadata.requiredPlan || 'basic',
        featured: metadata.featured || false,
        likes: 0,
        downloads: 0
      };
      
      onProgress?.({ progress: 90, status: 'processing' });

      debugLog('Saving metadata to Firestore...');
      let docRef;
      try {
        docRef = await addDoc(collection(db, 'gallery'), metadataToSave);
        debugLog('Metadata saved successfully, doc ID:', docRef.id);
      } catch (error) {
        debugLog('ERROR saving metadata to Firestore:', error);
        onProgress?.({ progress: 0, status: 'error', error: 'Erreur lors de l\'enregistrement des métadonnées: ' + (error instanceof Error ? error.message : 'Erreur inconnue') });
        throw error;
      }

      // Mettre à jour la progression à 100%
      debugLog('Upload process completed successfully');
      onProgress?.({ progress: 100, status: 'complete' });

      // Retourner l'objet complet avec l'ID
      const result: ImageMetadata = {
        id: docRef.id,
        ...metadataToSave
      };

      debugLog('Returning final result:', result);
      return result;
    } catch (error: any) {
      debugLog('CRITICAL ERROR in uploadImage:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue lors de l\'upload';
      if (onProgress) {
        onProgress({ progress: 0, status: 'error', error: errorMessage });
      }
      throw new Error(`Erreur lors de l'upload: ${errorMessage}`);
    }
  }

  // Upload multiple images
  async uploadMultipleImages(
    files: File[],
    metadata: Omit<ImageMetadata, 'id' | 'url' | 'thumbnail' | 'fileName' | 'fileSize' | 'mimeType' | 'dimensions' | 'uploadedAt' | 'likes' | 'downloads'>,
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ): Promise<ImageMetadata[]> {
    const results: ImageMetadata[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const result = await this.uploadImage(
          file,
          {
            ...metadata,
            title: metadata.title || file.name.split('.')[0]
          },
          (progress) => onProgress?.(i, progress)
        );
        results.push(result);
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        onProgress?.(i, { progress: 0, status: 'error', error: (error as Error).message });
      }
    }

    return results;
  }

  // Validation du fichier
  private validateFile(file: File): void {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
    
    debugLog('Validating file:', file.name, 'type:', file.type, 'size:', file.size);

    if (!allowedTypes.includes(file.type)) {
      debugLog('File type not allowed:', file.type);
      throw new Error('Type de fichier non supporté. Utilisez JPG, PNG, WebP ou GIF.');
    }

    if (file.size > maxSize) {
      debugLog('File too large:', this.formatFileSize(file.size));
      throw new Error('Le fichier est trop volumineux. Taille maximum : 10MB.');
    }
    
    debugLog('File validation passed');
  }

  // Génération d'un nom de fichier unique
  private generateFileName(file: File): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    return `${timestamp}_${randomString}.${extension}`;
  }

  // Génération d'un thumbnail
  private async generateThumbnail(file: File, maxWidth: number = 400, maxHeight: number = 400): Promise<Blob> {
    return new Promise((resolve, reject) => {
      debugLog('Generating thumbnail for:', file.name);
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          debugLog('Failed to create canvas context');
          reject(new Error('Impossible de créer le contexte canvas'));
          return;
        }
        
        const img = new Image();
        
        img.onload = () => {
            // Calcul des nouvelles dimensions en conservant le ratio
            let width = img.width;
            let height = img.height;
            
            // Redimensionnement si nécessaire
            if (width > maxWidth || height > maxHeight) {
              const { width: newWidth, height: newHeight } = this.calculateThumbnailDimensions(
                img.width,
                img.height,
                maxWidth,
                maxHeight
              );
              width = newWidth;
              height = newHeight;
            }
            
            canvas.width = width;
            canvas.height = height;
    
            // Dessin de l'image redimensionnée
            ctx.drawImage(img, 0, 0, width, height);
    
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve(blob);
                } else {
                  console.error('Échec de la création du blob thumbnail');
                  // Au lieu de rejeter, on résout avec null pour continuer le processus
                  resolve(file);
                }
              },
              'image/jpeg',
              0.8
            );
        };
    
        img.onerror = (e) => {
          console.error('Erreur lors du chargement de l\'image pour le thumbnail:', e);
          // Essayer la méthode de secours si l'image ne peut pas être chargée
          this.generateSimpleThumbnail(file)
            .then(resolve)
            .catch(reject);
        };
        img.src = URL.createObjectURL(file);
      } catch (err) {
        console.error('Erreur dans la génération du thumbnail:', err);
        reject(new Error(`Erreur lors de la génération du thumbnail: ${err}`));
      }
    });
  }

  // Méthode de secours pour générer un thumbnail simple si la méthode principale échoue
  private async generateSimpleThumbnail(file: File): Promise<Blob> {
    // Retourne simplement une copie du fichier original comme thumbnail
    console.log('Utilisation de la méthode de secours pour la génération du thumbnail:', file.name);
    return new Promise((resolve, reject) => {
      // Simplement retourner le fichier original comme blob
      resolve(file);
    });
  }

  // Calcul des dimensions du thumbnail
  private calculateThumbnailDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    // Vérifier les dimensions d'origine
    if (!originalWidth || !originalHeight || originalWidth <= 0 || originalHeight <= 0) {
      console.warn('Invalid original dimensions, using defaults');
      return { width: maxWidth, height: maxHeight };
    }
    
    let { width, height } = { width: originalWidth, height: originalHeight };

    if (width > height) {
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
    }

    return { width: Math.round(width), height: Math.round(height) };
  }

  // Obtention des dimensions de l'image
  private async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      debugLog('Getting dimensions for:', file.name);
      const img = new Image();
      img.onload = () => {
        debugLog('Image loaded, dimensions:', img.width, 'x', img.height);
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = (e) => {
        debugLog('Error reading image dimensions:', e);
        // Utiliser des dimensions par défaut au lieu de rejeter
        resolve({ width: 800, height: 600 });
      };
      img.src = URL.createObjectURL(file);
    });
  }

  // Récupération des images de la galerie
  async getGalleryImages(filters?: {
    category?: string;
    tags?: string[];
    requiredPlan?: string;
    featured?: boolean;
  }): Promise<ImageMetadata[]> {
    try {
      let q = query(collection(db, 'gallery'), orderBy('uploadedAt', 'desc'));

      if (filters?.category) {
        q = query(q, where('category', '==', filters.category));
      }

      if (filters?.requiredPlan) {
        q = query(q, where('requiredPlan', '==', filters.requiredPlan));
      }

      if (filters?.featured !== undefined) {
        q = query(q, where('featured', '==', filters.featured));
      }

      const querySnapshot = await getDocs(q);
      const images: ImageMetadata[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        images.push({
          id: doc.id,
          ...data,
          uploadedAt: data.uploadedAt.toDate()
        } as ImageMetadata);
      });

      // Filtrage par tags côté client (Firestore ne supporte pas array-contains-any avec d'autres filtres)
      if (filters?.tags && filters.tags.length > 0) {
        return images.filter(image => 
          filters.tags!.some(tag => image.tags.includes(tag))
        );
      }

      return images;
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      throw error;
    }
  }

  // Mise à jour des métadonnées d'une image
  async updateImageMetadata(imageId: string, updates: Partial<ImageMetadata>): Promise<void> {
    try {
      const imageRef = doc(db, 'gallery', imageId);
      await updateDoc(imageRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating image metadata:', error);
      throw error;
    }
  }

  // Suppression d'une image
  async deleteImage(imageId: string): Promise<void> {
    try {
      debugLog('Deleting image with ID:', imageId);
      // Récupération des métadonnées pour obtenir les URLs
      const images = await this.getGalleryImages();
      const image = images.find(img => img.id === imageId);
      
      if (!image) {
        debugLog('Image not found for deletion');
        throw new Error('Image non trouvée');
      }

      debugLog('Found image to delete:', image.fileName);
      // Suppression des fichiers du storage
      const imageRef = ref(storage, `gallery/${image.fileName}`);
      const thumbnailRef = ref(storage, `gallery/thumbnails/${image.fileName}`);

      debugLog('Deleting files from storage...');
      await Promise.all([
        deleteObject(imageRef),
        deleteObject(thumbnailRef),
        deleteDoc(doc(db, 'gallery', imageId))
      ]);
      debugLog('Image deleted successfully');
    } catch (error) {
      debugLog('ERROR deleting image:', error);
      throw error;
    }
  }

  // Incrémenter le nombre de likes
  async likeImage(imageId: string): Promise<void> {
    try {
      const images = await this.getGalleryImages();
      const image = images.find(img => img.id === imageId);
      
      if (!image) {
        throw new Error('Image non trouvée');
      }

      await this.updateImageMetadata(imageId, {
        likes: image.likes + 1
      });
    } catch (error) {
      console.error('Error liking image:', error);
      throw error;
    }
  }

  // Incrémenter le nombre de téléchargements
  async downloadImage(imageId: string): Promise<void> {
    try {
      const images = await this.getGalleryImages();
      const image = images.find(img => img.id === imageId);
      
      if (!image) {
        throw new Error('Image non trouvée');
      }

      await this.updateImageMetadata(imageId, {
        downloads: image.downloads + 1
      });

      // Téléchargement du fichier
      const link = document.createElement('a');
      link.href = image.url;
      link.download = image.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
      throw error;
    }
  }

  // Formatage de la taille de fichier
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Test simple d'upload pour debug
  async testUpload(file: File): Promise<string> {
    debugLog('SIMPLE TEST UPLOAD for file:', file.name);
    
    try {
      // Créer une référence simple
      const testRef = ref(storage, `friterie/test-${Date.now()}.jpg`);
      debugLog('Test reference created:', testRef.fullPath);
      
      // Upload simple
      debugLog('Starting simple upload...');
      await uploadBytes(testRef, file);
      debugLog('Simple upload completed');
      
      // Obtenir l'URL
      debugLog('Getting download URL...');
      const url = await getDownloadURL(testRef);
      debugLog('Got download URL:', url);
      
      return url;
    } catch (error) {
      debugLog('CRITICAL ERROR in test upload:', error);
      throw error;
    }
  }

  // Obtention des catégories disponibles
  async getCategories(): Promise<string[]> {
    try {
      const images = await this.getGalleryImages();
      const categories = [...new Set(images.map(img => img.category))];
      return categories.sort();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  // Obtention des tags populaires
  async getPopularTags(limit: number = 20): Promise<{ tag: string; count: number }[]> {
    try {
      const images = await this.getGalleryImages();
      const tagCounts: { [key: string]: number } = {};

      images.forEach(image => {
        image.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });

      return Object.entries(tagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching popular tags:', error);
      return [];
    }
  }
}

export const storageService = new StorageService();
export default storageService;