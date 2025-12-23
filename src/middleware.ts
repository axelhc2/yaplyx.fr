import { NextRequest, NextResponse } from 'next/server';
import { verifyCSRFToken } from '@/lib/csrf';

/**
 * Routes API publiques (accessibles depuis n'importe où, sans protection)
 */
const PUBLIC_ROUTES = [
  '/api/ip', // API publique pour récupérer l'IP
];

/**
 * Routes API qui peuvent être appelées depuis le navigateur (même origine)
 * Ces routes sont accessibles depuis le frontend Next.js mais pas depuis curl/externe
 */
const BROWSER_ACCESSIBLE_ROUTES = [
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/logout',
  '/api/auth/session',
  '/api/gravatar',
  '/api/offers',
  '/api/csrf-token', // Route pour obtenir le token CSRF
];

/**
 * Routes API qui nécessitent une vérification spéciale (webhooks externes)
 */
const EXTERNAL_WEBHOOK_ROUTES = [
  '/api/stripe/webhook', // Webhook Stripe utilise sa propre signature
];

/**
 * Vérifie si une route API peut être appelée depuis le navigateur
 */
function isBrowserAccessibleRoute(pathname: string): boolean {
  return BROWSER_ACCESSIBLE_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Vérifie si une route API est un webhook externe
 */
function isExternalWebhookRoute(pathname: string): boolean {
  return EXTERNAL_WEBHOOK_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Vérifie si une route API est publique (accessible sans protection)
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Vérifie que la requête vient de la même origine (bloque curl, Postman, etc.)
 * Autorise uniquement les requêtes depuis le navigateur Next.js (même domaine)
 * 
 * Protection contre :
 * - curl (pas d'origine/referer)
 * - Postman (origine différente)
 * - Requêtes externes
 * - Scripts malveillants
 */
function isSameOriginRequest(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host');
  const userAgent = request.headers.get('user-agent');
  
  // Si pas d'origine, pas de referer, et pas de user-agent → probablement curl → bloquer
  if (!origin && !referer && !userAgent) {
    return false;
  }

  // Si pas d'origine ni de referer mais user-agent présent → suspect → bloquer
  if (!origin && !referer) {
    return false;
  }

  // Vérifier que l'origine correspond au host actuel
  if (origin) {
    try {
      const originUrl = new URL(origin);
      // Autoriser si l'origine correspond au host actuel
      // ou si c'est localhost en développement
      const isLocalhost = process.env.NODE_ENV === 'development' && 
                         (originUrl.hostname === 'localhost' || originUrl.hostname === '127.0.0.1');
      const isSameHost = originUrl.host === host;
      
      // Autoriser aussi si le hostname correspond (ignore le port pour plus de flexibilité)
      const isSameHostname = originUrl.hostname === host?.split(':')[0];
      
      if (isSameHost || isLocalhost || isSameHostname) {
        return true;
      }
    } catch (e) {
      // URL invalide → bloquer
      return false;
    }
  }

  // Vérifier le referer si pas d'origine
  if (referer && !origin) {
    try {
      const refererUrl = new URL(referer);
      const isLocalhost = process.env.NODE_ENV === 'development' && 
                         (refererUrl.hostname === 'localhost' || refererUrl.hostname === '127.0.0.1');
      const isSameHost = refererUrl.host === host;
      
      // Autoriser aussi si le hostname correspond (ignore le port pour plus de flexibilité)
      const isSameHostname = refererUrl.hostname === host?.split(':')[0];
      
      if (isSameHost || isLocalhost || isSameHostname) {
        return true;
      }
    } catch (e) {
      return false;
    }
  }

  // Aucune vérification réussie → bloquer
  return false;
}

/**
 * Vérifie la présence d'un cookie de session
 */
function hasSessionCookie(request: NextRequest): boolean {
  const sessionToken = request.cookies.get('better-auth.session_token')?.value;
  return !!sessionToken && sessionToken.length > 0;
}

/**
 * Vérifie le token CSRF pour les requêtes modifiantes (POST, PUT, DELETE, PATCH)
 */
function verifyCSRFForMutatingRequest(request: NextRequest): boolean {
  const method = request.method;
  
  // Seulement pour les méthodes qui modifient les données
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return true; // Pas besoin de CSRF pour GET, HEAD, OPTIONS
  }

  // Récupérer le token depuis le header
  const csrfToken = 
    request.headers.get('x-csrf-token') || 
    request.headers.get('csrf-token');

  // Récupérer le token depuis le cookie
  const cookieToken = request.cookies.get('csrf-token')?.value;

  // Vérifier le token
  return verifyCSRFToken(csrfToken, cookieToken);
}

/**
 * Ajoute les headers de sécurité HTTP
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Protection XSS
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Content Security Policy (CSP)
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none';"
  );
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=()'
  );

  return response;
}

/**
 * Middleware Next.js pour protéger toutes les routes API
 * 
 * Bloque l'accès direct aux API depuis :
 * - curl
 * - Postman
 * - Requêtes externes
 * - Scripts malveillants
 * 
 * Autorise uniquement :
 * - Requêtes depuis le navigateur Next.js (même origine)
 * - Webhooks avec signature valide
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ne protéger que les routes API
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Laisser passer les routes publiques (accessibles sans protection)
  if (isPublicRoute(pathname)) {
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // Laisser passer les webhooks externes (ils ont leur propre système de vérification)
  if (isExternalWebhookRoute(pathname)) {
    return NextResponse.next();
  }

  // Laisser passer la route de vérification des clusters (gère sa propre restriction IP)
  if (pathname.startsWith('/api/check/offers/')) {
    return NextResponse.next();
  }

  // Pour les routes accessibles depuis le navigateur, vérifier la même origine
  if (isBrowserAccessibleRoute(pathname)) {
    // Routes d'authentification : vérification plus souple (l'utilisateur n'est pas encore authentifié)
    const isAuthRoute = pathname.startsWith('/api/auth/login') || 
                        pathname.startsWith('/api/auth/signup') ||
                        pathname.startsWith('/api/csrf-token');
    
    // Pour les routes d'auth, vérifier seulement qu'il y a un user-agent (pas curl)
    if (isAuthRoute) {
      const userAgent = request.headers.get('user-agent');
      if (!userAgent) {
        // Pas de user-agent = probablement curl → bloquer
        return new NextResponse(
          JSON.stringify({ error: 'Requête non autorisée' }),
          { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      // Si user-agent présent, autoriser (même origine vérifiée côté client)
    } else {
      // Pour les autres routes, vérifier strictement la même origine
      const sameOrigin = isSameOriginRequest(request);
      if (!sameOrigin) {
        // Log pour debug (uniquement en développement)
        if (process.env.NODE_ENV === 'development') {
          console.log('Middleware: Requête bloquée - origine différente', {
            pathname,
            origin: request.headers.get('origin'),
            referer: request.headers.get('referer'),
            host: request.headers.get('host'),
            userAgent: request.headers.get('user-agent'),
          });
        }
        return new NextResponse(null, { status: 404 });
      }
    }

    // Vérifier CSRF pour les requêtes modifiantes (sauf routes d'auth)
    const isMutating = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method);
    if (isMutating && !isAuthRoute) {
      const csrfValid = verifyCSRFForMutatingRequest(request);
      if (!csrfValid) {
        return new NextResponse(null, { status: 404 });
      }
    }

    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // Pour toutes les autres routes API (sensibles) :
  // 1. Vérifier la même origine (bloque curl/externe)
  if (!isSameOriginRequest(request)) {
    // Retourner une 404 Next.js standard pour masquer l'existence de l'API
    return new NextResponse(null, { status: 404 });
  }

  // 2. Vérifier la présence du cookie de session
  if (!hasSessionCookie(request)) {
    // Retourner une 404 Next.js standard pour masquer l'existence de l'API
    return new NextResponse(null, { status: 404 });
  }

  // 3. Vérifier CSRF pour les requêtes modifiantes
  const isMutating = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method);
  if (isMutating) {
    const csrfValid = verifyCSRFForMutatingRequest(request);
    if (!csrfValid) {
      return new NextResponse(null, { status: 404 });
    }
  }

  // La requête est valide (même origine + session + CSRF si mutating)
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

/**
 * Configuration du middleware
 * Applique le middleware à toutes les routes API
 * 
 * Note: Avec Next.js 15.5+, on peut utiliser le runtime Node.js
 * pour éviter les problèmes de compatibilité avec Edge Runtime
 */
export const config = {
  matcher: [
    '/api/:path*',
  ],
  // Utiliser le runtime Node.js pour éviter les problèmes avec node:module
  // Le middleware reste léger (vérification de cookie uniquement)
  runtime: 'nodejs',
};








