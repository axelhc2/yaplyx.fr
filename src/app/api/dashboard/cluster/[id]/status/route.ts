import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedSession } from '@/lib/auth-utils';

/**
 * Route API pour récupérer le statut d'un cluster
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
    const clusterId = parseInt(id);
    const userId = typeof session.user.id === 'string' ? parseInt(session.user.id) : session.user.id;

    // Récupérer le cluster avec le serveur
    const cluster = await prisma.cluster.findFirst({
      where: {
        id: clusterId,
        userId: userId as number, // Vérifier que le cluster appartient à l'utilisateur
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

    // Appeler l'API de statut du serveur
    const statusUrl = `http://${cluster.server.ip}:9000/status/${cluster.url}`;
    
    try {
      const statusResponse = await fetch(statusUrl, {
        method: 'GET',
      });

      const statusData = await statusResponse.json();

      if (statusData.success) {
        return NextResponse.json({
          success: true,
          status: statusData.status,
        });
      } else {
        return NextResponse.json(
          { error: 'Erreur lors de la récupération du statut' },
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
    console.error('Erreur lors de la récupération du statut:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du statut' },
      { status: 500 }
    );
  }
}





