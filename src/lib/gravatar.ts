import { md5 } from './md5';

/**
 * Génère l'URL Gravatar à partir d'un email
 * Utilise une fonction MD5 côté client ou une route API
 * @param email - L'adresse email de l'utilisateur
 * @param size - La taille de l'avatar (par défaut 256)
 * @param defaultType - Le type d'avatar par défaut (mp = mystery person)
 * @returns L'URL de l'avatar Gravatar
 */
export async function getGravatarUrl(
  email: string,
  size: number = 256,
  defaultType: string = 'mp'
): Promise<string> {
  if (!email) {
    return `https://www.gravatar.com/avatar/00000000000000000000000000000000?s=${size}&d=${defaultType}`;
  }

  try {
    // Utiliser la route API pour générer le hash MD5 (plus fiable)
    const response = await fetch(`/api/gravatar?email=${encodeURIComponent(email)}`);
    if (response.ok) {
      const data = await response.json();
      return `https://www.gravatar.com/avatar/${data.hash}?s=${size}&d=${defaultType}`;
    }
  } catch (error) {
    console.error('Erreur lors de la génération du hash Gravatar:', error);
  }

  // Fallback : utiliser la fonction MD5 côté client
  const emailHash = md5(email.toLowerCase().trim());
  return `https://www.gravatar.com/avatar/${emailHash}?s=${size}&d=${defaultType}`;
}

