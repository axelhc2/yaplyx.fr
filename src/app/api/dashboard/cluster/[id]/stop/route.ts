import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedSession } from '@/lib/auth-utils';

/**
 * Route API pour arrêter un cluster
 */
export async function POST(
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
    const clusterId = parseInt(id);
    const userId = typeof session.user.id === 'string' ? parseInt(session.user.id) : session.user.id;

    // Récupérer le cluster avec le serveur
    const cluster = await prisma.cluster.findFirst({
      where: {
        id: clusterId,
        userId: userId as number,
      },
      include: {
        server: {
          select: {
            ip: true,
          },
        },
      },
    });

    if (!cluster) {
      return NextResponse.json(
        { error: 'Cluster introuvable' },
        { status: 404 }
      );
    }

    // Appeler l'API stop du serveur
    const stopUrl = `http://${cluster.server.ip}:9000/stop/${cluster.url}`;
    
    try {
      const stopResponse = await fetch(stopUrl, {
        method: 'POST',
      });

      const stopData = await stopResponse.json();

      if (stopData.success) {
        return NextResponse.json({
          success: true,
          message: stopData.message || 'Cluster arrêté avec succès',
        });
      } else {
        return NextResponse.json(
          { error: 'Erreur lors de l\'arrêt du cluster' },
          { status: 500 }
        );
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'appel au serveur:', error);
      return NextResponse.json(
        { error: 'Impossible de contacter le serveur' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Erreur lors de l\'arrêt du cluster:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'arrêt du cluster' },
      { status: 500 }
    );
  }
}





