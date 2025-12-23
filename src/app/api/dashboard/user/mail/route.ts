import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedSession } from '@/lib/auth-utils';
import { t } from '@/lib/i18n-server';

/**
 * Route API pour récupérer les emails de l'utilisateur connecté
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getAuthenticatedSession(request);
    if (!session) {
      return NextResponse.json(
        { error: t(request, 'api_error_unauthorized') },
        { status: 401 }
      );
    }

    const userId = typeof session.user.id === 'string' ? parseInt(session.user.id) : session.user.id;

    const mails = await prisma.mail.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        subject: true,
        content: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      mails,
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des emails:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la récupération des emails' },
      { status: 500 }
    );
  }
}

