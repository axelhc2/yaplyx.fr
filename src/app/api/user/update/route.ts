import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      userId,
      firstName,
      lastName,
      phoneCountry,
      phoneNumber,
      companyName,
      vatNumber,
      billingAddress,
      billingAddress2,
      billingCity,
      billingCountry,
      billingProvince,
      billingPostalCode,
    } = body;

    // Vérifier que l'utilisateur met à jour son propre compte
    if (session.user.id !== userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phoneCountry: phoneCountry || undefined,
        phoneNumber: phoneNumber || undefined,
        companyName: companyName || undefined,
        vatNumber: vatNumber || undefined,
        billingAddress: billingAddress || undefined,
        billingAddress2: billingAddress2 || undefined,
        billingCity: billingCity || undefined,
        billingCountry: billingCountry || undefined,
        billingProvince: billingProvince || undefined,
        billingPostalCode: billingPostalCode || undefined,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

