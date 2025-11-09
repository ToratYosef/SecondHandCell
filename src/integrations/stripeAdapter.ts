import Stripe from 'stripe';

export interface StripePayment {
  clientSecret: string;
  paymentIntentId: string;
}

export class StripeAdapter {
  private client: Stripe;

  constructor(apiKey = process.env.STRIPE_SECRET_KEY ?? 'sk_test_mock') {
    this.client = new Stripe(apiKey, { apiVersion: '2024-06-20' });
  }

  async createWholesaleIntent(amount: number, currency: string, metadata: Record<string, string>): Promise<StripePayment> {
    const intent = await this.client.paymentIntents.create({
      amount,
      currency,
      metadata,
      automatic_payment_methods: { enabled: true }
    });

    return {
      clientSecret: intent.client_secret ?? '',
      paymentIntentId: intent.id
    };
  }

  verifyWebhookSignature(payload: string | Buffer, header: string | null | undefined, endpointSecret: string) {
    return this.client.webhooks.constructEvent(payload, header ?? '', endpointSecret);
  }
}
