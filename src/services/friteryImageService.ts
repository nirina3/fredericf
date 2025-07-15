import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { storage, db } from '../firebase/config';

export interface FriteryImage {
  id?: string;
  friteryId: string;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
  uploadedBy: string;
  isMain: boolean;
}

export interface UploadProgress {
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

class FriteryImageService {
  // Upload une image de friterie
  async uploadImage(
    file: File,
    friteryId: string,
    isMain: boolean = false,
    uploadedBy: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<FriteryImage> {
    try {
      onProgress?.({ progress: 0, status: 'uploading' });
      
      // Validation du fichier
      this.validateFile(file);
      
      // Génération d'un nom de fichier unique
      const fileName = this.generateFileName(file);
      const imagePath = `friteries/images/${friteryId}/${fileName}`;
      
      // Upload de l'image
      const imageRef = ref(storage, imagePath);
      onProgress?.({ progress: 20, status: 'uploading' });
      
      await uploadBytes(imageRef, file);
      onProgress?.({ progress: 70, status: 'processing' });
      
      // Obtention de l'URL
      const imageUrl = await getDownloadURL(imageRef);
      onProgress?.({ progress: 90, status: 'processing' });
      
      // Sauvegarde des métadonnées dans Firestore
      const imageData: Omit<FriteryImage, 'id'> = {
        friteryId,
        url: imageUrl,
        fileName,
        fileSize: file.size,
        mimeType: file.type,
        uploadedAt: new Date(),
        uploadedBy,
        isMain
      };
      
      const docRef = await addDoc(collection(db, 'friteryImages'), imageData);
      
      // Si c'est l'image principale, mettre à jour la friterie
      if (isMain) {
        const friteryRef = doc(db, 'directory', friteryId);
        await updateDoc(friteryRef, {
          logo: imageUrl,
          images: [imageUrl]
        });
      } else {
        // Ajouter l'image à la liste des images de la friterie
        const friteryRef = doc(db, 'directory', friteryId);
        const friteryDoc = await getDocs(query(collection(db, 'directory'), where('id', '==', friteryId)));
        
        if (!friteryDoc.empty) {
          const friteryData = friteryDoc.docs[0].data();
          const images = friteryData.images || [];
          
          await updateDoc(friteryRef, {
            images: [...images, imageUrl]
          });
        }
      }
      
      onProgress?.({ progress: 100, status: 'complete' });
      
      return {
        id: docRef.id,
        ...imageData
      };
    } catch (error: any) {
      console.error('Error uploading friterie image:', error);
      onProgress?.({ 
        progress: 0, 
        status: 'error', 
        error: error.message || 'Erreur lors de l\'upload de l\'image'
      });
      throw error;
    }
  }
  
  // Récupérer les images d'une friterie
  async getFriteryImages(friteryId: string): Promise<FriteryImage[]> {
    try {
      const q = query(collection(db, 'friteryImages'), where('friteryId', '==', friteryId));
      const querySnapshot = await getDocs(q);
      
      const images: FriteryImage[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        images.push({
          id: doc.id,
          ...data,
          uploadedAt: data.uploadedAt.toDate()
        } as FriteryImage);
      });
      
      return images;
    } catch (error) {
      console.error('Error fetching friterie images:', error);
      throw error;
    }
  }
  
  // Supprimer une image
  async deleteImage(imageId: string): Promise<void> {
    try {
      // Récupérer les métadonnées pour obtenir le chemin du fichier
      const q = query(collection(db, 'friteryImages'), where('id', '==', imageId));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('Image non trouvée');
      }
      
      const imageData = querySnapshot.docs[0].data() as FriteryImage;
      const imagePath = `friteries/images/${imageData.friteryId}/${imageData.fileName}`;
      
      // Supprimer le fichier du storage
      const imageRef = ref(storage, imagePath);
      await deleteObject(imageRef);
      
      // Supprimer les métadonnées de Firestore
      await deleteDoc(doc(db, 'friteryImages', imageId));
      
      // Si c'est l'image principale, mettre à jour la friterie
      if (imageData.isMain) {
        const friteryRef = doc(db, 'directory', imageData.friteryId);
        await updateDoc(friteryRef, {
          logo: '',
          images: []
        });
      } else {
        // Retirer l'image de la liste des images de la friterie
        const friteryRef = doc(db, 'directory', imageData.friteryId);
        const friteryDoc = await getDocs(query(collection(db, 'directory'), where('id', '==', imageData.friteryId)));
        
        if (!friteryDoc.empty) {
          const friteryData = friteryDoc.docs[0].data();
          const images = friteryData.images || [];
          
          await updateDoc(friteryRef, {
            images: images.filter((url: string) => url !== imageData.url)
          });
        }
      }
    } catch (error) {
      console.error('Error deleting friterie image:', error);
      throw error;
    }
  }
  
  // Définir une image comme principale
  async setMainImage(imageId: string): Promise<void> {
    try {
      // Récupérer les métadonnées de l'image
      const imageRef = doc(db, 'friteryImages', imageId);
      const imageDoc = await getDocs(query(collection(db, 'friteryImages'), where('id', '==', imageId)));
      
      if (imageDoc.empty) {
        throw new Error('Image non trouvée');
      }
      
      const imageData = imageDoc.docs[0].data() as FriteryImage;
      
      // Mettre à jour toutes les images de la friterie pour qu'elles ne soient plus principales
      const q = query(collection(db, 'friteryImages'), where('friteryId', '==', imageData.friteryId));
      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, {
          isMain: doc.id === imageId
        });
      });
      
      // Mettre à jour la friterie avec la nouvelle image principale
      const friteryRef = doc(db, 'directory', imageData.friteryId);
      await updateDoc(friteryRef, {
        logo: imageData.url
      });
    } catch (error) {
      console.error('Error setting main image:', error);
      throw error;
    }
  }
  
  // Validation du fichier
  private validateFile(file: File): void {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Type de fichier non supporté. Utilisez JPG, PNG ou WEBP.');
    }

    if (file.size > maxSize) {
      throw new Error('Le fichier est trop volumineux. Taille maximum : 50MB.');
    }
  }

  // Génération d'un nom de fichier unique
  private generateFileName(file: File): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    return `${timestamp}_${randomString}.${extension}`;
  }
  
  // Formatage de la taille de fichier
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export const friteryImageService = new FriteryImageService();
export default friteryImageService;