import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Mail, Lock, Shield, Crown, AlertCircle, Check, UserPlus } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import userService from '../../services/userService';

const schema = yup.object({
  name: yup.string().required('Nom requis').min(2, 'Minimum 2 caractères'),
  email: yup.string().email('Email invalide').required('Email requis'),
  password: yup.string()
    .required('Mot de passe requis')
    .min(8, 'Minimum 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Doit contenir une minuscule, majuscule et chiffre'),
  role: yup.string().oneOf(['admin', 'editor'], 'Rôle invalide').required('Rôle requis')
});

type FormData = yup.InferType<typeof schema>;

const CreateUser: React.FC = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      role: 'editor'
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await userService.createAdminUser({
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role as 'admin' | 'editor'
      });
      
      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 5000);
    } catch (error: any) {
      console.error('Error creating user:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('Cette adresse email est déjà utilisée');
      } else if (error.code === 'auth/weak-password') {
        setError('Le mot de passe est trop faible');
      } else {
        setError(error.message || 'Erreur lors de la création de l\'utilisateur');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
        <p className="text-gray-600">Seuls les administrateurs peuvent créer des utilisateurs.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg mr-4">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Créer un utilisateur</h1>
            <p className="text-gray-600">Ajouter un nouvel administrateur ou éditeur</p>
          </div>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">Utilisateur créé avec succès !</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                {...register('name')}
                type="text"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nom complet"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                {...register('email')}
                type="email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="email@exemple.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                {...register('password')}
                type="password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.password.message}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Le mot de passe doit contenir au moins 8 caractères avec une majuscule, une minuscule et un chiffre.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rôle *
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  {...register('role')}
                  type="radio"
                  value="editor"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div className="ml-3 flex items-center">
                  <Shield className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-medium text-gray-900">Éditeur</div>
                    <div className="text-sm text-gray-600">Peut gérer le contenu et les utilisateurs</div>
                  </div>
                </div>
              </label>

              <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  {...register('role')}
                  type="radio"
                  value="admin"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div className="ml-3 flex items-center">
                  <Crown className="h-5 w-5 text-yellow-600 mr-2" />
                  <div>
                    <div className="font-medium text-gray-900">Administrateur</div>
                    <div className="text-sm text-gray-600">Accès complet à toutes les fonctionnalités</div>
                  </div>
                </div>
              </label>
            </div>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.role.message}
              </p>
            )}
          </div>

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              className="flex-1"
              disabled={isLoading}
            >
              Réinitialiser
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              icon={<UserPlus className="h-4 w-4" />}
            >
              {isLoading ? 'Création...' : 'Créer l\'utilisateur'}
            </Button>
          </div>
        </form>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Informations importantes</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Les administrateurs ont accès à toutes les fonctionnalités</li>
            <li>• Les éditeurs peuvent gérer le contenu et les utilisateurs normaux</li>
            <li>• Un email de bienvenue sera envoyé à l'utilisateur</li>
            <li>• L'utilisateur pourra changer son mot de passe lors de sa première connexion</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;