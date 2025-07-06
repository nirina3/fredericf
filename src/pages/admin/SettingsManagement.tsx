import React, { useState } from 'react';
import { Settings, Save, Globe, Server, Shield, Bell, Mail, X, Plus, Edit, Trash2, Check, AlertCircle, Database, Key } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

const SettingsManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // États pour les paramètres généraux
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'MonFritkot.be',
    siteDescription: 'Votre plateforme friterie premium',
    contactEmail: 'contact@monfritkot.be',
    supportEmail: 'support@monfritkot.be',
    logoUrl: '/logo.png',
    faviconUrl: '/favicon.ico',
    maintenanceMode: false,
    registrationEnabled: true,
    defaultUserRole: 'user',
    defaultLanguage: 'fr',
    defaultCurrency: 'EUR'
  });

  // États pour les paramètres de sécurité
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuthEnabled: false,
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumber: true,
    passwordRequireSpecial: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15
  });

  // États pour les paramètres de notification
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotificationsEnabled: true,
    welcomeEmailEnabled: true,
    passwordResetEmailEnabled: true,
    subscriptionEmailsEnabled: true,
    marketingEmailsEnabled: true,
    adminNotificationsEnabled: true,
    newUserNotification: true,
    newSubscriptionNotification: true,
    failedPaymentNotification: true
  });

  // États pour les domaines autorisés
  const [allowedDomains, setAllowedDomains] = useState([
    { id: '1', domain: 'monfritkot.be', isActive: true },
    { id: '2', domain: 'fritkot.com', isActive: true },
    { id: '3', domain: 'friterie.be', isActive: false }
  ]);
  const [newDomain, setNewDomain] = useState('');

  // États pour les clés API
  const [apiKeys, setApiKeys] = useState([
    { id: '1', name: 'Production API Key', key: 'pk_live_••••••••••••••••••••••••', createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), lastUsed: new Date(), isActive: true },
    { id: '2', name: 'Development API Key', key: 'pk_test_••••••••••••••••••••••••', createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), isActive: true }
  ]);
  const [newApiKeyName, setNewApiKeyName] = useState('');

  const handleSaveGeneralSettings = () => {
    setIsLoading(true);
    
    // Simuler une sauvegarde
    setTimeout(() => {
      setIsLoading(false);
      addNotification({
        type: 'success',
        title: 'Paramètres sauvegardés',
        message: 'Les paramètres généraux ont été mis à jour avec succès.',
        category: 'system',
        priority: 'low'
      });
    }, 1000);
  };

  const handleSaveSecuritySettings = () => {
    setIsLoading(true);
    
    // Simuler une sauvegarde
    setTimeout(() => {
      setIsLoading(false);
      addNotification({
        type: 'success',
        title: 'Paramètres de sécurité sauvegardés',
        message: 'Les paramètres de sécurité ont été mis à jour avec succès.',
        category: 'security',
        priority: 'medium'
      });
    }, 1000);
  };

  const handleSaveNotificationSettings = () => {
    setIsLoading(true);
    
    // Simuler une sauvegarde
    setTimeout(() => {
      setIsLoading(false);
      addNotification({
        type: 'success',
        title: 'Paramètres de notification sauvegardés',
        message: 'Les paramètres de notification ont été mis à jour avec succès.',
        category: 'system',
        priority: 'low'
      });
    }, 1000);
  };

  const handleAddDomain = () => {
    if (!newDomain.trim()) return;
    
    // Validation simple du domaine
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(newDomain)) {
      addNotification({
        type: 'error',
        title: 'Format invalide',
        message: 'Veuillez entrer un nom de domaine valide.',
        category: 'system',
        priority: 'medium'
      });
      return;
    }

    // Vérifier si le domaine existe déjà
    if (allowedDomains.some(d => d.domain === newDomain)) {
      addNotification({
        type: 'warning',
        title: 'Domaine existant',
        message: 'Ce domaine est déjà dans la liste.',
        category: 'system',
        priority: 'low'
      });
      return;
    }

    setAllowedDomains(prev => [
      ...prev,
      { id: Date.now().toString(), domain: newDomain, isActive: true }
    ]);
    setNewDomain('');
    
    addNotification({
      type: 'success',
      title: 'Domaine ajouté',
      message: `Le domaine ${newDomain} a été ajouté avec succès.`,
      category: 'system',
      priority: 'low'
    });
  };

  const handleToggleDomain = (id: string) => {
    setAllowedDomains(prev => prev.map(domain =>
      domain.id === id ? { ...domain, isActive: !domain.isActive } : domain
    ));
  };

  const handleRemoveDomain = (id: string) => {
    setAllowedDomains(prev => prev.filter(domain => domain.id !== id));
    
    addNotification({
      type: 'info',
      title: 'Domaine supprimé',
      message: 'Le domaine a été supprimé de la liste.',
      category: 'system',
      priority: 'low'
    });
  };

  const handleGenerateApiKey = () => {
    if (!newApiKeyName.trim()) {
      addNotification({
        type: 'warning',
        title: 'Nom requis',
        message: 'Veuillez entrer un nom pour la clé API.',
        category: 'system',
        priority: 'low'
      });
      return;
    }

    // Générer une clé API fictive
    const newKey = {
      id: Date.now().toString(),
      name: newApiKeyName,
      key: `pk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date(),
      lastUsed: null,
      isActive: true
    };

    setApiKeys(prev => [...prev, newKey]);
    setNewApiKeyName('');
    
    addNotification({
      type: 'success',
      title: 'Clé API générée',
      message: 'Une nouvelle clé API a été générée avec succès.',
      category: 'security',
      priority: 'medium'
    });
  };

  const handleToggleApiKey = (id: string) => {
    setApiKeys(prev => prev.map(key =>
      key.id === id ? { ...key, isActive: !key.isActive } : key
    ));
  };

  const handleRemoveApiKey = (id: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== id));
    
    addNotification({
      type: 'info',
      title: 'Clé API supprimée',
      message: 'La clé API a été supprimée avec succès.',
      category: 'security',
      priority: 'medium'
    });
  };

  const handleResetSystem = () => {
    setIsLoading(true);
    
    // Simuler une réinitialisation
    setTimeout(() => {
      setIsLoading(false);
      setShowResetModal(false);
      
      addNotification({
        type: 'success',
        title: 'Système réinitialisé',
        message: 'Le système a été réinitialisé avec succès.',
        category: 'system',
        priority: 'high'
      });
    }, 2000);
  };

  const tabs = [
    { id: 'general', name: 'Général', icon: <Settings className="h-5 w-5" /> },
    { id: 'security', name: 'Sécurité', icon: <Shield className="h-5 w-5" /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell className="h-5 w-5" /> },
    { id: 'domains', name: 'Domaines', icon: <Globe className="h-5 w-5" /> },
    { id: 'api', name: 'API', icon: <Key className="h-5 w-5" /> },
    { id: 'system', name: 'Système', icon: <Server className="h-5 w-5" /> }
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
        </div>
      </div>

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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Paramètres généraux</h2>
                
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email de support
                      </label>
                      <input
                        type="email"
                        value={generalSettings.supportEmail}
                        onChange={(e) => setGeneralSettings({...generalSettings, supportEmail: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Langue par défaut
                      </label>
                      <select
                        value={generalSettings.defaultLanguage}
                        onChange={(e) => setGeneralSettings({...generalSettings, defaultLanguage: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="nl">Nederlands</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Devise par défaut
                      </label>
                      <select
                        value={generalSettings.defaultCurrency}
                        onChange={(e) => setGeneralSettings({...generalSettings, defaultCurrency: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="EUR">Euro (€)</option>
                        <option value="USD">Dollar US ($)</option>
                        <option value="GBP">Livre Sterling (£)</option>
                        <option value="CHF">Franc Suisse (CHF)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rôle utilisateur par défaut
                      </label>
                      <select
                        value={generalSettings.defaultUserRole}
                        onChange={(e) => setGeneralSettings({...generalSettings, defaultUserRole: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="user">Utilisateur</option>
                        <option value="editor">Éditeur</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Mode maintenance</h4>
                        <p className="text-sm text-gray-600">Activer le mode maintenance pour le site</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={generalSettings.maintenanceMode}
                          onChange={() => setGeneralSettings({...generalSettings, maintenanceMode: !generalSettings.maintenanceMode})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Inscriptions</h4>
                        <p className="text-sm text-gray-600">Autoriser les nouvelles inscriptions</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={generalSettings.registrationEnabled}
                          onChange={() => setGeneralSettings({...generalSettings, registrationEnabled: !generalSettings.registrationEnabled})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSaveGeneralSettings}
                      isLoading={isLoading}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      icon={<Save className="h-4 w-4" />}
                    >
                      Sauvegarder
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Paramètres de sécurité</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Longueur minimale du mot de passe
                      </label>
                      <input
                        type="number"
                        min="6"
                        max="32"
                        value={securitySettings.passwordMinLength}
                        onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre maximum de tentatives de connexion
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={securitySettings.maxLoginAttempts}
                        onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Durée de verrouillage (minutes)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="60"
                        value={securitySettings.lockoutDuration}
                        onChange={(e) => setSecuritySettings({...securitySettings, lockoutDuration: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiration de session (minutes)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="1440"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Authentification à deux facteurs</h4>
                        <p className="text-sm text-gray-600">Exiger l'authentification à deux facteurs pour tous les utilisateurs</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securitySettings.twoFactorAuthEnabled}
                          onChange={() => setSecuritySettings({...securitySettings, twoFactorAuthEnabled: !securitySettings.twoFactorAuthEnabled})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Exiger une majuscule</h4>
                        <p className="text-sm text-gray-600">Le mot de passe doit contenir au moins une lettre majuscule</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securitySettings.passwordRequireUppercase}
                          onChange={() => setSecuritySettings({...securitySettings, passwordRequireUppercase: !securitySettings.passwordRequireUppercase})}
                          className="sr-only peer"
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
                          checked={securitySettings.passwordRequireNumber}
                          onChange={() => setSecuritySettings({...securitySettings, passwordRequireNumber: !securitySettings.passwordRequireNumber})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Exiger un caractère spécial</h4>
                        <p className="text-sm text-gray-600">Le mot de passe doit contenir au moins un caractère spécial</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securitySettings.passwordRequireSpecial}
                          onChange={() => setSecuritySettings({...securitySettings, passwordRequireSpecial: !securitySettings.passwordRequireSpecial})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSaveSecuritySettings}
                      isLoading={isLoading}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      icon={<Save className="h-4 w-4" />}
                    >
                      Sauvegarder
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Paramètres de notification</h2>
                
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-6">
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
                            checked={notificationSettings.emailNotificationsEnabled}
                            onChange={() => setNotificationSettings({...notificationSettings, emailNotificationsEnabled: !notificationSettings.emailNotificationsEnabled})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Email de bienvenue</h4>
                          <p className="text-sm text-gray-600">Envoyer un email de bienvenue aux nouveaux utilisateurs</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.welcomeEmailEnabled}
                            onChange={() => setNotificationSettings({...notificationSettings, welcomeEmailEnabled: !notificationSettings.welcomeEmailEnabled})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Email de réinitialisation de mot de passe</h4>
                          <p className="text-sm text-gray-600">Envoyer un email pour réinitialiser le mot de passe</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.passwordResetEmailEnabled}
                            onChange={() => setNotificationSettings({...notificationSettings, passwordResetEmailEnabled: !notificationSettings.passwordResetEmailEnabled})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Emails d'abonnement</h4>
                          <p className="text-sm text-gray-600">Envoyer des emails concernant les abonnements</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.subscriptionEmailsEnabled}
                            onChange={() => setNotificationSettings({...notificationSettings, subscriptionEmailsEnabled: !notificationSettings.subscriptionEmailsEnabled})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Emails marketing</h4>
                          <p className="text-sm text-gray-600">Envoyer des emails marketing et promotionnels</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.marketingEmailsEnabled}
                            onChange={() => setNotificationSettings({...notificationSettings, marketingEmailsEnabled: !notificationSettings.marketingEmailsEnabled})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications administrateur</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Notifications administrateur</h4>
                          <p className="text-sm text-gray-600">Activer les notifications pour les administrateurs</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.adminNotificationsEnabled}
                            onChange={() => setNotificationSettings({...notificationSettings, adminNotificationsEnabled: !notificationSettings.adminNotificationsEnabled})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Nouvel utilisateur</h4>
                          <p className="text-sm text-gray-600">Notifier lors de l'inscription d'un nouvel utilisateur</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.newUserNotification}
                            onChange={() => setNotificationSettings({...notificationSettings, newUserNotification: !notificationSettings.newUserNotification})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Nouvel abonnement</h4>
                          <p className="text-sm text-gray-600">Notifier lors d'un nouvel abonnement</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.newSubscriptionNotification}
                            onChange={() => setNotificationSettings({...notificationSettings, newSubscriptionNotification: !notificationSettings.newSubscriptionNotification})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Échec de paiement</h4>
                          <p className="text-sm text-gray-600">Notifier lors d'un échec de paiement</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.failedPaymentNotification}
                            onChange={() => setNotificationSettings({...notificationSettings, failedPaymentNotification: !notificationSettings.failedPaymentNotification})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSaveNotificationSettings}
                      isLoading={isLoading}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      icon={<Save className="h-4 w-4" />}
                    >
                      Sauvegarder
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Domains Settings */}
            {activeTab === 'domains' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Domaines autorisés</h2>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 text-blue-600 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-blue-800">
                          Domaines autorisés
                        </div>
                        <div className="text-sm text-blue-700">
                          Ces domaines sont autorisés à accéder à l'API et aux ressources protégées.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-6">
                    <input
                      type="text"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      placeholder="exemple.com"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Button
                      onClick={handleAddDomain}
                      icon={<Plus className="h-4 w-4" />}
                    >
                      Ajouter
                    </Button>
                  </div>

                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {allowedDomains.length === 0 ? (
                      <div className="text-center py-8">
                        <Globe className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">Aucun domaine autorisé</p>
                      </div>
                    ) : (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Domaine
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Statut
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {allowedDomains.map((domain) => (
                            <tr key={domain.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {domain.domain}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  domain.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {domain.isActive ? 'Actif' : 'Inactif'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => handleToggleDomain(domain.id)}
                                    className={`p-1 rounded-full ${
                                      domain.isActive 
                                        ? 'text-green-600 hover:bg-green-100' 
                                        : 'text-gray-400 hover:bg-gray-100'
                                    }`}
                                    title={domain.isActive ? 'Désactiver' : 'Activer'}
                                  >
                                    {domain.isActive ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                  </button>
                                  <button
                                    onClick={() => handleRemoveDomain(domain.id)}
                                    className="p-1 rounded-full text-red-600 hover:bg-red-100"
                                    title="Supprimer"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* API Settings */}
            {activeTab === 'api' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Clés API</h2>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <Key className="h-5 w-5 text-blue-600 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-blue-800">
                          Clés API
                        </div>
                        <div className="text-sm text-blue-700">
                          Ces clés permettent d'accéder à l'API de la plateforme. Gardez-les secrètes et ne les partagez jamais.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-6">
                    <input
                      type="text"
                      value={newApiKeyName}
                      onChange={(e) => setNewApiKeyName(e.target.value)}
                      placeholder="Nom de la clé API"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Button
                      onClick={handleGenerateApiKey}
                      icon={<Key className="h-4 w-4" />}
                    >
                      Générer
                    </Button>
                  </div>

                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {apiKeys.length === 0 ? (
                      <div className="text-center py-8">
                        <Key className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">Aucune clé API</p>
                      </div>
                    ) : (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Nom
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Clé
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Créée le
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Statut
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {apiKeys.map((apiKey) => (
                            <tr key={apiKey.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {apiKey.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {apiKey.key}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {apiKey.createdAt.toLocaleDateString('fr-FR')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  apiKey.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {apiKey.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => handleToggleApiKey(apiKey.id)}
                                    className={`p-1 rounded-full ${
                                      apiKey.isActive 
                                        ? 'text-green-600 hover:bg-green-100' 
                                        : 'text-gray-400 hover:bg-gray-100'
                                    }`}
                                    title={apiKey.isActive ? 'Désactiver' : 'Activer'}
                                  >
                                    {apiKey.isActive ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                  </button>
                                  <button
                                    onClick={() => handleRemoveApiKey(apiKey.id)}
                                    className="p-1 rounded-full text-red-600 hover:bg-red-100"
                                    title="Supprimer"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* System Settings */}
            {activeTab === 'system' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Paramètres système</h2>
                
                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-yellow-800">
                          Attention
                        </div>
                        <div className="text-sm text-yellow-700">
                          Les actions dans cette section peuvent affecter l'ensemble du système. Procédez avec prudence.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Base de données</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Optimiser la base de données</h4>
                          <p className="text-sm text-gray-600">Optimiser les tables et les index de la base de données</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Database className="h-4 w-4" />}
                          onClick={() => {
                            addNotification({
                              type: 'success',
                              title: 'Base de données optimisée',
                              message: 'La base de données a été optimisée avec succès.',
                              category: 'system',
                              priority: 'medium'
                            });
                          }}
                        >
                          Optimiser
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Sauvegarder la base de données</h4>
                          <p className="text-sm text-gray-600">Créer une sauvegarde complète de la base de données</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Download className="h-4 w-4" />}
                          onClick={() => {
                            addNotification({
                              type: 'success',
                              title: 'Sauvegarde créée',
                              message: 'La sauvegarde de la base de données a été créée avec succès.',
                              category: 'system',
                              priority: 'medium'
                            });
                          }}
                        >
                          Sauvegarder
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Cache et fichiers</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Vider le cache</h4>
                          <p className="text-sm text-gray-600">Supprimer tous les fichiers de cache</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            addNotification({
                              type: 'success',
                              title: 'Cache vidé',
                              message: 'Le cache a été vidé avec succès.',
                              category: 'system',
                              priority: 'low'
                            });
                          }}
                        >
                          Vider
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Nettoyer les fichiers temporaires</h4>
                          <p className="text-sm text-gray-600">Supprimer les fichiers temporaires inutilisés</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            addNotification({
                              type: 'success',
                              title: 'Fichiers nettoyés',
                              message: 'Les fichiers temporaires ont été nettoyés avec succès.',
                              category: 'system',
                              priority: 'low'
                            });
                          }}
                        >
                          Nettoyer
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="border border-red-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-red-900 mb-4">Zone dangereuse</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-red-900">Réinitialiser le système</h4>
                          <p className="text-sm text-red-700">Réinitialiser le système aux paramètres par défaut</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                          onClick={() => setShowResetModal(true)}
                        >
                          Réinitialiser
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Réinitialiser le système
            </h3>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <div>
                  <div className="text-sm font-medium text-red-800">
                    Attention : Action irréversible
                  </div>
                  <div className="text-sm text-red-700">
                    Cette action va réinitialiser tous les paramètres du système aux valeurs par défaut. Cette action est irréversible.
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              Veuillez taper <span className="font-mono font-bold">RÉINITIALISER</span> pour confirmer.
            </p>

            <div className="mb-6">
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="RÉINITIALISER"
              />
            </div>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowResetModal(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handleResetSystem}
                isLoading={isLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Réinitialiser
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsManagement;