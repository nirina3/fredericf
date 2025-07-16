import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, Check, X } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';

/**
 * Composant de debug pour tester l'upload Firebase de manière simplifiée
 */
const DebugUploader: React.FC = () => {
  const { currentUser } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
    url?: string;
    error?: any;
  } | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toISOString()}] ${message}`]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      addLog(`Fichier sélectionné: ${selectedFile.name} (${selectedFile.size} bytes, type: ${selectedFile.type})`);
    }
  };

  const handleUpload = async () => {
    if (!file || !currentUser) {
      addLog('Erreur: Aucun fichier sélectionné ou utilisateur non connecté');
      return;
    }

    setIsUploading(true);
    setUploadResult(null);
    addLog('Début de l\'upload...');

    try {
      // 1. Vérifier la configuration Firebase
      addLog(`Vérification de la configuration Firebase: ${storage ? 'OK' : 'NON INITIALISÉ'}`);
      if (!storage) {
        throw new Error('Firebase Storage n\'est pas initialisé');
      }

      // 2. Créer une référence de stockage simple
      const timestamp = Date.now();
      const path = `friterie/debug-test-${timestamp}.jpg`;
      const storageRef = ref(storage, path);
      addLog(`Référence de stockage créée: ${path}`);

      // 3. Upload du fichier
      addLog('Début de l\'upload vers Firebase...');
      const snapshot = await uploadBytes(storageRef, file);
      addLog(`Upload terminé: ${snapshot.ref.fullPath}`);

      // 4. Obtenir l'URL de téléchargement
      addLog('Récupération de l\'URL...');
      const downloadUrl = await getDownloadURL(snapshot.ref);
      addLog(`URL obtenue: ${downloadUrl}`);

      // 5. Succès
      setUploadResult({
        success: true,
        message: 'Upload réussi!',
        url: downloadUrl
      });
    } catch (error) {
      addLog(`ERREUR: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      console.error('Debug upload error:', error);
      
      setUploadResult({
        success: false,
        message: 'Échec de l\'upload',
        error
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold mr-2">DEBUG</span>
        Testeur d'upload Firebase simplifié
      </h2>

      <div className="space-y-6">
        {/* File Selection */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {file ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="h-32 object-contain rounded"
                />
              </div>
              <div className="text-sm text-gray-600">
                <p><span className="font-medium">Nom:</span> {file.name}</p>
                <p><span className="font-medium">Taille:</span> {(file.size / 1024).toFixed(2)} KB</p>
                <p><span className="font-medium">Type:</span> {file.type}</p>
              </div>
              <Button
                onClick={() => {
                  setFile(null);
                  addLog('Fichier supprimé');
                }}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-300 hover:bg-red-50"
                icon={<X className="h-4 w-4" />}
              >
                Supprimer
              </Button>
            </div>
          ) : (
            <div>
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Sélectionnez une image pour tester l'upload</p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
              >
                Sélectionner un fichier
              </Button>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            isLoading={isUploading}
            className="bg-blue-600 hover:bg-blue-700"
            icon={<Upload className="h-4 w-4" />}
          >
            {isUploading ? 'Upload en cours...' : 'Tester l\'upload'}
          </Button>
        </div>

        {/* Result */}
        {uploadResult && (
          <div className={`p-4 rounded-lg ${
            uploadResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start">
              {uploadResult.success ? (
                <Check className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
              )}
              <div>
                <h3 className={`font-medium ${uploadResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  {uploadResult.message}
                </h3>
                
                {uploadResult.success && uploadResult.url && (
                  <div className="mt-2">
                    <p className="text-sm text-green-700 mb-2">URL de l'image:</p>
                    <div className="bg-white p-2 rounded border border-green-200 text-xs break-all">
                      {uploadResult.url}
                    </div>
                    <div className="mt-2">
                      <img 
                        src={uploadResult.url} 
                        alt="Uploaded" 
                        className="h-32 object-contain rounded border border-green-200" 
                      />
                    </div>
                  </div>
                )}
                
                {!uploadResult.success && uploadResult.error && (
                  <div className="mt-2">
                    <p className="text-sm text-red-700 mb-2">Détails de l'erreur:</p>
                    <pre className="bg-white p-2 rounded border border-red-200 text-xs overflow-auto max-h-32">
                      {JSON.stringify(uploadResult.error, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Debug Logs */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">Logs de debug</h3>
            <Button
              onClick={clearLogs}
              variant="outline"
              size="sm"
            >
              Effacer les logs
            </Button>
          </div>
          <div className="bg-gray-900 text-gray-200 p-4 rounded-lg h-64 overflow-y-auto font-mono text-xs">
            {logs.length === 0 ? (
              <p className="text-gray-500">Aucun log pour le moment...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Firebase Config Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">Informations de configuration</h3>
          <div className="space-y-1 text-sm text-blue-700">
            <p><span className="font-medium">Bucket:</span> {storage?.app?.options?.storageBucket || 'Non disponible'}</p>
            <p><span className="font-medium">Auth:</span> {currentUser ? `Connecté (${currentUser.email})` : 'Non connecté'}</p>
            <p><span className="font-medium">Chemin de test:</span> friterie/debug-test-[timestamp].jpg</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugUploader;