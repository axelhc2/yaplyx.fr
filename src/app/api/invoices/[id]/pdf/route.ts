import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { join } from 'path';
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

    // Formater les prix et dates
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: price % 1 === 0 ? 0 : 2,
      }).format(price);
    };

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    };

    const formatDateShort = (date: string) => {
      return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    };

    const priceText = formatPrice(Number(invoice.price));

    // Calculer la date d'échéance (14 jours après l'émission)
    const paymentDate = new Date(invoice.paymentDate);
    const dueDate = new Date(paymentDate);
    dueDate.setDate(dueDate.getDate() + 14);

    // Construire l'adresse client
    const clientAddress = [
      invoice.user.billingAddress,
      invoice.user.billingAddress2,
      invoice.user.billingCity && invoice.user.billingPostalCode 
        ? `${invoice.user.billingCity}, ${invoice.user.billingPostalCode}`
        : invoice.user.billingCity,
      invoice.user.billingProvince,
      invoice.user.billingCountry || 'France',
    ].filter(Boolean).join('<br>');

    // Lire le logo et le convertir en base64
    let logoBase64 = '';
    try {
      const logoPath = join(process.cwd(), 'src', 'app', 'digmma_dark.png');
      const logoBuffer = readFileSync(logoPath);
      logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    } catch (error) {
      console.error('Erreur lors de la lecture du logo:', error);
    }

    // Générer le HTML exact
    const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Facture ${invoice.fullInvoiceNumber} – Digmma</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; }
    @media print {
      body { background: white !important; margin: 0; padding: 30px 0; }
      .no-print { display: none; }
      .border { border-color: #000 !important; }
    }
    .tabular { font-variant-numeric: tabular-nums; }
  </style>
</head>
<body class="bg-white text-gray-900 leading-relaxed">

  <div class="max-w-4xl mx-auto px-8 py-12">

    <!-- En-tête propre et classique -->
    <div class="flex justify-between items-start border-b-2 border-black pb-6 mb-10">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">FACTURE</h1>
        <p class="text-base font-medium mt-1">N° ${invoice.fullInvoiceNumber}</p>
        <p class="text-xs text-gray-600 mt-3">Date d'émission : ${formatDate(invoice.paymentDate.toString())}</p>
        <p class="text-xs text-gray-600">Date d'échéance : ${formatDate(dueDate.toString())}</p>
      </div>
      <div class="text-right">
        ${logoBase64 ? `<img src="${logoBase64}" alt="Logo Digmma" class="h-12 mb-4" />` : '<div class="h-12 mb-4 text-xl font-bold">DIGMMA</div>'}
      </div>
    </div>

    <!-- Coordonnées en deux colonnes très classiques -->
    <div class="grid grid-cols-2 gap-16 mb-12">
      <!-- Émetteur -->
      <div>
        <p class="font-bold text-sm mb-3">Émetteur</p>
        <p class="font-semibold text-sm">Digmma</p>
        <p class="mt-2 leading-relaxed text-sm">
          Axel CHETAIL<br>
          31 rue de Colombiers<br>
          86100 Châtellerault<br>
          France
        </p>
        <p class="mt-4 text-xs leading-relaxed">
          SIRET : 943 353 342 00018<br>
          Code APE : 59.11B<br>
          TVA non applicable – article 293 B du CGI
        </p>
      </div>

      <!-- Destinataire -->
      <div>
        <p class="font-bold text-sm mb-3">Facturé à</p>
        <p class="font-semibold text-sm">${invoice.user.companyName || `${invoice.user.firstName} ${invoice.user.lastName}`}</p>
        <p class="mt-2 leading-relaxed text-sm">
          ${clientAddress}
        </p>
        <p class="mt-4 text-xs leading-relaxed">
          ${invoice.user.vatNumber ? `N° TVA intracommunautaire : ${invoice.user.vatNumber}<br>` : ''}
          Email : ${invoice.user.email}
        </p>
      </div>
    </div>

    <!-- Tableau ultra classique avec bordures fines -->
    <table class="w-full border-collapse mb-4 text-sm">
      <thead>
        <tr class="border-b-2 border-black">
          <th class="text-left py-4 font-semibold">Description</th>
          <th class="text-center py-4 font-semibold w-20">Qté</th>
          <th class="text-right py-4 font-semibold w-32">Prix unitaire HT</th>
          <th class="text-right py-4 font-semibold w-32">Montant HT</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b border-gray-300">
          <td class="py-6">
            <p class="font-medium">${invoice.service.name}</p>
            <p class="text-gray-600 text-xs mt-1">${invoice.service.description.substring(0, 80)}${invoice.service.description.length > 80 ? '...' : ''}</p>
          </td>
          <td class="text-center font-medium tabular">1</td>
          <td class="text-right font-medium tabular">${priceText}</td>
          <td class="text-right font-semibold tabular">${priceText}</td>
        </tr>

        <!-- Ligne vide pour aérer -->
        <tr>
          <td colspan="4" class="py-4"></td>
        </tr>
      </tbody>
    </table>

    <!-- Total très clair, aligné à droite, style comptable classique -->
    <div class="flex justify-end mt-2">
      <div class="w-96">
        <table class="w-full text-sm">
          <tr>
            <td class="py-2 text-right font-medium">Total HT</td>
            <td class="py-2 text-right font-bold tabular w-32">${priceText}</td>
          </tr>
          <tr class="border-t border-black font-bold text-lg">
            <td class="py-3 text-right">Total à payer</td>
            <td class="py-3 text-right tabular">${priceText}</td>
          </tr>
        </table>
        <p class="text-xs text-gray-600 mt-3">
          TVA non applicable – article 293 B du Code général des impôts
        </p>
      </div>
    </div>
    <div class="text-center text-xs text-gray-500" style="position: absolute; bottom: 30px; left: 0; right: 0; width: 100%;">
      Digmma – SIRET 943 353 342 00018 – 31 rue de Colombiers, 86100 Châtellerault – Page 1/1
    </div>
  </div>
</body>
</html>`;

    // Générer le PDF avec Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer',
      ],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
      },
    });

    await browser.close();

    // Convertir le Buffer en Uint8Array
    const pdfArray = new Uint8Array(pdfBuffer);

    return new Response(pdfArray, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${invoice.fullInvoiceNumber}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Erreur lors de la génération du PDF:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la génération du PDF' },
      { status: 500 }
    );
  }
}
