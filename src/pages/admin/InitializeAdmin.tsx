import React, { useState, useEffect } from 'react';
import { Crown, Check, AlertCircle, Shield, Users, Database } from 'lucide-react';
import Button from '../../components/ui/Button';
import userService from '../../services/userService';

const InitializeAdmin: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRun, setHasRun] = useState(false);

  const initializeAdminAccount = async () => {
    setIsInitializing(true);
    setError(null);
    
    try {
      // Créer le compte admin principal
      await userService.createQuickAdmin(
        '1nirinanirina2@gmail.com',
        'Administrateur Principal',
        'Admin123!'
      );
      
      setSuccess(true);
      setHasRun(true);
      
      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
      
    } catch (error: any) {
      console.error('Error initializing admin:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('Le compte administrateur existe déjà. Vous pouvez vous connecter.');
      } else {
        setError(error.message || 'Erreur lors de l\'initialisation');
      }
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    // Vérifier si l'initialisation a déjà été effectuée
    const initialized = localStorage.getItem('admin_initialized');
    if (initialized) {
      setHasRun(true);
    }
  }, []);

  const handleInitialize = () => {
    initializeAdminAccount();
    localStorage.setItem('admin_initialized', 'true');
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Compte administrateur créé !
          </h2>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="text-sm text-green-800">
              <div className="font-medium mb-2">Informations de connexion :</div>
              <div>Email: 1nirinanirina2@gmail.com</div>
              <div>Mot de passe: Admin123!</div>
            </div>
          </div>
          
          <p className="text-gray-600 mb-6">
            Redirection vers la page de connexion dans quelques secondes...
          </p>
          
          <Button
            onClick={() => window.location.href = '/login'}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
          >
            Se connecter maintenant
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-orange-500 to-red-600 mb-6">
            <Crown className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Initialisation MonFritkot
          </h1>
          
          <p className="text-lg text-gray-600">
            Configuration du compte administrateur principal
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        <div className="space-y-6 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Ce qui sera créé :
            </h3>
            <ul className="space-y-3 text-sm text-blue-800">
              <li className="flex items-center">
                <Crown className="h-4 w-4 mr-2 text-yellow-600" />
                Compte administrateur principal
              </li>
              <li className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-green-600" />
                Permissions complètes
              </li>
              <li className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-blue-600" />
                Accès à la gestion des utilisateurs
              </li>
            </ul>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className="font-semibold text-orange-900 mb-2">Informations de connexion :</h3>
            <div className="text-sm text-orange-800 space-y-1">
              <div><strong>Email :</strong> 1nirinanirina2@gmail.com</div>
              <div><strong>Mot de passe :</strong> Admin123!</div>
            </div>
            <p className="text-xs text-orange-700 mt-2">
              Vous pourrez changer ces informations après la première connexion.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {!hasRun ? (
            <Button
              onClick={handleInitialize}
              isLoading={isInitializing}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-lg py-4"
              icon={<Crown className="h-5 w-5" />}
            >
              {isInitializing ? 'Initialisation...' : 'Créer le compte administrateur'}
            </Button>
          ) : (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">Initialisation déjà effectuée</span>
                </div>
              </div>
              <Button
                onClick={() => window.location.href = '/login'}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Aller à la connexion
              </Button>
            </div>
          )}
          
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="w-full"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InitializeAdmin;