import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { t } from '@/lib/i18n-server';

export async function GET(request: NextRequest) {
  try {
    // Récupérer le token de session depuis les cookies
    const sessionToken = request.cookies.get('better-auth.session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: t(request, 'api_error_unauthorized') },
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
        { error: t(request, 'api_error_session_invalid') },
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
        { error: t(request, 'api_error_session_expired') },
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
      { error: t(request, 'api_error_session') },
      { status: 500 }
    );
  }
}

