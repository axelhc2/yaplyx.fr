import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedSession } from '@/lib/auth-utils';

/**
 * Route API pour récupérer les détails d'un ticket de support
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

    const resolvedParams = await params;
    const userId = typeof session.user.id === 'string' ? parseInt(session.user.id) : session.user.id;
    const ticketId = parseInt(resolvedParams.id);

    if (isNaN(ticketId)) {
      return NextResponse.json(
        { error: 'ID de ticket invalide' },
        { status: 400 }
      );
    }

    // Récupérer le ticket avec ses réponses
    const ticket = await prisma.support.findFirst({
      where: {
        id: ticketId,
        userId: userId as number,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        replies: {
          orderBy: {
            createdAt: 'asc',
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket introuvable' },
        { status: 404 }
      );
    }

    // Récupérer les informations du service si applicable
    let serviceInfo = null;
    if (ticket.services && ticket.services !== 'none') {
      const serviceId = parseInt(ticket.services);
      if (!isNaN(serviceId)) {
        const service = await prisma.service.findUnique({
          where: { id: serviceId },
          include: {
            offer: {
              select: {
                name: true,
              },
            },
            clusters: {
              select: {
                id: true,
                name: true,
                url: true,
              },
              take: 1,
            },
          },
        });

        if (service) {
          const cluster = service.clusters[0];
          serviceInfo = {
            offerName: service.offer.name,
            clusterName: cluster?.name || null,
            clusterUrl: cluster?.url || null,
            createdAt: service.createdAt,
            hasCluster: service.clusters.length > 0,
          };
        }
      }
    }

    return NextResponse.json({
      ticket: {
        ...ticket,
        serviceInfo,
      },
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération du ticket:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du ticket' },
      { status: 500 }
    );
  }
}

