import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
      { error: 'Erreur lors de la récupération des offres' },
      { status: 500 }
    );
  }
}

