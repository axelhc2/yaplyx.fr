import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedSession } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification (déjà fait par le middleware, mais double vérification)
    const session = await getAuthenticatedSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const uuid = searchParams.get('uuid');

    if (!uuid) {
      return NextResponse.json(
        { error: 'UUID requis' },
        { status: 400 }
      );
    }

    // Récupérer les données depuis les cookies
    const orderData = request.cookies.get(`order_${uuid}`);

    if (!orderData) {
      return NextResponse.json(
        { error: 'Commande introuvable' },
        { status: 404 }
      );
    }

    const order = JSON.parse(orderData.value);

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Erreur lors de la récupération de la commande:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la commande' },
      { status: 500 }
    );
  }
}










