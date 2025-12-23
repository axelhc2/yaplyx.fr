import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedSession } from '@/lib/auth-utils';
import { notifySuccess } from '@/lib/Notify';
import { sendPaymentConfirmationEmail } from '@/lib/Mail';
import { generateInvoicePdf } from '@/lib/invoice-pdf';

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

    // Récupérer les informations de l'utilisateur pour la notification
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    // Formater la date de renouvellement
    let renewalDateStr = 'À vie';
    if (expiresAt) {
      renewalDateStr = expiresAt.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }

    // Formater la période de renouvellement
    let renewalPeriod = offer.period;
    if (offer.period === 'month') {
      renewalPeriod = 'Mensuel';
    } else if (offer.period === 'year') {
      renewalPeriod = 'Annuel';
    } else if (offer.period === 'lifetime') {
      renewalPeriod = 'À vie';
    }

    // Formater le prix (Decimal de Prisma)
    const priceValue = typeof pricePaid === 'object' && pricePaid !== null && 'toNumber' in pricePaid
      ? (pricePaid as any).toNumber()
      : typeof pricePaid === 'number'
      ? pricePaid
      : parseFloat(String(pricePaid));
    const formattedPrice = priceValue.toFixed(2).replace('.', ',');

    // Envoyer la notification de nouvelle commande payée (non-bloquant)
    Promise.resolve().then(() => {
      if (user) {
        const orderMessage = `<b>🛒 Nouvelle commande payée</b>

<b>Email:</b> ${user.email}
<b>Prénom:</b> ${user.firstName}
<b>Nom:</b> ${user.lastName}
<b>Offre:</b> ${offer.name}
<b>Date de renouvellement:</b> ${renewalDateStr}
<b>Période de renouvellement:</b> ${renewalPeriod}
<b>Prix:</b> ${formattedPrice} €`;

        notifySuccess(orderMessage).catch((err: any) => {
          console.error('Impossible d\'envoyer la notification de commande:', err);
        });
      }
    });

    // Envoyer l'email de confirmation de paiement avec facture PDF (non-bloquant)
    Promise.resolve().then(async () => {
      try {
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
              name: offer.name,
            },
            invoicePdfBuffer
          );
        }
      } catch (error: any) {
        console.error('Erreur lors de l\'envoi de l\'email de confirmation de paiement:', error);
        // Ne pas bloquer la création du service si l'email échoue
      }
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

