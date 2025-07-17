import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Mail, Phone, MapPin, Camera, Save, Edit3, Crown, Shield, Calendar, CreditCard, Settings, Bell, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile, updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const profileSchema = yup.object({
  name: yup.string().required('Nom requis').min(2, 'Minimum 2 caractères'),
  email: yup.string().email('Email invalide').required('Email requis'),
  phone: yup.string().optional(),
  address: yup.string().optional(),
  city: yup.string().optional(),
  postalCode: yup.string().optional(),
  bio: yup.string().max(500, 'Maximum 500 caractères').optional()
});

const passwordSchema = yup.object({
  currentPassword: yup.string().required('Mot de passe actuel requis'),
  newPassword: yup.string()
    .required('Nouveau mot de passe requis')
    .min(8, 'Minimum 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Doit contenir une minuscule, majuscule et chiffre'),
  confirmPassword: yup.string()
    .required('Confirmation requise')
    .oneOf([yup.ref('newPassword')], 'Les mots de passe ne correspondent pas')
});

type ProfileFormData = yup.InferType<typeof profileSchema>;
type PasswordFormData = yup.InferType<typeof passwordSchema>;

const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [successMessage, setSuccessMessage] = useState('');

  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors }, reset: resetProfile } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      address: currentUser?.address || '',
      city: currentUser?.city || '',
      postalCode: currentUser?.postalCode || '',
      bio: currentUser?.bio || ''
    }
  });

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPassword } = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema)
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      // Update Firebase Auth profile
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: data.name
        });
      }

      // Update Firestore user document
      await updateDoc(doc(db, 'users', currentUser.id), {
        ...data,
        updatedAt: new Date()
      });

      setSuccessMessage('Profil mis à jour avec succès !');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    if (!auth.currentUser) return;
    
    setIsLoading(true);
    try {
      await updatePassword(auth.currentUser, data.newPassword);
      setSuccessMessage('Mot de passe mis à jour avec succès !');
      resetPassword();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      console.error('Error updating password:', error);
      if (error.code === 'auth/requires-recent-login') {
        alert('Veuillez vous reconnecter pour changer votre mot de passe.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profil', icon: <User className="h-5 w-5" /> },
    { id: 'subscription', name: 'Abonnement', icon: <Crown className="h-5 w-5" /> },
    { id: 'security', name: 'Sécurité', icon: <Shield className="h-5 w-5" /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell className="h-5 w-5" /> }
  ];

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
          <p className="text-gray-600">Vous devez être connecté pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 px-8 py-12 text-white relative">
            <div className="absolute top-4 right-4">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                currentUser.subscription.status === 'active' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-yellow-500 text-gray-900'
              }`}>
                {currentUser.subscription.plan.name}
              </span>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-24 h-24 rounded-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-white" />
                  )}
                </div>
                <button className="absolute bottom-0 right-0 bg-white text-orange-600 p-2 rounded-full shadow-lg hover:bg-orange-50 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              
              <div>
                <h1 className="text-3xl font-bold mb-2">{currentUser.name}</h1>
                <p className="text-orange-100 mb-2">{currentUser.email}</p>
                <div className="flex items-center space-x-4 text-sm text-orange-200">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Membre depuis {new Date(currentUser.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </span>
                  <span className="flex items-center">
                    <Crown className="h-4 w-4 mr-1" />
                    {currentUser.subscription.plan.name === 'Basic' ? 'Abonné' : 
                     currentUser.subscription.plan.name === 'Premium' ? 'Client Accro' :
                     currentUser.subscription.plan.name === 'Pro' ? 'Friterie Premium' :
                     currentUser.subscription.plan.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800">{successMessage}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
                        ? 'bg-orange-100 text-orange-700 font-medium'
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
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Informations personnelles</h2>
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      variant="outline"
                      icon={<Edit3 className="h-4 w-4" />}
                    >
                      {isEditing ? 'Annuler' : 'Modifier'}
                    </Button>
                  </div>

                  <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom complet *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <input
                            {...registerProfile('name')}
                            disabled={!isEditing}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                        {profileErrors.name && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {profileErrors.name.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <input
                            {...registerProfile('email')}
                            disabled={!isEditing}
                            type="email"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                        {profileErrors.email && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {profileErrors.email.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <input
                            {...registerProfile('phone')}
                            disabled={!isEditing}
                            type="tel"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-500"
                            placeholder="+32 2 123 45 67"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Code postal
                        </label>
                        <input
                          {...registerProfile('postalCode')}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-500"
                          placeholder="1000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Adresse
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <input
                            {...registerProfile('address')}
                            disabled={!isEditing}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-500"
                            placeholder="Rue de la Friterie 123"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ville
                        </label>
                        <input
                          {...registerProfile('city')}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-500"
                          placeholder="Bruxelles"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        {...registerProfile('bio')}
                        disabled={!isEditing}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                        placeholder="Parlez-nous de vous..."
                      />
                      {profileErrors.bio && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {profileErrors.bio.message}
                        </p>
                      )}
                    </div>

                    {isEditing && (
                      <div className="flex justify-end space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            resetProfile();
                          }}
                        >
                          Annuler
                        </Button>
                        <Button
                          type="submit"
                          isLoading={isLoading}
                          icon={<Save className="h-4 w-4" />}
                          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                        >
                          Sauvegarder
                        </Button>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* Subscription Tab */}
              {activeTab === 'subscription' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Mon abonnement</h2>
                  
                  <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white mb-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{currentUser.subscription.plan.name}</h3>
                        <p className="text-orange-100 mb-4">
                          {currentUser.subscription.status === 'active' ? 'Actif' : 'Inactif'} • 
                          Expire le {new Date(currentUser.subscription.endDate).toLocaleDateString('fr-FR')}
                        </p>
                        <div className="text-3xl font-bold">
                          €{currentUser.subscription.plan.price}
                          <span className="text-lg font-normal text-orange-200">/{currentUser.subscription.plan.interval}</span>
                        </div>
                      </div>
                      <Crown className="h-16 w-16 text-yellow-300" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Fonctionnalités incluses</h4>
                      <ul className="space-y-3">
                        {currentUser.subscription.plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-3" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Informations de facturation</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <span className="text-gray-600">Prochain paiement</span>
                          <span className="font-medium">
                            {currentUser.subscription.nextPayment 
                              ? new Date(currentUser.subscription.nextPayment).toLocaleDateString('fr-FR')
                              : 'N/A'
                            }
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <span className="text-gray-600">Montant</span>
                          <span className="font-medium">€{currentUser.subscription.amount}</span>
                        </div>
                        <div className="flex items-center justify-between py-3">
                          <span className="text-gray-600">Méthode de paiement</span>
                          <span className="font-medium flex items-center">
                            <CreditCard className="h-4 w-4 mr-2" />
                            •••• 1234
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex space-x-4">
                    <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                      Changer de plan
                    </Button>
                    <Button variant="outline">
                      Gérer la facturation
                    </Button>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Sécurité</h2>
                  
                  <div className="space-y-8">
                    {/* Change Password */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Changer le mot de passe</h3>
                      <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mot de passe actuel *
                          </label>
                          <div className="relative">
                            <input
                              {...registerPassword('currentPassword')}
                              type={showPasswords.current ? 'text' : 'password'}
                              className="w-full pr-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility('current')}
                              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                              {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                          {passwordErrors.currentPassword && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              {passwordErrors.currentPassword.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nouveau mot de passe *
                          </label>
                          <div className="relative">
                            <input
                              {...registerPassword('newPassword')}
                              type={showPasswords.new ? 'text' : 'password'}
                              className="w-full pr-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility('new')}
                              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                              {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                          {passwordErrors.newPassword && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              {passwordErrors.newPassword.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirmer le nouveau mot de passe *
                          </label>
                          <div className="relative">
                            <input
                              {...registerPassword('confirmPassword')}
                              type={showPasswords.confirm ? 'text' : 'password'}
                              className="w-full pr-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility('confirm')}
                              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                              {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                          {passwordErrors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              {passwordErrors.confirmPassword.message}
                            </p>
                          )}
                        </div>

                        <Button
                          type="submit"
                          isLoading={isLoading}
                          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                        >
                          Mettre à jour le mot de passe
                        </Button>
                      </form>
                    </div>

                    {/* Security Settings */}
                    <div className="border-t border-gray-200 pt-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres de sécurité</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">Authentification à deux facteurs</h4>
                            <p className="text-sm text-gray-600">Ajoutez une couche de sécurité supplémentaire</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Activer
                          </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">Sessions actives</h4>
                            <p className="text-sm text-gray-600">Gérez vos sessions de connexion</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Voir tout
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Préférences de notification</h2>
                  
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications par email</h3>
                      <div className="space-y-4">
                        {[
                          { id: 'newsletter', label: 'Newsletter hebdomadaire', description: 'Recevez nos dernières actualités' },
                          { id: 'updates', label: 'Mises à jour produit', description: 'Nouvelles fonctionnalités et améliorations' },
                          { id: 'billing', label: 'Facturation', description: 'Factures et informations de paiement' },
                          { id: 'security', label: 'Sécurité', description: 'Alertes de sécurité importantes' }
                        ].map((notification) => (
                          <div key={notification.id} className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{notification.label}</h4>
                              <p className="text-sm text-gray-600">{notification.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications push</h3>
                      <div className="space-y-4">
                        {[
                          { id: 'messages', label: 'Nouveaux messages', description: 'Messages de la communauté' },
                          { id: 'mentions', label: 'Mentions', description: 'Quand quelqu\'un vous mentionne' },
                          { id: 'comments', label: 'Commentaires', description: 'Réponses à vos publications' }
                        ].map((notification) => (
                          <div key={notification.id} className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{notification.label}</h4>
                              <p className="text-sm text-gray-600">{notification.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                        Sauvegarder les préférences
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;