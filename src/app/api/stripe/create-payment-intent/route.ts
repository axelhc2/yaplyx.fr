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
    const { amount, orderId, userId, userEmail, successUrl, cancelUrl } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Montant invalide' },
        { status: 400 }
      );
    }

    // Vérifier que l'userId correspond à la session
    if (userId && userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Créer une Checkout Session Stripe
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Commande ${orderId}`,
            },
            unit_amount: Math.round(amount * 100), // Convertir en centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${request.headers.get('origin')}/order/payments/${orderId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${request.headers.get('origin')}/order/payments/${orderId}/cancel`,
      customer_email: userEmail,
      metadata: {
        orderId: orderId || '',
        userId: userId || '',
      },
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error: any) {
    console.error('Erreur lors de la création de la Checkout Session:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création du paiement' },
      { status: 500 }
    );
  }
}

