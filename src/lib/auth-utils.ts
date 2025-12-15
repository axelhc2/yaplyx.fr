import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

/**
 * Vérifie si l'utilisateur est authentifié et retourne la session
 * @param request - La requête Next.js
 * @returns La session utilisateur ou null si non authentifié
 */
export async function getAuthenticatedSession(request: NextRequest) {
  try {
    // Méthode principale : vérifier manuellement le cookie de session
    // Plus fiable dans le middleware et les routes API
    const sessionToken = request.cookies.get('better-auth.session_token')?.value;
    
    if (!sessionToken) {
      // Essayer avec better-auth comme fallback (pour compatibilité)
      try {
        const session = await auth.api.getSession({ headers: request.headers });
        if (session?.user) {
          return session;
        }
      } catch (e) {
        // Ignorer les erreurs de better-auth
      }
      return null;
    }

    // Vérifier la session dans la base de données
    const dbSession = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: { user: true },
    });

    if (!dbSession || !dbSession.user) {
      return null;
    }

    // Vérifier si la session est expirée
    if (dbSession.expiresAt && dbSession.expiresAt < new Date()) {
      // Supprimer la session expirée
      try {
        await prisma.session.delete({
          where: { id: dbSession.id },
        });
      } catch (e) {
        // Ignorer les erreurs de suppression
      }
      return null;
    }

    return {
      user: dbSession.user,
      session: {
        id: dbSession.id,
        userId: dbSession.userId,
        expiresAt: dbSession.expiresAt,
      },
    };
  } catch (error) {
    console.error('Erreur lors de la vérification de la session:', error);
    return null;
  }
}

/**
 * Vérifie si l'utilisateur est authentifié
 * @param request - La requête Next.js
 * @returns true si authentifié, false sinon
 */
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const session = await getAuthenticatedSession(request);
  return session !== null;
}








