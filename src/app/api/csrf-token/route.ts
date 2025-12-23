import { NextRequest, NextResponse } from 'next/server';
import { generateCSRFToken } from '@/lib/csrf';

/**
 * Route pour obtenir un token CSRF
 * Accessible uniquement depuis le navigateur (même origine)
 */
export async function GET(request: NextRequest) {
  // Vérifier que la requête vient de la même origine
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host');

  if (!origin && !referer) {
    return new NextResponse(null, { status: 404 });
  }

  // Vérifier l'origine
  let isValidOrigin = false;
  if (origin) {
    try {
      const originUrl = new URL(origin);
      const isLocalhost = process.env.NODE_ENV === 'development' && 
                         (originUrl.hostname === 'localhost' || originUrl.hostname === '127.0.0.1');
      isValidOrigin = originUrl.host === host || isLocalhost;
    } catch (e) {
      return new NextResponse(null, { status: 404 });
    }
  }

  if (referer && !origin) {
    try {
      const refererUrl = new URL(referer);
      const isLocalhost = process.env.NODE_ENV === 'development' && 
                         (refererUrl.hostname === 'localhost' || refererUrl.hostname === '127.0.0.1');
      isValidOrigin = refererUrl.host === host || isLocalhost;
    } catch (e) {
      return new NextResponse(null, { status: 404 });
    }
  }

  if (!isValidOrigin) {
    return new NextResponse(null, { status: 404 });
  }

  // Générer ou récupérer le token CSRF
  const existingToken = request.cookies.get('csrf-token')?.value;
  const token = existingToken || generateCSRFToken();

  const response = NextResponse.json({ csrfToken: token });

  // Définir le cookie CSRF (httpOnly pour sécurité)
  if (!existingToken) {
    response.cookies.set('csrf-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 heures
      path: '/',
    });
  }

  return response;
}











