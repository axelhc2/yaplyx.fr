import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedSession } from '@/lib/auth-utils';

/**
 * Route API pour récupérer les tickets de support de l'utilisateur
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

    // Récupérer le paramètre de recherche (subject)
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search') || '';

    // Construire la requête avec filtrage optionnel
    const whereClause: any = {
      userId: userId as number,
    };

    // Si un terme de recherche est fourni, filtrer par subject
    if (searchTerm) {
      whereClause.subject = {
        contains: searchTerm,
      };
    }

    // Récupérer tous les tickets de l'utilisateur avec les informations des services
    const tickets = await prisma.support.findMany({
      where: whereClause,
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Pour chaque ticket, récupérer les informations du service si applicable
    const ticketsWithServiceInfo = await Promise.all(
      tickets.map(async (ticket) => {
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

        return {
          ...ticket,
          serviceInfo,
        };
      })
    );

    return NextResponse.json({ tickets: ticketsWithServiceInfo });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des tickets:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des tickets' },
      { status: 500 }
    );
  }
}

