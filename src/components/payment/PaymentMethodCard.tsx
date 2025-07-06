import React, { useState } from 'react';
import { CreditCard, Trash2, Check, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import { PaymentMethod } from '../../services/stripe';
import stripeService from '../../services/stripe';

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  isDefault?: boolean;
  onDelete?: (paymentMethodId: string) => void;
  onSetDefault?: (paymentMethodId: string) => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  paymentMethod,
  isDefault = false,
  onDelete,
  onSetDefault
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await stripeService.deletePaymentMethod(paymentMethod.id);
      onDelete(paymentMethod.id);
    } catch (error) {
      console.error('Error deleting payment method:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const getCardBrandColor = (brand: string) => {
    const colors: { [key: string]: string } = {
      visa: 'bg-blue-500',
      mastercard: 'bg-red-500',
      amex: 'bg-green-500',
      discover: 'bg-orange-500',
      diners: 'bg-purple-500',
      jcb: 'bg-indigo-500',
      unionpay: 'bg-pink-500',
    };
    return colors[brand] || 'bg-gray-500';
  };

  if (!paymentMethod.card) {
    return null;
  }

  return (
    <div className={`bg-white border-2 rounded-xl p-6 transition-all duration-200 ${
      isDefault ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-8 rounded-md flex items-center justify-center ${getCardBrandColor(paymentMethod.card.brand)}`}>
            <CreditCard className="h-5 w-5 text-white" />
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">
                {stripeService.getCardBrandName(paymentMethod.card.brand)}
              </span>
              {isDefault && (
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                  Par défaut
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600">
              •••• •••• •••• {paymentMethod.card.last4}
            </div>
            <div className="text-xs text-gray-500">
              Expire {paymentMethod.card.exp_month.toString().padStart(2, '0')}/{paymentMethod.card.exp_year}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!isDefault && onSetDefault && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetDefault(paymentMethod.id)}
            >
              Définir par défaut
            </Button>
          )}
          
          {!showDeleteConfirm ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                className="text-gray-600"
              >
                Annuler
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                isLoading={isDeleting}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {isDefault && (
        <div className="mt-4 flex items-center text-sm text-orange-700">
          <Check className="h-4 w-4 mr-2" />
          Cette carte sera utilisée pour vos prochains paiements
        </div>
      )}
    </div>
  );
};

export default PaymentMethodCard;