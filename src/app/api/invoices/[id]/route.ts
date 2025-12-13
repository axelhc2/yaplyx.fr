import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedSession } from '@/lib/auth-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoiceId = parseInt(id);

    // Vérifier la session (déjà fait par le middleware, mais double vérification)
    const session = await getAuthenticatedSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer la facture
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        service: {
          include: {
            offer: true,
          },
        },
        user: true,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Facture introuvable' },
        { status: 404 }
      );
    }

    // Vérifier que la facture appartient à l'utilisateur
    if (invoice.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    return NextResponse.json({ invoice });
  } catch (error: any) {
    console.error('Erreur lors de la récupération de la facture:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la facture' },
      { status: 500 }
    );
  }
}

