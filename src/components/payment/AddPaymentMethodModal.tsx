import React, { useState, useEffect } from 'react';
import { X, CreditCard, Lock, AlertCircle, Check } from 'lucide-react';
import Button from '../ui/Button';
import stripeService from '../../services/stripe';

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
  onSuccess: () => void;
}

const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({
  isOpen,
  onClose,
  customerId,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [stripe, setStripe] = useState<any>(null);
  const [elements, setElements] = useState<any>(null);
  const [cardElement, setCardElement] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      initializeStripe();
    }
  }, [isOpen]);

  const initializeStripe = async () => {
    try {
      const stripeInstance = await stripeService.getStripe();
      setStripe(stripeInstance);

      const elementsInstance = stripeInstance.elements({
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#ea580c',
            colorBackground: '#ffffff',
            colorText: '#1f2937',
            colorDanger: '#ef4444',
            fontFamily: 'Inter, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px',
          },
        },
      });
      setElements(elementsInstance);

      const cardElementInstance = elementsInstance.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#1f2937',
            '::placeholder': {
              color: '#9ca3af',
            },
          },
          invalid: {
            color: '#ef4444',
            iconColor: '#ef4444',
          },
        },
        hidePostalCode: true,
      });

      setCardElement(cardElementInstance);

      // Mount the card element
      setTimeout(() => {
        const cardContainer = document.getElementById('card-element');
        if (cardContainer && cardElementInstance) {
          cardElementInstance.mount('#card-element');
        }
      }, 100);
    } catch (error) {
      console.error('Error initializing Stripe:', error);
      setError('Erreur lors de l\'initialisation du paiement');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements || !cardElement) {
      setError('Stripe n\'est pas encore chargé');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create setup intent
      const { client_secret } = await stripeService.createSetupIntent(customerId);

      // Confirm setup intent
      const { error, setupIntent } = await stripe.confirmSetupIntent(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Customer Name', // You might want to get this from user input
          },
        },
      });

      if (error) {
        setError(error.message);
      } else if (setupIntent && setupIntent.status === 'succeeded') {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
          resetModal();
        }, 1500);
      }
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setError(null);
    setSuccess(false);
    setIsLoading(false);
    if (cardElement) {
      cardElement.clear();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      resetModal();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Ajouter une carte</h2>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Carte ajoutée avec succès !
              </h3>
              <p className="text-gray-600">
                Votre nouvelle méthode de paiement est maintenant disponible.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Lock className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-blue-800">
                      Paiement sécurisé
                    </div>
                    <div className="text-sm text-blue-700">
                      Vos informations de carte sont cryptées et sécurisées par Stripe.
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Element */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Informations de la carte
                </label>
                <div className="border border-gray-300 rounded-lg p-4 bg-white">
                  <div id="card-element" className="min-h-[40px]">
                    {/* Stripe Elements will mount here */}
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <div className="text-sm text-red-800">{error}</div>
                  </div>
                </div>
              )}

              {/* Security Features */}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Cryptage SSL</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>PCI DSS</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>3D Secure</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Stripe Verified</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  disabled={!stripe || !elements}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  icon={<CreditCard className="h-4 w-4" />}
                >
                  {isLoading ? 'Ajout en cours...' : 'Ajouter la carte'}
                </Button>
              </div>

              {/* Terms */}
              <div className="text-xs text-gray-500 text-center">
                En ajoutant cette carte, vous acceptez nos{' '}
                <a href="/terms" className="text-orange-600 hover:text-orange-700">
                  conditions d'utilisation
                </a>{' '}
                et notre{' '}
                <a href="/privacy" className="text-orange-600 hover:text-orange-700">
                  politique de confidentialité
                </a>
                .
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPaymentMethodModal;