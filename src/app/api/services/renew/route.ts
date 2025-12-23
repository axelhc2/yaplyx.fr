import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedSession } from '@/lib/auth-utils';
import { sendPaymentConfirmationEmail } from '@/lib/Mail';
import { generateInvoicePdf } from '@/lib/invoice-pdf';

/**
 * Route API pour renouveler un service existant
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
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
      serviceId,
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

    // Récupérer le service existant
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        userId: userId as number,
      },
      include: {
        offer: true,
      },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service introuvable' },
        { status: 404 }
      );
    }

    // Calculer la nouvelle date d'expiration
    let newExpiresAt: Date | null = null;
    
    if (!service.isLifetime && durationMonths) {
      // Si le service est déjà expiré, partir de maintenant
      // Sinon, partir de la date d'expiration actuelle
      const now = new Date();
      const currentExpiresAt = service.expiresAt ? new Date(service.expiresAt) : now;
      
      if (currentExpiresAt < now) {
        // Service expiré, partir de maintenant
        newExpiresAt = new Date();
        newExpiresAt.setMonth(newExpiresAt.getMonth() + durationMonths);
      } else {
        // Service actif, ajouter à la date d'expiration actuelle
        newExpiresAt = new Date(currentExpiresAt);
        newExpiresAt.setMonth(newExpiresAt.getMonth() + durationMonths);
      }
    }

    // Mettre à jour le service
    const updatedService = await prisma.service.update({
      where: {
        id: serviceId,
      },
      data: {
        active: true,
        expiresAt: newExpiresAt,
        durationMonths: service.isLifetime ? null : (service.durationMonths || 0) + durationMonths,
        pricePaid: pricePaid,
        paymentDate: new Date(),
      },
    });

    // Générer le numéro de facture
    const currentYear = new Date().getFullYear();
    const yearSuffix = currentYear.toString().slice(-2);
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

    // Créer la facture
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
        status: 1, // 1 = payé
      },
    });

    // Envoyer l'email de confirmation de paiement avec facture PDF (non-bloquant)
    Promise.resolve().then(async () => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        });

        if (user) {
          const invoicePdfBuffer = await generateInvoicePdf(invoice.id);
          
          const priceValue = typeof invoice.price === 'object' && invoice.price !== null && 'toNumber' in invoice.price
            ? (invoice.price as any).toNumber()
            : typeof invoice.price === 'number'
            ? invoice.price
            : parseFloat(String(invoice.price));

          await sendPaymentConfirmationEmail(
            {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
            },
            {
              fullInvoiceNumber: invoice.fullInvoiceNumber,
              price: priceValue,
              paymentDate: invoice.paymentDate,
            },
            {
              name: service.name,
              description: service.description,
            },
            {
              name: service.offer.name,
            },
            invoicePdfBuffer
          );
        }
      } catch (error: any) {
        console.error('Erreur lors de l\'envoi de l\'email de confirmation de paiement:', error);
        // Ne pas bloquer le renouvellement si l'email échoue
      }
    });

    return NextResponse.json({
      success: true,
      service: updatedService,
      invoice,
    });
  } catch (error: any) {
    console.error('Erreur lors du renouvellement du service:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors du renouvellement du service' },
      { status: 500 }
    );
  }
}




