import React, { useState, useEffect, useRef } from 'react';
import { Upload, Image as ImageIcon, Check, AlertCircle, RefreshCw, Trash2, Eye, Download, Shield } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { collection, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { storage, db } from '../../firebase/config';

interface LogoInfo {
  id: string;
  name: string;
  description: string;
  url: string;
  lastUpdated?: Date;
  recommendedSize: string;
  fileName: string;
}

interface UploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
}

const LogoManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [logos, setLogos] = useState<LogoInfo[]>([
    {
      id: 'main-logo',
      name: 'Logo Principal',
      description: 'Utilisé dans le header et la navigation',
      url: '',
      recommendedSize: '200x80 pixels',
      fileName: 'logo-principal.png'
    },
    {
      id: 'footer-logo',
      name: 'Logo Footer',
      description: 'Utilisé dans le pied de page',
      url: '',
      recommendedSize: '150x60 pixels',
      fileName: 'logo-footer.png'
    },
    {
      id: 'favicon',
      name: 'Favicon',
      description: 'Icône du site dans les onglets du navigateur',
      url: '',
      recommendedSize: '32x32 pixels',
      fileName: 'favicon.ico'
    },
    {
      id: 'email-logo',
      name: 'Logo Email',
      description: 'Utilisé dans les emails envoyés aux utilisateurs',
      url: '',
      recommendedSize: '200x80 pixels',
      fileName: 'logo-email.png'
    },
    {
      id: 'social-logo',
      name: 'Logo Réseaux Sociaux',
      description: 'Utilisé pour les partages sur les réseaux sociaux',
      url: '',
      recommendedSize: '1200x630 pixels',
      fileName: 'logo-social.png'
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    status: 'idle'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadLogos();
  }, []);

  const loadLogos = async () => {
    try {
      setLoading(true);
      
      // Récupérer les informations des logos depuis Firestore
      const settingsDoc = await getDoc(doc(db, 'settings', 'logos'));
      
      if (settingsDoc.exists()) {
        const settingsData = settingsDoc.data();
        
        // Mettre à jour les URLs des logos
        setLogos(prev => prev.map(logo => ({
          ...logo,
          url: settingsData[logo.id]?.url || '',
          lastUpdated: settingsData[logo.id]?.lastUpdated ? new Date(settingsData[logo.id].lastUpdated.toDate()) : undefined
        })));
      } else {
        // Créer le document s'il n'existe pas
        await setDoc(doc(db, 'settings', 'logos'), {});
      }
      
      // Vérifier si les logos existent dans Firebase Storage
      const logosRef = ref(storage, 'logos');
      const logosResult = await listAll(logosRef);
      
      // Mettre à jour les URLs des logos qui existent dans Storage
      for (const item of logosResult.items) {
        const url = await getDownloadURL(item);
        const fileName = item.name;
        
        setLogos(prev => prev.map(logo => 
          logo.fileName === fileName ? { ...logo, url } : logo
        ));
      }
    } catch (error) {
      console.error('Error loading logos:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de charger les logos',
        category: 'system',
        priority: 'high'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (logoId: string) => {
    setSelectedLogo(logoId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedLogo || !e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    const selectedLogoInfo = logos.find(logo => logo.id === selectedLogo);
    
    if (!selectedLogoInfo) {
      return;
    }

    // Vérifier le type de fichier
    const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
    if (selectedLogoInfo.id === 'favicon') {
      validTypes.push('image/x-icon');
    }
    
    if (!validTypes.includes(file.type)) {
      addNotification({
        type: 'error',
        title: 'Type de fichier non valide',
        message: `Le logo doit être au format ${validTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}`,
        category: 'system',
        priority: 'high'
      });
      return;
    }

    uploadLogo(file, selectedLogoInfo);
  };

  const uploadLogo = async (file: File, logoInfo: LogoInfo) => {
    try {
      setUploadProgress({
        progress: 0,
        status: 'uploading'
      });

      // Créer une référence dans Firebase Storage
      const storageRef = ref(storage, `logos/${logoInfo.fileName}`);
      
      // Démarrer l'upload
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      // Écouter les événements de progression
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress({
            progress,
            status: 'uploading'
          });
        },
        (error) => {
          console.error('Upload error:', error);
          setUploadProgress({
            progress: 0,
            status: 'error',
            error: 'Erreur lors de l\'upload'
          });
          
          addNotification({
            type: 'error',
            title: 'Erreur d\'upload',
            message: 'Impossible d\'uploader le logo',
            category: 'system',
            priority: 'high'
          });
        },
        async () => {
          // Upload terminé avec succès
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Mettre à jour l'URL dans Firestore
          const settingsRef = doc(db, 'settings', 'logos');
          await updateDoc(settingsRef, {
            [logoInfo.id]: {
              url: downloadURL,
              lastUpdated: new Date(),
              fileName: logoInfo.fileName,
              fileSize: file.size,
              fileType: file.type
            }
          });
          
          // Mettre à jour l'état local
          setLogos(prev => prev.map(logo => 
            logo.id === logoInfo.id 
              ? { ...logo, url: downloadURL, lastUpdated: new Date() } 
              : logo
          ));
          
          setUploadProgress({
            progress: 100,
            status: 'success'
          });
          
          addNotification({
            type: 'success',
            title: 'Logo mis à jour',
            message: `Le ${logoInfo.name} a été mis à jour avec succès`,
            category: 'system',
            priority: 'medium'
          });
          
          // Réinitialiser après 2 secondes
          setTimeout(() => {
            setUploadProgress({
              progress: 0,
              status: 'idle'
            });
            setSelectedLogo(null);
          }, 2000);
        }
      );
    } catch (error) {
      console.error('Error uploading logo:', error);
      setUploadProgress({
        progress: 0,
        status: 'error',
        error: 'Erreur lors de l\'upload'
      });
      
      addNotification({
        type: 'error',
        title: 'Erreur d\'upload',
        message: 'Impossible d\'uploader le logo',
        category: 'system',
        priority: 'high'
      });
    }
  };

  const deleteLogo = async (logoId: string) => {
    try {
      const logoInfo = logos.find(logo => logo.id === logoId);
      if (!logoInfo || !logoInfo.url) return;
      
      if (!confirm(`Êtes-vous sûr de vouloir supprimer le ${logoInfo.name} ?`)) {
        return;
      }
      
      // Supprimer le fichier de Firebase Storage
      const storageRef = ref(storage, `logos/${logoInfo.fileName}`);
      await deleteObject(storageRef);
      
      // Mettre à jour Firestore
      const settingsRef = doc(db, 'settings', 'logos');
      await updateDoc(settingsRef, {
        [logoId]: {
          url: '',
          lastUpdated: new Date()
        }
      });
      
      // Mettre à jour l'état local
      setLogos(prev => prev.map(logo => 
        logo.id === logoId ? { ...logo, url: '' } : logo
      ));
      
      addNotification({
        type: 'success',
        title: 'Logo supprimé',
        message: `Le ${logoInfo.name} a été supprimé avec succès`,
        category: 'system',
        priority: 'medium'
      });
    } catch (error) {
      console.error('Error deleting logo:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de supprimer le logo',
        category: 'system',
        priority: 'high'
      });
    }
  };

  const downloadLogo = (logoUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = logoUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const canManageLogos = () => {
    return currentUser && currentUser.role === 'admin';
  };

  if (!canManageLogos()) {
    return (
      <div className="text-center py-12">
        <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
        <p className="text-gray-600">Seuls les administrateurs peuvent gérer les logos.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <ImageIcon className="h-6 w-6 mr-2" />
              Gestion des Logos & Branding
            </h1>
            <p className="text-gray-600 mt-2">
              Gérez les logos et éléments de marque de votre site
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={loadLogos}
              icon={<RefreshCw className="h-4 w-4" />}
            >
              Actualiser
            </Button>
          </div>
        </div>
      </div>

      {/* Logos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {logos.map((logo) => (
          <div key={logo.id} className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">{logo.name}</h2>
              <div className="text-xs sm:text-sm text-gray-500">
                {logo.lastUpdated && (
                  <span>Mis à jour le {logo.lastUpdated.toLocaleDateString('fr-FR')}</span>
                )}
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{logo.description}</p>
            
            <div className="bg-gray-50 rounded-lg p-3 sm:p-6 mb-4">
              {logo.url ? (
                <div className="flex flex-col items-center">
                  <img 
                    src={logo.url} 
                    alt={logo.name} 
                    className="max-h-32 object-contain mb-4"
                  />
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline" 
                      className="text-xs sm:text-sm px-2 sm:px-3"
                      onClick={() => downloadLogo(logo.url, logo.fileName)}
                      icon={<Download className="h-4 w-4" />}
                    >
                      Télécharger
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50 text-xs sm:text-sm px-2 sm:px-3"
                      onClick={() => deleteLogo(logo.id)}
                      icon={<Trash2 className="h-4 w-4" />}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">Aucun logo téléchargé</p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="text-xs sm:text-sm text-gray-600">
                  <span className="font-medium">Taille recommandée:</span> {logo.recommendedSize}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  <span className="font-medium">Formats:</span> PNG, JPG, SVG{logo.id === 'favicon' ? ', ICO' : ''}
                </div>
              </div>
              
              {selectedLogo === logo.id && uploadProgress.status !== 'idle' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {uploadProgress.status === 'uploading' && 'Upload en cours...'}
                      {uploadProgress.status === 'success' && 'Upload terminé !'}
                      {uploadProgress.status === 'error' && 'Erreur d\'upload'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {Math.round(uploadProgress.progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        uploadProgress.status === 'error' ? 'bg-red-500' :
                        uploadProgress.status === 'success' ? 'bg-green-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${uploadProgress.progress}%` }}
                    />
                  </div>
                  {uploadProgress.error && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {uploadProgress.error}
                    </p>
                  )}
                </div>
              )}
              
              <Button
                onClick={() => handleFileSelect(logo.id)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                icon={<Upload className="h-3 w-3 sm:h-4 sm:w-4" />}
                disabled={selectedLogo === logo.id && uploadProgress.status === 'uploading'}
              >
                {logo.url ? 'Changer le logo' : 'Télécharger un logo'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/x-icon"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Instructions */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Instructions</h2>
        
        <div className="space-y-3 sm:space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-medium text-blue-900 mb-2">Recommandations générales</h3>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-blue-800">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Utilisez des images avec un fond transparent (PNG ou SVG) pour une meilleure intégration</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Respectez les dimensions recommandées pour chaque type de logo</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Pour le favicon, utilisez de préférence le format ICO ou PNG</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Les logos sont automatiquement mis à jour sur toutes les pages du site</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-medium text-yellow-900 mb-2">Remarque importante</h3>
            <p className="text-xs sm:text-sm text-yellow-800">
              Après avoir changé le favicon, il peut être nécessaire de vider le cache du navigateur pour voir les changements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoManagement;