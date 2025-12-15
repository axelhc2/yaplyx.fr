import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedSession } from '@/lib/auth-utils';

/**
 * Route API pour fermer/rouvrir un ticket de support
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

    const resolvedParams = await params;
    const userId = typeof session.user.id === 'string' ? parseInt(session.user.id) : session.user.id;
    const ticketId = parseInt(resolvedParams.id);

    if (isNaN(ticketId)) {
      return NextResponse.json(
        { error: 'ID de ticket invalide' },
        { status: 400 }
      );
    }

    // Vérifier que le ticket appartient à l'utilisateur
    const ticket = await prisma.support.findFirst({
      where: {
        id: ticketId,
        userId: userId as number,
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket introuvable' },
        { status: 404 }
      );
    }

    // Inverser le statut (fermer si ouvert, rouvrir si fermé)
    const newStatus = ticket.status === 'closed' ? 'answered' : 'closed';

    await prisma.support.update({
      where: { id: ticket.id },
      data: { status: newStatus },
    });

    return NextResponse.json({ 
      success: true,
      status: newStatus,
    });
  } catch (error: any) {
    console.error('Erreur lors de la modification du statut:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la modification du statut' },
      { status: 500 }
    );
  }
}

