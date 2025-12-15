import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getAuthenticatedSession } from '@/lib/auth-utils';
import { t } from '@/lib/i18n-server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthenticatedSession(request);
    if (!session) {
      return NextResponse.json(
        { error: t(request, 'api_error_unauthorized') },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { serviceId, duration, price } = body;

    const userId = typeof session.user.id === 'string' ? parseInt(session.user.id) : session.user.id;

    // Vérifier que le service appartient à l'utilisateur
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        userId: userId as number,
      },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service introuvable' },
        { status: 404 }
      );
    }

    const uuid = randomUUID();

    const response = NextResponse.json({ uuid });
    
    response.cookies.set(`order_${uuid}`, JSON.stringify({
      serviceId,
      duration,
      price,
      type: 'renew',
      createdAt: new Date().toISOString(),
    }), {
      path: '/',
      maxAge: 60 * 60 * 24,
      httpOnly: false,
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    console.error('Erreur lors de la création de la commande de renouvellement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la commande' },
      { status: 500 }
    );
  }
}

