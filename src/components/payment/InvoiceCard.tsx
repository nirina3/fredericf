import React from 'react';
import { Download, Eye, Calendar, CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';
import Button from '../ui/Button';
import { Invoice } from '../../services/stripe';
import stripeService from '../../services/stripe';

interface InvoiceCardProps {
  invoice: Invoice;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'open':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'void':
      case 'uncollectible':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Payée';
      case 'open':
        return 'En attente';
      case 'void':
        return 'Annulée';
      case 'uncollectible':
        return 'Impayée';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'void':
      case 'uncollectible':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = () => {
    if (invoice.invoice_pdf) {
      window.open(invoice.invoice_pdf, '_blank');
    }
  };

  const handleView = () => {
    if (invoice.hosted_invoice_url) {
      window.open(invoice.hosted_invoice_url, '_blank');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-100 p-2 rounded-lg">
            <CreditCard className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              Facture #{invoice.id.slice(-8).toUpperCase()}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{stripeService.formatDate(invoice.created)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {getStatusIcon(invoice.status)}
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
            {getStatusText(invoice.status)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="text-sm text-gray-600 mb-1">Montant total</div>
          <div className="text-2xl font-bold text-gray-900">
            {stripeService.formatAmount(invoice.amount_paid || invoice.amount_due, invoice.currency)}
          </div>
        </div>
        
        {invoice.amount_due > 0 && invoice.status === 'open' && (
          <div>
            <div className="text-sm text-gray-600 mb-1">Montant dû</div>
            <div className="text-xl font-semibold text-red-600">
              {stripeService.formatAmount(invoice.amount_due, invoice.currency)}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {invoice.status === 'paid' ? 'Payée' : 'En attente de paiement'}
        </div>
        
        <div className="flex items-center space-x-2">
          {invoice.hosted_invoice_url && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleView}
              icon={<Eye className="h-4 w-4" />}
            >
              Voir
            </Button>
          )}
          
          {invoice.invoice_pdf && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              icon={<Download className="h-4 w-4" />}
            >
              Télécharger
            </Button>
          )}
        </div>
      </div>

      {invoice.status === 'open' && invoice.amount_due > 0 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-yellow-600 mr-2" />
            <div>
              <div className="text-sm font-medium text-yellow-800">
                Paiement en attente
              </div>
              <div className="text-sm text-yellow-700">
                Cette facture nécessite un paiement pour éviter l'interruption du service.
              </div>
            </div>
          </div>
          <div className="mt-3">
            <Button
              size="sm"
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
              onClick={handleView}
            >
              Payer maintenant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceCard;