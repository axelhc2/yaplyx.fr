import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getAuthenticatedSession } from '@/lib/auth-utils';

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
    const { offerId, duration, price } = body;

    // Générer un UUID
    const uuid = randomUUID();

    // Créer la réponse
    const response = NextResponse.json({ uuid });
    
    // Stocker les données de commande dans les cookies
    // Utiliser httpOnly: false pour que le cookie soit accessible côté client
    response.cookies.set(`order_${uuid}`, JSON.stringify({
      offerId,
      duration,
      price,
      createdAt: new Date().toISOString(),
    }), {
      path: '/',
      maxAge: 60 * 60 * 24, // 24 heures
      httpOnly: false, // Accessible côté client
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    console.error('Erreur lors de la création de la commande:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la commande' },
      { status: 500 }
    );
  }
}

