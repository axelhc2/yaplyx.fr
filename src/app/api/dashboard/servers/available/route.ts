import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedSession } from '@/lib/auth-utils';

/**
 * Route API pour récupérer le serveur avec le moins de clusters
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

    // Récupérer tous les serveurs avec le nombre de clusters
    const servers = await prisma.server.findMany({
      include: {
        _count: {
          select: {
            clusters: true,
          },
        },
      },
    });

    if (servers.length === 0) {
      return NextResponse.json(
        { error: 'Aucun serveur disponible' },
        { status: 404 }
      );
    }

    // Trier par nombre de clusters (croissant) et prendre le premier
    servers.sort((a, b) => a._count.clusters - b._count.clusters);
    const selectedServer = servers[0];

    return NextResponse.json({
      server: {
        id: selectedServer.id,
        ip: selectedServer.ip,
        hostname: selectedServer.hostname,
      },
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération du serveur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du serveur' },
      { status: 500 }
    );
  }
}











