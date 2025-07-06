import React, { useState } from 'react';
import { Settings, Save, AlertCircle, Check, Globe, Mail, Bell, Lock, Database, Users, Trash2, Shield } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

const SettingsManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // État pour les paramètres généraux
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'MonFritkot',
    siteDescription: 'Votre plateforme de référence pour la friterie belge',
    contactEmail: 'contact@monfritkot.be',
    logoUrl: '',
    faviconUrl: '',
    primaryColor: '#f97316',
    secondaryColor: '#ef4444',
    language: 'fr',
    timezone: 'Europe/Brussels',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h'
  });

  // État pour les paramètres de notification
  const [notificationSettings, setNotificationSettings] = useState({
    enableEmailNotifications: true,
    enablePushNotifications: false,
    adminEmailNotifications: true,
    userRegistrationNotifications: true,
    subscriptionNotifications: true,
    commentNotifications: true,
    dailyDigest: false,
    weeklyReport: true
  });

  // État pour les paramètres de sécurité
  const [securitySettings, setSecuritySettings] = useState({
    enableTwoFactor: false,
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumber: true,
    passwordRequireSpecial: false,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    enableCaptcha: true
  });

  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Simuler une sauvegarde
    setTimeout(() => {
      setIsLoading(false);
      
      addNotification({
        type: 'success',
        title: 'Paramètres sauvegardés',
        message: 'Les paramètres ont été mis à jour avec succès.',
        category: 'system',
        priority: 'medium'
      });
    }, 1000);
  };

  const handleResetSettings = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      // Réinitialiser les paramètres selon l'onglet actif
      if (activeTab === 'general') {
        setGeneralSettings({
          siteName: 'MonFritkot',
          siteDescription: 'Votre plateforme de référence pour la friterie belge',
          contactEmail: 'contact@monfritkot.be',
          logoUrl: '',
          faviconUrl: '',
          primaryColor: '#f97316',
          secondaryColor: '#ef4444',
          language: 'fr',
          timezone: 'Europe/Brussels',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '24h'
        });
      } else if (activeTab === 'notifications') {
        setNotificationSettings({
          enableEmailNotifications: true,
          enablePushNotifications: false,
          adminEmailNotifications: true,
          userRegistrationNotifications: true,
          subscriptionNotifications: true,
          commentNotifications: true,
          dailyDigest: false,
          weeklyReport: true
        });
      } else if (activeTab === 'security') {
        setSecuritySettings({
          enableTwoFactor: false,
          passwordMinLength: 8,
          passwordRequireUppercase: true,
          passwordRequireNumber: true,
          passwordRequireSpecial: false,
          sessionTimeout: 60,
          maxLoginAttempts: 5,
          enableCaptcha: true
        });
      }
      
      addNotification({
        type: 'info',
        title: 'Paramètres réinitialisés',
        message: 'Les paramètres ont été réinitialisés aux valeurs par défaut.',
        category: 'system',
        priority: 'medium'
      });
    }
  };

  const tabs = [
    { id: 'general', name: 'Général', icon: <Globe className="h-5 w-5" /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell className="h-5 w-5" /> },
    { id: 'security', name: 'Sécurité', icon: <Lock className="h-5 w-5" /> },
    { id: 'database', name: 'Base de données', icon: <Database className="h-5 w-5" /> },
    { id: 'users', name: 'Utilisateurs', icon: <Users className="h-5 w-5" /> },
    { id: 'advanced', name: 'Avancé', icon: <Settings className="h-5 w-5" /> }
  ];

  if (currentUser?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
        <p className="text-gray-600">Seuls les administrateurs peuvent accéder aux paramètres du système.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Settings className="h-6 w-6 mr-2" />
              Paramètres du système
            </h1>
            <p className="text-gray-600 mt-2">
              Configurez les paramètres globaux de la plateforme
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleResetSettings}
            >
              Réinitialiser
            </Button>
            <Button
              onClick={handleSaveSettings}
              isLoading={isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              icon={<Save className="h-4 w-4" />}
            >
              Sauvegarder
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Paramètres généraux</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom du site
                      </label>
                      <input
                        type="text"
                        value={generalSettings.siteName}
                        onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email de contact
                      </label>
                      <input
                        type="email"
                        value={generalSettings.contactEmail}
                        onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description du site
                    </label>
                    <textarea
                      value={generalSettings.siteDescription}
                      onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Couleur primaire
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={generalSettings.primaryColor}
                          onChange={(e) => setGeneralSettings({...generalSettings, primaryColor: e.target.value})}
                          className="h-10 w-10 border-0 p-0"
                        />
                        <input
                          type="text"
                          value={generalSettings.primaryColor}
                          onChange={(e) => setGeneralSettings({...generalSettings, primaryColor: e.target.value})}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Couleur secondaire
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={generalSettings.secondaryColor}
                          onChange={(e) => setGeneralSettings({...generalSettings, secondaryColor: e.target.value})}
                          className="h-10 w-10 border-0 p-0"
                        />
                        <input
                          type="text"
                          value={generalSettings.secondaryColor}
                          onChange={(e) => setGeneralSettings({...generalSettings, secondaryColor: e.target.value})}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Langue par défaut
                      </label>
                      <select
                        value={generalSettings.language}
                        onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="nl">Nederlands</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fuseau horaire
                      </label>
                      <select
                        value={generalSettings.timezone}
                        onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Europe/Brussels">Europe/Brussels</option>
                        <option value="Europe/Paris">Europe/Paris</option>
                        <option value="Europe/Amsterdam">Europe/Amsterdam</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Paramètres de notification</h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications par email</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Notifications par email</h4>
                          <p className="text-sm text-gray-600">Activer l'envoi d'emails pour les notifications</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={notificationSettings.enableEmailNotifications}
                            onChange={() => setNotificationSettings({
                              ...notificationSettings, 
                              enableEmailNotifications: !notificationSettings.enableEmailNotifications
                            })}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Notifications administrateur</h4>
                          <p className="text-sm text-gray-600">Envoyer des notifications aux administrateurs</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={notificationSettings.adminEmailNotifications}
                            onChange={() => setNotificationSettings({
                              ...notificationSettings, 
                              adminEmailNotifications: !notificationSettings.adminEmailNotifications
                            })}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications système</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Nouvelles inscriptions</h4>
                          <p className="text-sm text-gray-600">Notifier lors de nouvelles inscriptions</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={notificationSettings.userRegistrationNotifications}
                            onChange={() => setNotificationSettings({
                              ...notificationSettings, 
                              userRegistrationNotifications: !notificationSettings.userRegistrationNotifications
                            })}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Abonnements</h4>
                          <p className="text-sm text-gray-600">Notifier lors de changements d'abonnement</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={notificationSettings.subscriptionNotifications}
                            onChange={() => setNotificationSettings({
                              ...notificationSettings, 
                              subscriptionNotifications: !notificationSettings.subscriptionNotifications
                            })}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Rapports</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Rapport quotidien</h4>
                          <p className="text-sm text-gray-600">Recevoir un résumé quotidien des activités</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={notificationSettings.dailyDigest}
                            onChange={() => setNotificationSettings({
                              ...notificationSettings, 
                              dailyDigest: !notificationSettings.dailyDigest
                            })}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Rapport hebdomadaire</h4>
                          <p className="text-sm text-gray-600">Recevoir un résumé hebdomadaire des statistiques</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={notificationSettings.weeklyReport}
                            onChange={() => setNotificationSettings({
                              ...notificationSettings, 
                              weeklyReport: !notificationSettings.weeklyReport
                            })}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Paramètres de sécurité</h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Authentification</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Authentification à deux facteurs</h4>
                          <p className="text-sm text-gray-600">Exiger l'authentification à deux facteurs pour les administrateurs</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={securitySettings.enableTwoFactor}
                            onChange={() => setSecuritySettings({
                              ...securitySettings, 
                              enableTwoFactor: !securitySettings.enableTwoFactor
                            })}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">CAPTCHA</h4>
                          <p className="text-sm text-gray-600">Activer CAPTCHA pour les formulaires publics</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={securitySettings.enableCaptcha}
                            onChange={() => setSecuritySettings({
                              ...securitySettings, 
                              enableCaptcha: !securitySettings.enableCaptcha
                            })}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Politique de mot de passe</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Longueur minimale du mot de passe
                        </label>
                        <input
                          type="number"
                          min="6"
                          max="32"
                          value={securitySettings.passwordMinLength}
                          onChange={(e) => setSecuritySettings({
                            ...securitySettings, 
                            passwordMinLength: parseInt(e.target.value)
                          })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Exiger une majuscule</h4>
                          <p className="text-sm text-gray-600">Le mot de passe doit contenir au moins une majuscule</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={securitySettings.passwordRequireUppercase}
                            onChange={() => setSecuritySettings({
                              ...securitySettings, 
                              passwordRequireUppercase: !securitySettings.passwordRequireUppercase
                            })}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Exiger un chiffre</h4>
                          <p className="text-sm text-gray-600">Le mot de passe doit contenir au moins un chiffre</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={securitySettings.passwordRequireNumber}
                            onChange={() => setSecuritySettings({
                              ...securitySettings, 
                              passwordRequireNumber: !securitySettings.passwordRequireNumber
                            })}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sessions</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Délai d'expiration de session (minutes)
                        </label>
                        <input
                          type="number"
                          min="5"
                          max="1440"
                          value={securitySettings.sessionTimeout}
                          onChange={(e) => setSecuritySettings({
                            ...securitySettings, 
                            sessionTimeout: parseInt(e.target.value)
                          })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre maximum de tentatives de connexion
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={securitySettings.maxLoginAttempts}
                          onChange={(e) => setSecuritySettings({
                            ...securitySettings, 
                            maxLoginAttempts: parseInt(e.target.value)
                          })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Database Settings */}
            {activeTab === 'database' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Paramètres de base de données</h2>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-yellow-800">
                        Attention
                      </div>
                      <div className="text-sm text-yellow-700">
                        Les modifications de la base de données peuvent affecter l'intégrité des données. Procédez avec prudence.
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance</h3>
                    <div className="space-y-4">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          addNotification({
                            type: 'success',
                            title: 'Sauvegarde terminée',
                            message: 'La sauvegarde de la base de données a été effectuée avec succès.',
                            category: 'system',
                            priority: 'medium'
                          });
                        }}
                      >
                        Sauvegarder la base de données
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          if (confirm('Êtes-vous sûr de vouloir optimiser la base de données ? Cette opération peut prendre plusieurs minutes.')) {
                            addNotification({
                              type: 'success',
                              title: 'Optimisation terminée',
                              message: 'La base de données a été optimisée avec succès.',
                              category: 'system',
                              priority: 'medium'
                            });
                          }
                        }}
                      >
                        Optimiser la base de données
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full text-red-600 border-red-300 hover:bg-red-50"
                        onClick={() => {
                          alert('Fonctionnalité désactivée en mode démo');
                        }}
                      >
                        Vider le cache
                      </Button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Données</h3>
                    <div className="space-y-4">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          alert('Fonctionnalité désactivée en mode démo');
                        }}
                      >
                        Exporter les données
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          alert('Fonctionnalité désactivée en mode démo');
                        }}
                      >
                        Importer des données
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full text-red-600 border-red-300 hover:bg-red-50"
                        onClick={() => {
                          alert('Fonctionnalité désactivée en mode démo');
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Réinitialiser les données
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Settings */}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Paramètres utilisateurs</h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Inscription</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Autoriser les inscriptions</h4>
                          <p className="text-sm text-gray-600">Permettre aux nouveaux utilisateurs de s'inscrire</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Vérification par email</h4>
                          <p className="text-sm text-gray-600">Exiger la vérification de l'email lors de l'inscription</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Approbation manuelle</h4>
                          <p className="text-sm text-gray-600">Exiger l'approbation d'un administrateur</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Rôles et permissions</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rôle par défaut pour les nouveaux utilisateurs
                        </label>
                        <select
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          defaultValue="user"
                        >
                          <option value="user">Utilisateur</option>
                          <option value="editor">Éditeur</option>
                          <option value="admin">Administrateur</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Autoriser la modification du profil</h4>
                          <p className="text-sm text-gray-600">Permettre aux utilisateurs de modifier leur profil</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Settings */}
            {activeTab === 'advanced' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Paramètres avancés</h2>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-red-800">
                        Attention
                      </div>
                      <div className="text-sm text-red-700">
                        Ces paramètres sont destinés aux utilisateurs avancés. Des modifications incorrectes peuvent affecter le fonctionnement du site.
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Mode maintenance</h4>
                          <p className="text-sm text-gray-600">Activer le mode maintenance (site inaccessible)</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message de maintenance
                        </label>
                        <textarea
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          placeholder="Site en maintenance. Nous serons de retour bientôt."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performances</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Activer le cache</h4>
                          <p className="text-sm text-gray-600">Améliore les performances du site</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Compression des assets</h4>
                          <p className="text-sm text-gray-600">Compresser les fichiers CSS et JavaScript</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h3>
                    <div className="space-y-4">
                      <Button
                        variant="outline"
                        className="w-full text-red-600 border-red-300 hover:bg-red-50"
                        onClick={() => {
                          alert('Fonctionnalité désactivée en mode démo');
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Réinitialiser le site
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManagement;