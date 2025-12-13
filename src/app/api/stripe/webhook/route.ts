import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-11-17.clover',
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Signature manquante' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error('Erreur de signature webhook:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Gérer l'événement checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const orderId = session.metadata?.orderId;
      const userId = session.metadata?.userId ? parseInt(session.metadata.userId) : null;

      if (!orderId || !userId) {
        console.error('Metadata manquante dans la session Stripe');
        return NextResponse.json({ received: true });
      }

      // Récupérer les données de commande depuis les cookies ou créer une route pour les récupérer
      // Pour l'instant, on va créer le service directement depuis les métadonnées
      // Il faudra peut-être stocker les données de commande dans la base de données

      return NextResponse.json({ received: true });
    } catch (error: any) {
      console.error('Erreur lors du traitement du webhook:', error);
      return NextResponse.json({ received: true });
    }
  }

  return NextResponse.json({ received: true });
}

