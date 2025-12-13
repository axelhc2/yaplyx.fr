import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Récupérer le token de session depuis les cookies
    const sessionToken = request.cookies.get('better-auth.session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Trouver la session dans la base de données
    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            firstName: true,
            lastName: true,
            image: true,
            emailVerified: true,
            companyName: true,
            vatNumber: true,
            billingAddress: true,
            billingAddress2: true,
            billingCity: true,
            billingCountry: true,
            billingPostalCode: true,
            billingProvince: true,
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session invalide' },
        { status: 401 }
      );
    }

    // Vérifier si la session est expirée
    if (session.expiresAt < new Date()) {
      // Supprimer la session expirée
      await prisma.session.delete({
        where: { id: session.id },
      });
      
      return NextResponse.json(
        { error: 'Session expirée' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: session.user,
      session: {
        id: session.id,
        expiresAt: session.expiresAt,
      },
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération de la session:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la session' },
      { status: 500 }
    );
  }
}

