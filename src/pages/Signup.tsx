import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Eye, EyeOff, Mail, Lock, User, Crown, Check, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

const schema = yup.object({
  name: yup.string()
    .required('Nom requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  email: yup.string()
    .email('Email invalide')
    .required('Email requis'),
  password: yup.string()
    .required('Mot de passe requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  confirmPassword: yup.string()
    .required('Confirmation du mot de passe requise')
    .oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas'),
  acceptTerms: yup.boolean()
    .oneOf([true], 'Vous devez accepter les conditions d\'utilisation'),
  newsletter: yup.boolean()
});

type FormData = yup.InferType<typeof schema>;

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, setError, watch } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      newsletter: true
    }
  });

  const watchedPassword = watch('password');

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
      case 1: return { text: 'Très faible', color: 'text-red-500' };
      case 2: return { text: 'Faible', color: 'text-orange-500' };
      case 3: return { text: 'Moyen', color: 'text-yellow-500' };
      case 4: return { text: 'Fort', color: 'text-green-500' };
      case 5: return { text: 'Très fort', color: 'text-green-600' };
      default: return { text: '', color: '' };
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await signup(data.email, data.password, data.name);
      setStep(2);
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('email', { message: 'Cette adresse email est déjà utilisée' });
      } else if (error.code === 'auth/weak-password') {
        setError('password', { message: 'Le mot de passe est trop faible' });
      } else {
        setError('root', { message: 'Une erreur est survenue lors de l\'inscription' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    'Accès à la galerie premium',
    'Contenu exclusif et formations',
    'Support client prioritaire',
    'Communauté active de professionnels',
    'Outils de gestion avancés',
    'Mises à jour en temps réel'
  ];

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Inscription réussie !
            </h2>
            
            <p className="text-gray-600 mb-6">
              Votre compte a été créé avec succès. Vous pouvez maintenant profiter de votre période d'essai gratuite de 7 jours.
            </p>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <Crown className="h-5 w-5 text-orange-600 mr-2" />
                <span className="text-sm font-medium text-orange-800">
                  Essai gratuit activé - 7 jours restants
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => navigate('/')}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                Découvrir MonFritkot
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/pricing')}
                className="w-full"
              >
                Voir les abonnements
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2 rounded-lg mr-3">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900">MonFritkot</span>
                <span className="text-sm text-orange-600">.be</span>
              </div>
            </div>
            
            <h2 className="text-3xl font-extrabold text-gray-900">
              Créer votre compte
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Déjà inscrit ?{' '}
              <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">
                Se connecter
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom complet *
                </label>
                <div className="mt-1 relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    {...register('name')}
                    type="text"
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Votre nom complet"
                  />
                </div>
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Adresse email *
                </label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    {...register('email')}
                    type="email"
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="votre@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe *
                </label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                
                {/* Password Strength */}
                {watchedPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Force du mot de passe:</span>
                      <span className={getPasswordStrengthText(passwordStrength(watchedPassword)).color}>
                        {getPasswordStrengthText(passwordStrength(watchedPassword)).text}
                      </span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full transition-all duration-300 ${
                          passwordStrength(watchedPassword) <= 1 ? 'bg-red-500' :
                          passwordStrength(watchedPassword) <= 2 ? 'bg-orange-500' :
                          passwordStrength(watchedPassword) <= 3 ? 'bg-yellow-500' :
                          passwordStrength(watchedPassword) <= 4 ? 'bg-green-500' : 'bg-green-600'
                        }`}
                        style={{ width: `${(passwordStrength(watchedPassword) / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmer le mot de passe *
                </label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms and Newsletter */}
              <div className="space-y-3">
                <div className="flex items-start">
                  <input
                    {...register('acceptTerms')}
                    type="checkbox"
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mt-0.5"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    J'accepte les{' '}
                    <Link to="/terms" className="text-orange-600 hover:text-orange-500">
                      conditions d'utilisation
                    </Link>{' '}
                    et la{' '}
                    <Link to="/privacy" className="text-orange-600 hover:text-orange-500">
                      politique de confidentialité
                    </Link>
                    {' *'}
                  </label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.acceptTerms.message}
                  </p>
                )}

                <div className="flex items-start">
                  <input
                    {...register('newsletter')}
                    type="checkbox"
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mt-0.5"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Je souhaite recevoir les actualités et conseils par email
                  </label>
                </div>
              </div>

              {errors.root && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {errors.root.message}
                  </p>
                </div>
              )}

              <div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  isLoading={isLoading}
                >
                  {isLoading ? 'Création du compte...' : 'Créer mon compte'}
                </Button>
              </div>
            </form>

            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">Ou continuer avec</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full" disabled>
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Benefits */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-red-600">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute top-20 right-20 w-32 h-32 bg-yellow-300 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-orange-300 rounded-full blur-3xl opacity-20"></div>
          
          <div className="relative h-full flex items-center justify-center p-12">
            <div className="max-w-md text-white">
              <div className="mb-8">
                <Crown className="h-16 w-16 text-yellow-300 mb-6" />
                <h2 className="text-4xl font-bold mb-4">
                  Rejoignez MonFritkot
                </h2>
                <p className="text-xl text-orange-100">
                  La plateforme de référence pour les professionnels de la friterie belge
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-yellow-300 mb-4">
                  Avantages inclus :
                </h3>
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <div className="bg-green-500 rounded-full p-1 mr-3">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-orange-100">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Crown className="h-5 w-5 text-yellow-300 mr-2" />
                  <span className="font-semibold">Essai gratuit 7 jours</span>
                </div>
                <p className="text-sm text-orange-200">
                  Testez toutes nos fonctionnalités premium sans engagement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;