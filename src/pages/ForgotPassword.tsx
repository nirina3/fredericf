import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, ArrowLeft, Check, AlertCircle, Crown } from 'lucide-react';
import Button from '../components/ui/Button';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/config';

const schema = yup.object({
  email: yup.string().email('Email invalide').required('Email requis')
});

type FormData = yup.InferType<typeof schema>;

const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { register, handleSubmit, formState: { errors }, setError, getValues } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, data.email);
      setEmailSent(true);
    } catch (error: any) {
      console.error('Password reset error:', error);
      if (error.code === 'auth/user-not-found') {
        setError('email', { message: 'Aucun compte associé à cette adresse email' });
      } else if (error.code === 'auth/invalid-email') {
        setError('email', { message: 'Adresse email invalide' });
      } else {
        setError('root', { message: 'Une erreur est survenue. Veuillez réessayer.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    const email = getValues('email');
    if (email) {
      setIsLoading(true);
      try {
        await sendPasswordResetEmail(auth, email);
      } catch (error) {
        console.error('Resend email error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Email envoyé !
            </h2>
            
            <p className="text-gray-600 mb-6">
              Nous avons envoyé un lien de réinitialisation à votre adresse email. 
              Vérifiez votre boîte de réception et suivez les instructions.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium text-blue-900 mb-2">Vous ne trouvez pas l'email ?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Vérifiez votre dossier spam/courrier indésirable</li>
                <li>• L'email peut prendre quelques minutes à arriver</li>
                <li>• Assurez-vous d'avoir saisi la bonne adresse</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleResendEmail}
                variant="outline"
                className="w-full"
                isLoading={isLoading}
              >
                Renvoyer l'email
              </Button>
              
              <Link
                to="/login"
                className="block w-full text-center py-2 text-orange-600 hover:text-orange-700 font-medium"
              >
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-lg">
            <Crown className="h-10 w-10 text-white" />
          </div>
        </div>
        
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Mot de passe oublié ?
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Pas de problème ! Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
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
                {isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <Link
              to="/login"
              className="flex items-center justify-center text-sm text-orange-600 hover:text-orange-500 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;