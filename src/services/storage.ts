import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { uploadBytesResumable } from 'firebase/storage';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { storage, db } from '../firebase/config';

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
    metadata: Omit<ImageMetadata, 'id' | 'url' | 'thumbnail' | 'fileName' | 'fileSize' | 'mimeType' | 'dimensions' | 'uploadedAt' | 'likes' | 'downloads'> & { uploadedBy: string },
    onProgress?: (progress: UploadProgress) => void
    timeoutMs: number = 30000
  ): Promise<ImageMetadata> {
    try {
      onProgress?.({ progress: 0, status: 'uploading' });
      console.log('Starting upload process for:', file.name);
      
      // Vérifier la configuration Firebase
      if (!storage) {
        throw new Error('Firebase Storage n\'est pas initialisé correctement');
      }

      // Validation du fichier
      this.validateFile(file);
      console.log('File validation passed:', file.name);

      // Génération d'un nom de fichier unique
      const fileName = this.generateFileName(file);
      const imagePath = `gallery/${fileName}`;
      console.log('Generated file path:', imagePath);

      // Upload de l'image originale
      const imageRef = ref(storage, imagePath);
      console.log('Starting upload to path:', imagePath);
      
      // Mettre à jour la progression à 25%
      onProgress?.({ progress: 25, status: 'uploading' });
      console.log('Uploading original image...');
      
      // Utiliser uploadBytesResumable pour suivre la progression
      const uploadTask = uploadBytesResumable(imageRef, file);
      
      // Attendre que l'upload soit terminé
      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Calculer la progression de 0% à 50%
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 50);
            onProgress?.({ progress: progress, status: 'uploading' });
            console.log(`Upload progress: ${progress}%`);
          },
          (error) => {
            console.error('Error during upload:', error);
            reject(error);
          },
          () => {
            console.log('Original image uploaded successfully');
            resolve();
          }
        );
      });
      
      console.log('Original image uploaded successfully');
      
      // Mettre à jour la progression à 50%
      onProgress?.({ progress: 50, status: 'processing' });
      console.log('Generating thumbnail...');

      // Génération du thumbnail
      const thumbnailBlob = await this.generateThumbnail(file);
      console.log('Thumbnail generated for:', fileName);
      
      // Définir le chemin du thumbnail après sa génération
      const thumbnailPath = `gallery/thumbnails/${fileName}`;
      const thumbnailRef = ref(storage, thumbnailPath);
      console.log('Uploading thumbnail to:', thumbnailPath);
      
      // Upload du thumbnail
      // Utiliser uploadBytesResumable pour le thumbnail aussi
      const thumbnailUploadTask = uploadBytesResumable(thumbnailRef, thumbnailBlob);
      
      // Attendre que l'upload du thumbnail soit terminé
      await new Promise<void>((resolve, reject) => {
        thumbnailUploadTask.on(
          'state_changed',
          (snapshot) => {
            // Calculer la progression de 50% à 75%
            const thumbnailProgress = 50 + Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 25);
            onProgress?.({ progress: thumbnailProgress, status: 'processing' });
            console.log(`Thumbnail upload progress: ${thumbnailProgress}%`);
          },
          (error) => {
            console.error('Error during thumbnail upload:', error);
            reject(error);
          },
          () => {
            console.log('Thumbnail uploaded successfully');
            resolve();
          }
        );
      });
      
      console.log('Thumbnail uploaded successfully');
      
      console.log('Getting download URLs...');
      // Obtention des URLs
      const imageUrl = await getDownloadURL(imageRef);
      console.log('Original image URL obtained:', imageUrl);
      
      const thumbnailUrl = await getDownloadURL(thumbnailRef);
      console.log('Thumbnail URL obtained:', thumbnailUrl);

      onProgress?.({ progress: 90, status: 'processing' });
      console.log('Getting image dimensions...');

      // Obtention des dimensions de l'image avec gestion d'erreur
      let dimensions;
      try {
        dimensions = await this.getImageDimensions(file);
        console.log('Image dimensions obtained:', dimensions);
      } catch (error) {
        console.error('Error getting image dimensions, using defaults:', error);
        dimensions = { width: 800, height: 600 }; // Valeurs par défaut
      }

      console.log('Preparing metadata for Firestore...');
      // Préparation des métadonnées
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

      console.log('Saving metadata to Firestore...');
      const docRef = await addDoc(collection(db, 'gallery'), metadataToSave);
      console.log('Image metadata saved successfully to Firestore with ID:', docRef.id);

      // Mettre à jour la progression à 100%
      onProgress?.({ progress: 100, status: 'complete' });
      console.log('Upload complete!');

      // Retourner l'objet complet avec l'ID
      const result: ImageMetadata = {
        id: docRef.id,
        ...metadataToSave
      };

      console.log('Returning complete image object with ID:', result.id);
      return result;
    } catch (error: any) {
      console.error('Error in uploadImage:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue lors de l\'upload';
      console.error('Upload failed with error:', errorMessage);
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
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Type de fichier non supporté. Utilisez JPG, PNG, WebP ou GIF.');
    }

    if (file.size > maxSize) {
      throw new Error('Le fichier est trop volumineux. Taille maximum : 10MB.');
    }
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
      console.log('Starting thumbnail generation for:', file.name);
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Impossible de créer le contexte canvas'));
          return;
        }
        
        const img = new Image();
        
        img.onload = () => {
          try {
            // Calcul des nouvelles dimensions en conservant le ratio
            console.log('Original dimensions:', img.width, 'x', img.height);
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
            
            console.log('Calculated thumbnail dimensions:', width, 'x', height);
    
            canvas.width = width;
            canvas.height = height;
    
            // Dessin de l'image redimensionnée
            ctx.drawImage(img, 0, 0, width, height);
    
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  console.log('Thumbnail blob created successfully');
                  resolve(blob);
                } else {
                  console.error('Failed to create thumbnail blob');
                  reject(new Error('Erreur lors de la génération du thumbnail'));
                }
              },
              'image/jpeg',
              0.8
            );
          } catch (err) {
            console.error('Error during thumbnail processing:', err);
            reject(new Error(`Erreur lors du traitement de l'image: ${err}`));
          }
        };
    
        img.onerror = (e) => {
          console.error('Error loading image for thumbnail:', e);
          // Essayer la méthode de secours si l'image ne peut pas être chargée
          this.generateSimpleThumbnail(file)
            .then(resolve)
            .catch(reject);
        };
        img.src = URL.createObjectURL(file);
      } catch (err) {
        console.error('Error in thumbnail generation:', err);
        reject(new Error(`Erreur lors de la génération du thumbnail: ${err}`));
      }
    });
  }

  // Méthode de secours pour générer un thumbnail simple si la méthode principale échoue
  private async generateSimpleThumbnail(file: File): Promise<Blob> {
    // Retourne simplement une copie du fichier original comme thumbnail
    console.log('Using fallback thumbnail generation for:', file.name);
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        file.arrayBuffer().then(buffer => {
          const blob = new Blob([buffer], { type: file.type });
          resolve(blob);
        }).catch(err => {
          console.error('Error in fallback thumbnail generation:', err);
          // Dernier recours: retourner le fichier original
          resolve(file);
        });
      };
      img.onerror = (e) => {
        console.error('Error loading image in fallback method:', e);
        // Dernier recours: retourner le fichier original
        file.arrayBuffer().then(buffer => {
          resolve(new Blob([buffer], { type: file.type }));
        }).catch(err => {
          reject(new Error('Impossible de générer un thumbnail: ' + err.message));
        });
      };
      img.src = URL.createObjectURL(file);
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
      console.log('Getting image dimensions');
      const img = new Image();
      img.onload = () => {
        console.log('Image dimensions obtained:', img.width, 'x', img.height);
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = (e) => {
        console.error('Error reading image dimensions:', e);
        reject(new Error('Impossible de lire les dimensions de l\'image'));
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
      // Récupération des métadonnées pour obtenir les URLs
      const images = await this.getGalleryImages();
      const image = images.find(img => img.id === imageId);
      
      if (!image) {
        throw new Error('Image non trouvée');
      }

      // Suppression des fichiers du storage
      const imageRef = ref(storage, `gallery/${image.fileName}`);
      const thumbnailRef = ref(storage, `gallery/thumbnails/${image.fileName}`);

      await Promise.all([
        deleteObject(imageRef),
        deleteObject(thumbnailRef),
        deleteDoc(doc(db, 'gallery', imageId))
      ]);
    } catch (error) {
      console.error('Error deleting image:', error);
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