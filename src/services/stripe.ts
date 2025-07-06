import { loadStripe } from '@stripe/stripe-js';

// Configuration Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

export interface Subscription {
  id: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  plan: {
    id: string;
    amount: number;
    currency: string;
    interval: string;
  };
}

export interface Customer {
  id: string;
  email: string;
  name: string;
  payment_methods: PaymentMethod[];
  subscriptions: Subscription[];
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export interface Invoice {
  id: string;
  amount_paid: number;
  amount_due: number;
  currency: string;
  status: string;
  created: number;
  invoice_pdf: string;
  hosted_invoice_url: string;
}

class StripeService {
  private stripe: any = null;

  async getStripe() {
    if (!this.stripe) {
      this.stripe = await stripePromise;
    }
    return this.stripe;
  }

  // Créer un client Stripe
  async createCustomer(email: string, name: string): Promise<Customer> {
    try {
      const response = await fetch('/api/stripe/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      });

      if (!response.ok) {
        throw new Error('Failed to create customer');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  // Créer une session de checkout
  async createCheckoutSession(priceId: string, customerId?: string): Promise<{ sessionId: string }> {
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          customerId,
          successUrl: `${window.location.origin}/subscription?success=true`,
          cancelUrl: `${window.location.origin}/subscription?canceled=true`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  // Rediriger vers Stripe Checkout
  async redirectToCheckout(sessionId: string): Promise<void> {
    const stripe = await this.getStripe();
    if (!stripe) {
      throw new Error('Stripe not loaded');
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) {
      throw error;
    }
  }

  // Créer un Setup Intent pour sauvegarder une méthode de paiement
  async createSetupIntent(customerId: string): Promise<{ client_secret: string }> {
    try {
      const response = await fetch('/api/stripe/create-setup-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create setup intent');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating setup intent:', error);
      throw error;
    }
  }

  // Confirmer un Setup Intent
  async confirmSetupIntent(clientSecret: string, paymentMethod: any): Promise<any> {
    const stripe = await this.getStripe();
    if (!stripe) {
      throw new Error('Stripe not loaded');
    }

    return await stripe.confirmSetupIntent(clientSecret, {
      payment_method: paymentMethod,
    });
  }

  // Récupérer les méthodes de paiement d'un client
  async getPaymentMethods(customerId: string): Promise<PaymentMethod[]> {
    try {
      const response = await fetch(`/api/stripe/customers/${customerId}/payment-methods`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }

      const data = await response.json();
      return data.payment_methods;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  }

  // Supprimer une méthode de paiement
  async deletePaymentMethod(paymentMethodId: string): Promise<void> {
    try {
      const response = await fetch(`/api/stripe/payment-methods/${paymentMethodId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete payment method');
      }
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  }

  // Créer un abonnement
  async createSubscription(customerId: string, priceId: string, paymentMethodId?: string): Promise<Subscription> {
    try {
      const response = await fetch('/api/stripe/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          priceId,
          paymentMethodId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  // Mettre à jour un abonnement
  async updateSubscription(subscriptionId: string, priceId: string): Promise<Subscription> {
    try {
      const response = await fetch(`/api/stripe/subscriptions/${subscriptionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  // Annuler un abonnement
  async cancelSubscription(subscriptionId: string, immediately: boolean = false): Promise<Subscription> {
    try {
      const response = await fetch(`/api/stripe/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ immediately }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  // Récupérer les factures d'un client
  async getInvoices(customerId: string): Promise<Invoice[]> {
    try {
      const response = await fetch(`/api/stripe/customers/${customerId}/invoices`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }

      const data = await response.json();
      return data.invoices;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }

  // Créer un portail de facturation
  async createBillingPortalSession(customerId: string): Promise<{ url: string }> {
    // Since this is a demo application without a backend,
    // we'll simulate the billing portal functionality
    throw new Error('Le portail de facturation nécessite une configuration backend. Cette fonctionnalité sera disponible avec l\'intégration complète de Stripe.');
  }

  // Rediriger vers le portail de facturation
  async redirectToBillingPortal(customerId: string): Promise<void> {
    try {
      const { url } = await this.createBillingPortalSession(customerId);
      window.location.href = url;
    } catch (error) {
      // For demo purposes, show a user-friendly message instead of throwing
      console.warn('Billing portal not available in demo mode:', error);
      throw new Error('Le portail de facturation Stripe nécessite une configuration backend complète. Contactez le support pour plus d\'informations.');
    }
  }

  // Récupérer les prix disponibles
  async getPrices(): Promise<any[]> {
    try {
      const response = await fetch('/api/stripe/prices');
      
      if (!response.ok) {
        throw new Error('Failed to fetch prices');
      }

      const data = await response.json();
      return data.prices;
    } catch (error) {
      console.error('Error fetching prices:', error);
      throw error;
    }
  }

  // Vérifier le statut d'un paiement
  async retrievePaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    try {
      const response = await fetch(`/api/stripe/payment-intents/${paymentIntentId}`);
      
      if (!response.ok) {
        throw new Error('Failed to retrieve payment intent');
      }

      return await response.json();
    } catch (error) {
      console.error('Error retrieving payment intent:', error);
      throw error;
    }
  }

  // Formater le montant pour l'affichage
  formatAmount(amount: number, currency: string = 'EUR'): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  }

  // Formater la date
  formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // Obtenir le nom de la marque de carte
  getCardBrandName(brand: string): string {
    const brands: { [key: string]: string } = {
      visa: 'Visa',
      mastercard: 'Mastercard',
      amex: 'American Express',
      discover: 'Discover',
      diners: 'Diners Club',
      jcb: 'JCB',
      unionpay: 'UnionPay',
    };
    return brands[brand] || brand.charAt(0).toUpperCase() + brand.slice(1);
  }

  // Obtenir l'icône de la marque de carte
  getCardBrandIcon(brand: string): string {
    // Retourne l'URL de l'icône ou une classe CSS
    const icons: { [key: string]: string } = {
      visa: '💳',
      mastercard: '💳',
      amex: '💳',
      discover: '💳',
      diners: '💳',
      jcb: '💳',
      unionpay: '💳',
    };
    return icons[brand] || '💳';
  }
}

export const stripeService = new StripeService();
export default stripeService;