/**
 * Utilitaire côté client pour gérer les tokens CSRF
 */

let csrfTokenCache: string | null = null;

/**
 * Récupère le token CSRF depuis le serveur
 */
export async function getCSRFToken(): Promise<string> {
  // Utiliser le cache si disponible
  if (csrfTokenCache) {
    return csrfTokenCache;
  }

  try {
    const response = await fetch('/api/csrf-token', {
      method: 'GET',
      credentials: 'include', // Inclure les cookies
    });

    if (!response.ok) {
      throw new Error('Impossible de récupérer le token CSRF');
    }

    const data = await response.json();
    if (!data.csrfToken || typeof data.csrfToken !== 'string') {
      throw new Error('Token CSRF invalide reçu du serveur');
    }
    const token: string = data.csrfToken;
    csrfTokenCache = token;
    return token;
  } catch (error) {
    console.error('Erreur lors de la récupération du token CSRF:', error);
    throw error;
  }
}

/**
 * Réinitialise le cache du token CSRF
 */
export function clearCSRFTokenCache(): void {
  csrfTokenCache = null;
}

/**
 * Ajoute le header CSRF à une requête fetch
 */
export async function fetchWithCSRF(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getCSRFToken();

  const headers = new Headers(options.headers);
  
  // Ajouter le token CSRF uniquement pour les méthodes modifiantes
  if (options.method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method)) {
    headers.set('X-CSRF-Token', token);
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Toujours inclure les cookies
  });
}


