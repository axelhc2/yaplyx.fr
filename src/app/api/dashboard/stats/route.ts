import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedSession } from '@/lib/auth-utils';

/**
 * Route API pour récupérer les statistiques du dashboard
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

    // Compter les services actifs (active = true)
    const activeServicesCount = await prisma.service.count({
      where: {
        userId: userId as number,
        active: true,
      },
    });

    // Compter les factures non payées (status = 0)
    const unpaidInvoicesCount = await prisma.invoice.count({
      where: {
        userId: userId as number,
        status: 0,
      },
    });

    // Compter les factures payées (status = 1)
    const paidInvoicesCount = await prisma.invoice.count({
      where: {
        userId: userId as number,
        status: 1,
      },
    });

    return NextResponse.json({
      activeServices: activeServicesCount,
      unpaidInvoices: unpaidInvoicesCount,
      paidInvoices: paidInvoicesCount,
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}











