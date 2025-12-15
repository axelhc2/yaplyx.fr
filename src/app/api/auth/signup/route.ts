import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { t } from '@/lib/i18n-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
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

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: t(request, 'api_error_signup_required') },
        { status: 400 }
      );
    }

    if (password.length < 5) {
      return NextResponse.json(
        { error: t(request, 'api_error_signup_password_length') },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: t(request, 'api_error_signup_email_exists') },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur avec toutes les informations
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        phoneCountry: phoneCountry || null,
        phoneNumber: phoneNumber || null,
        companyName: companyName || null,
        vatNumber: vatNumber || null,
        billingAddress: billingAddress || null,
        billingAddress2: billingAddress2 || null,
        billingCity: billingCity || null,
        billingCountry: billingCountry || null,
        billingProvince: billingProvince || null,
        billingPostalCode: billingPostalCode || null,
        emailVerified: false,
      },
    });

    // Créer une session avec Better Auth
    try {
      const sessionResult = await auth.api.signInEmail({
        body: {
          email,
          password,
        },
        headers: request.headers,
      });

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        session: sessionResult,
      });
    } catch (sessionError) {
      // Si la création de session échoue, on retourne quand même le succès de l'inscription
      // L'utilisateur pourra se connecter ensuite
      console.warn('Erreur lors de la création de session:', sessionError);
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        message: t(request, 'api_success_signup'),
      });
    }
  } catch (error: any) {
    console.error('Erreur lors de l\'inscription:', error);
    
    // Gérer les erreurs de contrainte unique
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: t(request, 'api_error_signup_email_exists') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || t(request, 'api_error_signup') },
      { status: 500 }
    );
  }
}

