import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getAuthenticatedSession } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthenticatedSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { offerId, duration, price } = body;

    const uuid = randomUUID();

    const response = NextResponse.json({ uuid });
    
    response.cookies.set(`order_${uuid}`, JSON.stringify({
      offerId,
      duration,
      price,
      createdAt: new Date().toISOString(),
    }), {
      path: '/',
      maxAge: 60 * 60 * 24,
      httpOnly: false,
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

