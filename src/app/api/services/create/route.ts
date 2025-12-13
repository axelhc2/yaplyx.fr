import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedSession } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification (déjà fait par le middleware, mais double vérification)
    const session = await getAuthenticatedSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      userId,
      offerId,
      pricePaid,
      durationMonths,
      paymentMethod,
      orderId,
    } = body;

    // Utiliser l'userId de la session pour sécurité
    const authenticatedUserId = session.user.id;
    
    if (authenticatedUserId !== userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Récupérer l'offre
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
    });

    if (!offer) {
      return NextResponse.json(
        { error: 'Offre introuvable' },
        { status: 404 }
      );
    }

    // Calculer la date d'expiration
    const isLifetime = offer.period === 'lifetime';
    let expiresAt: Date | null = null;
    
    if (!isLifetime && durationMonths) {
      expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + durationMonths);
    }

    // Créer le service
    const service = await prisma.service.create({
      data: {
        userId,
        offerId,
        name: offer.name,
        price: offer.price,
        period: offer.period,
        description: offer.description,
        servers: offer.servers,
        group: offer.group,
        rules: offer.rules,
        host: offer.host,
        logs: offer.logs,
        stats: offer.stats,
        support: offer.support,
        pricePaid: pricePaid,
        paymentDate: new Date(),
        durationMonths: isLifetime ? null : durationMonths,
        expiresAt,
        isLifetime,
        active: true,
      },
    });

    // Générer le numéro de facture
    const currentYear = new Date().getFullYear();
    const yearSuffix = currentYear.toString().slice(-2); // 25 pour 2025, 26 pour 2026
    const invoicePrefix = `FR${yearSuffix}`;

    // Trouver le dernier numéro de facture pour cette année
    const lastInvoice = await prisma.invoice.findFirst({
      where: {
        invoicePrefix,
      },
      orderBy: {
        invoiceNumber: 'desc',
      },
    });

    const nextInvoiceNumber = lastInvoice ? lastInvoice.invoiceNumber + 1 : 1;
    const fullInvoiceNumber = `${invoicePrefix}-${String(nextInvoiceNumber).padStart(4, '0')}`;
    const invoiceName = `Facture ${fullInvoiceNumber}`;

    // Créer la facture (status = 1 car le paiement est validé)
    const invoice = await prisma.invoice.create({
      data: {
        serviceId: service.id,
        userId,
        invoiceName,
        invoicePrefix,
        invoiceNumber: nextInvoiceNumber,
        fullInvoiceNumber,
        paymentMethod: paymentMethod || 'stripe',
        price: pricePaid,
        paymentDate: new Date(),
        status: 1, // 1 = payé (le paiement vient d'être validé)
      },
    });

    return NextResponse.json({
      success: true,
      service,
      invoice,
    });
  } catch (error: any) {
    console.error('Erreur lors de la création du service:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création du service' },
      { status: 500 }
    );
  }
}

