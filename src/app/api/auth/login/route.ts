import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'L\'email et le mot de passe sont requis' },
        { status: 400 }
      );
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Créer une session manuellement car Better Auth n'est pas configuré pour email/password
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 jours

    // Supprimer les anciennes sessions expirées
    await prisma.session.deleteMany({
      where: {
        userId: user.id,
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    // Créer la nouvelle session dans la base de données
    await prisma.session.create({
      data: {
        userId: user.id,
        token: sessionToken,
        expiresAt,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
        userAgent: request.headers.get('user-agent') || null,
      },
    });

    // Créer la réponse avec le cookie de session
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

    // Définir le cookie de session (format Better Auth)
    // Sécurité renforcée : httpOnly, secure, sameSite strict
    response.cookies.set('better-auth.session_token', sessionToken, {
      httpOnly: true, // Empêche l'accès JavaScript (protection XSS)
      secure: process.env.NODE_ENV === 'production', // HTTPS uniquement en production
      sameSite: 'strict', // Protection CSRF renforcée
      expires: expiresAt,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Erreur lors de la connexion:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}

