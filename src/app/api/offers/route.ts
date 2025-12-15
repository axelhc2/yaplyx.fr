import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { t } from '@/lib/i18n-server';

export async function GET(request: NextRequest) {
  try {
    const offers = await prisma.offer.findMany({
      orderBy: {
        price: 'asc',
      },
    });

    return NextResponse.json({ offers });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des offres:', error);
    return NextResponse.json(
      { error: t(request, 'api_error_offers') },
      { status: 500 }
    );
  }
}

