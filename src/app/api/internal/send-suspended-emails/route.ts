import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendServiceSuspendedEmail } from '@/lib/Mail';

/**
 * Route API interne pour envoyer les emails de suspension
 * Appelée depuis le script expire-services.js
 */
export async function POST(request: NextRequest) {
  try {
    // Vérification simple de sécurité (peut être améliorée avec une clé secrète)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.INTERNAL_API_KEY || 'change-me'}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { serviceIds } = body;

    if (!serviceIds || !Array.isArray(serviceIds)) {
      return NextResponse.json(
        { error: 'serviceIds array required' },
        { status: 400 }
      );
    }

    const services = await prisma.service.findMany({
      where: {
        id: {
          in: serviceIds,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        clusters: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
    });

    const results = [];

    for (const service of services) {
      try {
        const serviceUrl = service.clusters && service.clusters.length > 0 
          ? service.clusters[0].url 
          : undefined;

        await sendServiceSuspendedEmail(
          {
            id: service.user.id,
            email: service.user.email,
            firstName: service.user.firstName,
            lastName: service.user.lastName,
          },
          {
            name: service.name,
            url: serviceUrl,
          }
        );

        results.push({ serviceId: service.id, success: true });
      } catch (error: any) {
        console.error(`Erreur lors de l'envoi de l'email pour le service ${service.id}:`, error);
        results.push({ serviceId: service.id, success: false, error: error.message });
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error: any) {
    console.error('Erreur dans send-suspended-emails:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

