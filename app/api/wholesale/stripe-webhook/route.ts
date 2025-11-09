import { NextResponse } from 'next/server';
import { StripeAdapter } from '@/integrations/stripeAdapter';
import { firestore } from '@/lib/firebaseAdmin';

export const config = {
  api: {
    bodyParser: false
  }
};

export async function POST(request: Request) {
  const payload = await request.arrayBuffer();
  const body = Buffer.from(payload);
  const signature = request.headers.get('stripe-signature');
  const adapter = new StripeAdapter();
  try {
    const event = adapter.verifyWebhookSignature(body, signature, process.env.STRIPE_WEBHOOK_SECRET ?? 'whsec_test');
    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object as { id: string };
      const snapshot = await firestore
        .collection('wholesaleOrders')
        .where('paymentIntentId', '==', intent.id)
        .get();
      for (const doc of snapshot.docs) {
        await doc.ref.update({ status: 'paid', updatedAt: new Date().toISOString() });
      }
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 400 });
  }
}
