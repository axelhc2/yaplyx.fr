import { randomBytes } from 'crypto';

/**
 * Génère un token CSRF sécurisé
 */
export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Vérifie la validité d'un token CSRF
 * @param requestToken - Le token fourni dans la requête
 * @param cookieToken - Le token stocké dans le cookie
 */
export function verifyCSRFToken(requestToken: string | null | undefined, cookieToken: string | undefined): boolean {
  if (!requestToken || !cookieToken) {
    return false;
  }

  // Comparaison sécurisée (timing-safe)
  // Utiliser une comparaison constante pour éviter les attaques par timing
  if (requestToken.length !== cookieToken.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < requestToken.length; i++) {
    result |= requestToken.charCodeAt(i) ^ cookieToken.charCodeAt(i);
  }
  
  return result === 0;
}








