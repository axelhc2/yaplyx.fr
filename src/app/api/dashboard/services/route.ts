import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedSession } from '@/lib/auth-utils';

/**
 * Route API pour récupérer les services de l'utilisateur avec leurs clusters
 */
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getAuthenticatedSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const userId = typeof session.user.id === 'string' ? parseInt(session.user.id) : session.user.id;

    // Récupérer tous les services de l'utilisateur avec leurs clusters et offres
    const services = await prisma.service.findMany({
      where: {
        userId: userId as number,
      },
      include: {
        offer: {
          select: {
            name: true,
          },
        },
        clusters: {
          select: {
            id: true,
            url: true,
          },
          take: 1, // On prend juste le premier cluster
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ services });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des services:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des services' },
      { status: 500 }
    );
  }
}


