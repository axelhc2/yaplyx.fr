import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedSession } from '@/lib/auth-utils';

/**
 * Route API pour récupérer les paramètres de l'utilisateur
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

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: userId as number },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneCountry: true,
        phoneNumber: true,
        companyName: true,
        vatNumber: true,
        billingAddress: true,
        billingAddress2: true,
        billingCity: true,
        billingCountry: true,
        billingProvince: true,
        billingPostalCode: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur introuvable' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des paramètres:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paramètres' },
      { status: 500 }
    );
  }
}

/**
 * Route API pour mettre à jour les paramètres de l'utilisateur
 */
export async function PUT(request: NextRequest) {
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
    const body = await request.json();

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: userId as number },
      data: {
        firstName: body.firstName || undefined,
        lastName: body.lastName || undefined,
        phoneCountry: body.phoneCountry || null,
        phoneNumber: body.phoneNumber || null,
        companyName: body.companyName || null,
        vatNumber: body.vatNumber || null,
        billingAddress: body.billingAddress || null,
        billingAddress2: body.billingAddress2 || null,
        billingCity: body.billingCity || null,
        billingCountry: body.billingCountry || null,
        billingProvince: body.billingProvince || null,
        billingPostalCode: body.billingPostalCode || null,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneCountry: true,
        phoneNumber: true,
        companyName: true,
        vatNumber: true,
        billingAddress: true,
        billingAddress2: true,
        billingCity: true,
        billingCountry: true,
        billingProvince: true,
        billingPostalCode: true,
      },
    });

    return NextResponse.json({ 
      success: true,
      user: updatedUser 
    });
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour des paramètres:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des paramètres' },
      { status: 500 }
    );
  }
}

