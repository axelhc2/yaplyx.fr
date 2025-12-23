import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { t } from '@/lib/i18n-server';
import { notifyInfo } from '@/lib/Notify';

export async function POST(request: NextRequest) {
  try {
    console.log('=== DÉBUT INSCRIPTION ===');
    const body = await request.json();
    console.log('Body reçu:', {
      email: body.email ? 'présent' : 'manquant',
      password: body.password ? 'présent' : 'manquant',
      firstName: body.firstName ? 'présent' : 'manquant',
      lastName: body.lastName ? 'présent' : 'manquant',
      billingCountry: body.billingCountry || 'non renseigné',
    });

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
      console.error('❌ Validation échouée - champs manquants:', { 
        email: !!email, 
        password: !!password, 
        firstName: !!firstName, 
        lastName: !!lastName 
      });
      return NextResponse.json(
        { error: t(request, 'api_error_signup_required') },
        { status: 400 }
      );
    }

    if (password.length < 5) {
      console.error('❌ Validation échouée - mot de passe trop court:', password.length);
      return NextResponse.json(
        { error: t(request, 'api_error_signup_password_length') },
        { status: 400 }
      );
    }

    console.log('✅ Validation OK, vérification de l\'email...');

    // Vérifier si l'email existe déjà
    console.log('Vérification de l\'existence de l\'email:', email);
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.error('❌ Email déjà existant:', email);
      return NextResponse.json(
        { error: t(request, 'api_error_signup_email_exists') },
        { status: 400 }
      );
    }

    console.log('✅ Email disponible, hashage du mot de passe...');
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('✅ Mot de passe hashé, création de l\'utilisateur...');
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

    console.log('✅ Utilisateur créé avec succès, ID:', user.id);

    // Envoyer l'email de bienvenue (non-bloquant)
    Promise.resolve().then(async () => {
      try {
        const { sendWelcomeEmail } = await import('@/lib/Mail');
        await sendWelcomeEmail({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        });
      } catch (error: any) {
        console.error('Erreur lors de l\'envoi de l\'email de bienvenue:', error);
        // Ne pas bloquer l'inscription si l'email échoue
      }
    });

    // Créer une session avec Better Auth
    console.log('Tentative de création de session...');
    let responseData;
    try {
      const sessionResult = await auth.api.signInEmail({
        body: {
          email,
          password,
        },
        headers: request.headers,
      });

      console.log('✅ Session créée avec succès');
      console.log('=== FIN INSCRIPTION (SUCCÈS) ===');
      responseData = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        session: sessionResult,
      });
    } catch (sessionError: any) {
      // Si la création de session échoue, on retourne quand même le succès de l'inscription
      // L'utilisateur pourra se connecter ensuite
      console.warn('⚠️ Erreur lors de la création de session (non bloquant):', sessionError);
      console.warn('Détails de l\'erreur de session:', {
        message: sessionError?.message,
        stack: sessionError?.stack,
      });
      console.log('=== FIN INSCRIPTION (SUCCÈS mais session échouée) ===');
      responseData = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        message: t(request, 'api_success_signup'),
      });
    }

    // Envoyer la notification de nouvelle inscription (après la réponse, non-bloquant)
    // Utiliser Promise.resolve().then() pour s'assurer que c'est vraiment asynchrone et non-bloquant
    Promise.resolve().then(() => {
      // Récupérer l'IP de connexion
      const forwardedFor = request.headers.get('x-forwarded-for');
      const realIp = request.headers.get('x-real-ip');
      const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare
      const connectionIp = cfConnectingIp || forwardedFor?.split(',')[0]?.trim() || realIp || 'Inconnue';

      // Envoyer la notification de nouvelle inscription
      const registrationMessage = `<b>🆕 Nouvelle inscription</b>

<b>Email:</b> ${email}
<b>Prénom:</b> ${firstName}
<b>Nom:</b> ${lastName}
<b>Pays:</b> ${billingCountry || 'Non renseigné'}
<b>IP de connexion:</b> ${connectionIp}`;

      // Envoyer sur Telegram et Teams (ne bloque pas si ça échoue)
      notifyInfo(registrationMessage).catch((err: any) => {
        console.error('Impossible d\'envoyer la notification d\'inscription:', err);
      });
    });

    return responseData;
  } catch (error: any) {
    console.error('❌ ERREUR LORS DE L\'INSCRIPTION ===');
    console.error('Type d\'erreur:', error?.constructor?.name);
    console.error('Message:', error?.message);
    console.error('Code:', error?.code);
    console.error('Stack:', error?.stack);
    console.error('Erreur complète:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    console.error('=== FIN ERREUR ===');
    
    // Gérer les erreurs de contrainte unique
    if (error.code === 'P2002') {
      console.error('❌ Contrainte unique violée (email déjà existant)');
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

