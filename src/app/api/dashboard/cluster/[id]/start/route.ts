import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedSession } from '@/lib/auth-utils';

/**
 * Route API pour démarrer un cluster
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

    // Appeler l'API start du serveur
    const startUrl = `http://${cluster.server.ip}:9000/start/${cluster.url}`;
    
    try {
      const startResponse = await fetch(startUrl, {
        method: 'POST',
      });

      const startData = await startResponse.json();

      if (startData.success) {
        return NextResponse.json({
          success: true,
          message: startData.message || 'Cluster démarré avec succès',
        });
      } else {
        return NextResponse.json(
          { error: 'Erreur lors du démarrage du cluster' },
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
    console.error('Erreur lors du démarrage du cluster:', error);
    return NextResponse.json(
      { error: 'Erreur lors du démarrage du cluster' },
      { status: 500 }
    );
  }
}





