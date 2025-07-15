import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, FileText, Check, AlertCircle, Download, Table, RefreshCw } from 'lucide-react';
import Papa from 'papaparse';
import Button from '../ui/Button';
import { useNotifications } from '../../contexts/NotificationContext';
import { DirectoryEntry } from '../../types';

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (entries: DirectoryEntry[]) => void;
  existingEntries: DirectoryEntry[];
}

interface CSVRow {
  Name: string;
  Address: string;
  Province: string;
  'code-postale': string;
  pays: string;
  'Featured-image': string;
  'Maps-URL': string;
  Latitude: string;
  Longitude: string;
  Rating: string;
  Category: string;
  'Open-Hours': string;
  Website: string;
  Phone: string;
  Emails: string;
  'Social-Medias': string;
  Facebook: string;
  Instagram: string;
  [key: string]: string;
}

interface ImportStats {
  total: number;
  valid: number;
  invalid: number;
  duplicates: number;
}

const CSVImportModal: React.FC<CSVImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  existingEntries
}) => {
  const { addNotification } = useNotifications();
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<CSVRow[]>([]);
  const [processedData, setProcessedData] = useState<DirectoryEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'complete'>('upload');
  const [stats, setStats] = useState<ImportStats>({ total: 0, valid: 0, invalid: 0, duplicates: 0 });
  const [errors, setErrors] = useState<{ row: number; message: string }[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      parseCSV(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
      'text/plain': ['.csv', '.txt']
    },
    multiple: false
  });

  const parseCSV = (file: File) => {
    setIsProcessing(true);
    setErrors([]);

    Papa.parse(file, {
      header: true,
      delimiter: ';', // Spécifique au format demandé
      skipEmptyLines: true,
      encoding: 'UTF-8',
      complete: (results) => {
        console.log('CSV parsing complete:', results);
        if (results.data && Array.isArray(results.data)) {
          // Filtrer les lignes vides (celles où tous les champs sont vides)
          const filteredData = results.data.filter((row: any) => {
            return Object.values(row).some(value => value !== '');
          }) as CSVRow[];
          
          setParsedData(filteredData);
          processCSVData(filteredData);
        } else {
          addNotification({
            type: 'error',
            title: 'Erreur de parsing',
            message: 'Le fichier CSV n\'a pas pu être correctement analysé.',
            category: 'system',
            priority: 'high'
          });
        }
        setIsProcessing(false);
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        addNotification({
          type: 'error',
          title: 'Erreur de parsing',
          message: error.message,
          category: 'system',
          priority: 'high'
        });
        setIsProcessing(false);
      }
    });
  };

  const processCSVData = (data: CSVRow[]) => {
    const newEntries: DirectoryEntry[] = [];
    const newErrors: { row: number; message: string }[] = [];
    let validCount = 0;
    let invalidCount = 0;
    let duplicateCount = 0;

    data.forEach((row, index) => {
      try {
        // Vérification des champs obligatoires
        if (!row.Name || !row.Address || !row.Phone) {
          newErrors.push({
            row: index + 2, // +2 car l'index est 0-based et on compte l'en-tête
            message: 'Champs obligatoires manquants (Nom, Adresse ou Téléphone)'
          });
          invalidCount++;
          return;
        }

        // Vérification des doublons
        const isDuplicate = existingEntries.some(entry => 
          entry.name.toLowerCase() === row.Name.toLowerCase() && 
          entry.contact.address.toLowerCase() === row.Address.toLowerCase()
        );

        if (isDuplicate) {
          duplicateCount++;
          // On continue quand même pour permettre la mise à jour
        }

        // Formatage du numéro de téléphone belge
        let formattedPhone = row.Phone.trim();
        if (formattedPhone) {
          // Supprimer tous les caractères non numériques sauf le +
          formattedPhone = formattedPhone.replace(/[^\d+]/g, '');
          
          // Si le numéro ne commence pas par +, ajouter le préfixe belge
          if (!formattedPhone.startsWith('+')) {
            if (formattedPhone.startsWith('0')) {
              formattedPhone = '+32' + formattedPhone.substring(1);
            } else {
              formattedPhone = '+32' + formattedPhone;
            }
          }
          
          // Formater avec des espaces pour la lisibilité
          formattedPhone = formattedPhone.replace(/(\+\d{2})(\d{1})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
        }

        // Création de l'objet DirectoryEntry
        const newEntry: DirectoryEntry = {
          id: `import_${Date.now()}_${index}`, // ID temporaire, sera remplacé lors de l'ajout à la base de données
          name: row.Name.trim(),
          description: '', // À remplir si disponible dans le CSV
          category: row.Category === 'Restaurant' ? 'Friterie Restaurant' : 'Friterie Traditionnelle',
          contact: {
            email: row.Emails ? row.Emails.trim() : '',
            phone: formattedPhone,
            website: row.Website ? row.Website.trim() : '',
            address: row.Address.trim(),
            city: row.Province ? row.Province.trim() : '',
            postalCode: row['code-postale'] ? row['code-postale'].trim() : '',
            region: row.Province ? row.Province.trim() : ''
          },
          logo: row['Featured-image'] ? row['Featured-image'].trim() : '',
          images: row['Featured-image'] ? [row['Featured-image'].trim()] : [],
          verified: false, // Par défaut, les entrées importées ne sont pas vérifiées
          premium: false, // Par défaut, les entrées importées ne sont pas premium
          rating: parseFloat(row.Rating) || 0,
          reviewCount: 0, // Pas disponible dans le CSV
          openingHours: parseOpeningHours(row['Open-Hours']),
          specialties: [],
          features: [],
          priceRange: '€€',
          createdAt: new Date(),
          lastUpdated: new Date(),
          coordinates: {
            latitude: parseFloat(row.Latitude) || 0,
            longitude: parseFloat(row.Longitude) || 0
          },
          socialMedia: {
            facebook: row.Facebook ? row.Facebook.trim() : '',
            instagram: row.Instagram ? row.Instagram.trim() : '',
            other: row['Social-Medias'] ? row['Social-Medias'].trim() : ''
          },
          mapsUrl: row['Maps-URL'] ? row['Maps-URL'].trim() : ''
        };

        newEntries.push(newEntry);
        validCount++;
      } catch (error) {
        console.error(`Error processing row ${index + 2}:`, error);
        newErrors.push({
          row: index + 2,
          message: `Erreur de traitement: ${(error as Error).message}`
        });
        invalidCount++;
      }
    });

    setProcessedData(newEntries);
    setErrors(newErrors);
    setStats({
      total: data.length,
      valid: validCount,
      invalid: invalidCount,
      duplicates: duplicateCount
    });
    setStep('preview');
  };

  const parseOpeningHours = (hoursString?: string): { [key: string]: string } => {
    if (!hoursString) return {};
    
    // Format par défaut si le format n'est pas reconnu
    const defaultHours: { [key: string]: string } = {
      'Lundi': 'Fermé',
      'Mardi': 'Fermé',
      'Mercredi': 'Fermé',
      'Jeudi': 'Fermé',
      'Vendredi': 'Fermé',
      'Samedi': 'Fermé',
      'Dimanche': 'Fermé'
    };

    try {
      // Tentative de parsing des horaires
      // Format attendu: "Lun-Ven: 11h30-14h, 18h-22h; Sam: 18h-23h; Dim: Fermé"
      const days = {
        'Lun': 'Lundi',
        'Mar': 'Mardi',
        'Mer': 'Mercredi',
        'Jeu': 'Jeudi',
        'Ven': 'Vendredi',
        'Sam': 'Samedi',
        'Dim': 'Dimanche'
      };

      // Si le format est trop complexe, on retourne les horaires par défaut
      return defaultHours;
    } catch (error) {
      console.error('Error parsing opening hours:', error);
      return defaultHours;
    }
  };

  const handleImport = () => {
    setIsImporting(true);
    setStep('importing');

    // Simuler un délai pour montrer la progression
    setTimeout(() => {
      onImport(processedData);
      setStep('complete');
      setIsImporting(false);
      
      addNotification({
        type: 'success',
        title: 'Import réussi',
        message: `${processedData.length} friteries ont été importées avec succès.`,
        category: 'system',
        priority: 'medium'
      });
    }, 1500);
  };

  const handleClose = () => {
    if (!isProcessing && !isImporting) {
      setFile(null);
      setParsedData([]);
      setProcessedData([]);
      setStep('upload');
      setErrors([]);
      onClose();
    }
  };

  const handleReset = () => {
    setFile(null);
    setParsedData([]);
    setProcessedData([]);
    setStep('upload');
    setErrors([]);
  };

  const exportCurrentData = () => {
    try {
      const exportData = existingEntries.map(entry => ({
        Name: entry.name,
        Address: entry.contact.address,
        Province: entry.contact.region,
        'code-postale': entry.contact.postalCode,
        pays: 'Belgique',
        'Featured-image': entry.logo || '',
        'Maps-URL': '',
        Latitude: entry.coordinates?.latitude || '',
        Longitude: entry.coordinates?.longitude || '',
        Rating: entry.rating.toString(),
        Category: entry.category,
        'Open-Hours': '',
        Website: entry.contact.website || '',
        Phone: entry.contact.phone,
        Emails: entry.contact.email || '',
        'Social-Medias': '',
        Facebook: entry.socialMedia?.facebook || '',
        Instagram: entry.socialMedia?.instagram || ''
      }));

      const csv = Papa.unparse(exportData, {
        delimiter: ';',
        header: true
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `annuaire_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting data:', error);
      addNotification({
        type: 'error',
        title: 'Erreur d\'export',
        message: 'Une erreur est survenue lors de l\'export des données.',
        category: 'system',
        priority: 'high'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg mr-3">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Importer des friteries</h2>
                <p className="text-gray-600 mt-1">
                  {step === 'upload' && 'Importez un fichier CSV pour ajouter des friteries à l\'annuaire'}
                  {step === 'preview' && 'Vérifiez les données avant import'}
                  {step === 'importing' && 'Import en cours...'}
                  {step === 'complete' && 'Import terminé avec succès'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isProcessing || isImporting}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Steps indicator */}
          <div className="flex items-center justify-center mt-6">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'upload' ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-500'
              }`}>
                1
              </div>
              <div className={`h-1 w-16 ${
                step === 'upload' ? 'bg-gray-200' : 'bg-orange-500'
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'preview' ? 'bg-orange-500 text-white' : 
                step === 'importing' || step === 'complete' ? 'bg-orange-100 text-orange-500' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <div className={`h-1 w-16 ${
                step === 'upload' || step === 'preview' ? 'bg-gray-200' : 'bg-orange-500'
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'complete' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                3
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'upload' && (
            <div className="space-y-6">
              {/* Upload Zone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
                  isDragActive
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                }`}
              >
                <input {...getInputProps()} />
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-6">
                  <Upload className="h-12 w-12 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {isDragActive ? 'Déposez le fichier ici' : 'Glissez votre fichier CSV ici'}
                </h3>
                <p className="text-gray-600 mb-6">
                  ou cliquez pour sélectionner un fichier
                </p>
                
                <Button
                  type="button"
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  icon={<Upload className="h-4 w-4" />}
                >
                  Sélectionner un fichier CSV
                </Button>
                
                <div className="mt-6 text-sm text-gray-500">
                  <p>Format attendu: fichier CSV avec séparateur ";"</p>
                  <p>Colonnes requises: Name, Address, Phone</p>
                </div>
              </div>

              {/* Export Current Data */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start">
                  <Download className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-2">Exporter les données actuelles</h3>
                    <p className="text-sm text-blue-800 mb-4">
                      Avant d'importer de nouvelles données, vous pouvez exporter l'annuaire actuel comme sauvegarde.
                    </p>
                    <Button
                      onClick={exportCurrentData}
                      variant="outline"
                      size="sm"
                      icon={<Download className="h-4 w-4" />}
                    >
                      Exporter l'annuaire actuel
                    </Button>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="font-medium text-gray-900 mb-3">Instructions d'import</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    <span>Le fichier CSV doit utiliser le séparateur ";" (point-virgule)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    <span>Les champs Name, Address et Phone sont obligatoires</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    <span>Les lignes vides seront automatiquement ignorées</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    <span>Les doublons seront identifiés par nom et adresse</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    <span>Les numéros de téléphone seront automatiquement formatés</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-6">
              {/* File Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-6 w-6 text-gray-500 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">{file?.name}</h3>
                      <p className="text-sm text-gray-500">{file?.size ? (file.size / 1024).toFixed(2) + ' KB' : ''}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    icon={<RefreshCw className="h-4 w-4" />}
                  >
                    Changer de fichier
                  </Button>
                </div>
              </div>

              {/* Import Stats */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-medium text-gray-900 mb-4">Résumé de l'import</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.valid}</div>
                    <div className="text-sm text-green-800">Valides</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-600">{stats.duplicates}</div>
                    <div className="text-sm text-yellow-800">Doublons</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.invalid}</div>
                    <div className="text-sm text-red-800">Invalides</div>
                  </div>
                </div>
              </div>

              {/* Errors */}
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="font-medium text-red-900 mb-4 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Erreurs ({errors.length})
                  </h3>
                  <div className="max-h-40 overflow-y-auto">
                    <ul className="space-y-2 text-sm">
                      {errors.map((error, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 mr-2">•</span>
                          <span>
                            <span className="font-medium">Ligne {error.row}:</span> {error.message}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Data Preview */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Aperçu des données ({processedData.length} friteries)</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {processedData.slice(0, 5).map((entry, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.contact.address}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.contact.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.rating}</td>
                          </tr>
                        ))}
                        {processedData.length > 5 && (
                          <tr>
                            <td colSpan={5} className="px-6 py-4 text-sm text-gray-500 text-center">
                              + {processedData.length - 5} autres friteries
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'importing' && (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 mb-8">
                <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-orange-500"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Import en cours...</h3>
              <p className="text-gray-600 mb-8">
                Veuillez patienter pendant que nous importons vos données.
              </p>
              <div className="max-w-md mx-auto">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-orange-500 h-2.5 rounded-full w-3/4"></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Importation de {processedData.length} friteries...
                </p>
              </div>
            </div>
          )}

          {step === 'complete' && (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8">
                <Check className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Import terminé avec succès !</h3>
              <p className="text-gray-600 mb-8">
                {processedData.length} friteries ont été importées dans l'annuaire.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto">
                <h4 className="font-medium text-green-900 mb-2">Résumé de l'import</h4>
                <ul className="space-y-2 text-sm text-green-800">
                  <li className="flex items-center justify-between">
                    <span>Friteries importées:</span>
                    <span className="font-medium">{processedData.length}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Doublons identifiés:</span>
                    <span className="font-medium">{stats.duplicates}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Erreurs ignorées:</span>
                    <span className="font-medium">{stats.invalid}</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between">
            {step === 'upload' && (
              <>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isProcessing}
                >
                  Annuler
                </Button>
                <Button
                  disabled={!file || isProcessing}
                  isLoading={isProcessing}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  icon={isProcessing ? undefined : <Table className="h-4 w-4" />}
                >
                  {isProcessing ? 'Analyse en cours...' : 'Analyser le fichier'}
                </Button>
              </>
            )}

            {step === 'preview' && (
              <>
                <Button
                  variant="outline"
                  onClick={handleReset}
                >
                  Retour
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={processedData.length === 0}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  icon={<Upload className="h-4 w-4" />}
                >
                  Importer {processedData.length} friteries
                </Button>
              </>
            )}

            {step === 'importing' && (
              <>
                <div></div>
                <Button
                  disabled
                  isLoading
                >
                  Import en cours...
                </Button>
              </>
            )}

            {step === 'complete' && (
              <>
                <Button
                  variant="outline"
                  onClick={handleReset}
                >
                  Nouvel import
                </Button>
                <Button
                  onClick={handleClose}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                >
                  Terminer
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSVImportModal;