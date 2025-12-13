import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedSession } from '@/lib/auth-utils';

/**
 * Route API pour récupérer un service spécifique avec ses clusters
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification
    const session = await getAuthenticatedSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const serviceId = parseInt(id);
    const userId = session.user.id;

    // Récupérer le service avec ses clusters
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        userId, // Vérifier que le service appartient à l'utilisateur
      },
      include: {
        clusters: {
          include: {
            server: {
              select: {
                id: true,
                ip: true,
                hostname: true,
              },
            },
          },
        },
      },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service introuvable' },
        { status: 404 }
      );
    }

    return NextResponse.json({ service });
  } catch (error: any) {
    console.error('Erreur lors de la récupération du service:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du service' },
      { status: 500 }
    );
  }
}


