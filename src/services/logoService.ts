import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { doc, getDoc } from 'firebase/firestore';
import { storage, db } from '../firebase/config';

export interface LogoInfo {
  id: string;
  url: string;
  lastUpdated?: Date;
}

class LogoService {
  private logos: Map<string, string> = new Map();
  private initialized: boolean = false;

  // Initialiser le service et charger les logos
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Récupérer les informations des logos depuis Firestore
      const settingsDoc = await getDoc(doc(db, 'settings', 'logos'));
      
      if (settingsDoc.exists()) {
        const settingsData = settingsDoc.data();
        
        // Parcourir les logos dans les paramètres
        for (const [logoId, logoData] of Object.entries(settingsData)) {
          if (logoData && typeof logoData === 'object' && 'url' in logoData) {
            this.logos.set(logoId, logoData.url as string);
          }
        }
      }
      
      // Si aucun logo n'est trouvé dans Firestore, essayer de les récupérer directement depuis Storage
      if (this.logos.size === 0) {
        const logosRef = ref(storage, 'logos');
        const logosResult = await listAll(logosRef);
        
        for (const item of logosResult.items) {
          const url = await getDownloadURL(item);
          const fileName = item.name;
          const logoId = this.getLogoIdFromFileName(fileName);
          
          if (logoId) {
            this.logos.set(logoId, url);
          }
        }
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing logo service:', error);
      throw error;
    }
  }

  // Obtenir l'ID du logo à partir du nom de fichier
  private getLogoIdFromFileName(fileName: string): string | null {
    if (fileName === 'logo-principal.png') return 'main-logo';
    if (fileName === 'logo-footer.png') return 'footer-logo';
    if (fileName === 'favicon.ico') return 'favicon';
    if (fileName === 'logo-email.png') return 'email-logo';
    if (fileName === 'logo-social.png') return 'social-logo';
    return null;
  }

  // Obtenir l'URL d'un logo par son ID
  async getLogoUrl(logoId: string): Promise<string> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    return this.logos.get(logoId) || '';
  }

  // Obtenir tous les logos
  async getAllLogos(): Promise<Map<string, string>> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    return this.logos;
  }

  // Vérifier si un logo existe
  async hasLogo(logoId: string): Promise<boolean> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    return this.logos.has(logoId) && !!this.logos.get(logoId);
  }
}

export const logoService = new LogoService();
export default logoService;