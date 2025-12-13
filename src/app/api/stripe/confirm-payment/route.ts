import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getAuthenticatedSession } from '@/lib/auth-utils';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-11-17.clover',
});

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification (déjà fait par le middleware, mais double vérification)
    const session = await getAuthenticatedSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { paymentIntentId } = body;

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'PaymentIntent ID requis' },
        { status: 400 }
      );
    }

    // Récupérer le PaymentIntent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      return NextResponse.json({
        success: true,
        paymentIntent: paymentIntent,
      });
    }

    return NextResponse.json({
      success: false,
      status: paymentIntent.status,
    });
  } catch (error: any) {
    console.error('Erreur lors de la confirmation du paiement:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la confirmation du paiement' },
      { status: 500 }
    );
  }
}

