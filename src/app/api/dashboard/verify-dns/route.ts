import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedSession } from '@/lib/auth-utils';

/**
 * Route API pour vérifier l'enregistrement DNS
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getAuthenticatedSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { domain, expectedIP } = body;

    if (!domain || !expectedIP) {
      return NextResponse.json(
        { error: 'Domaine et IP attendue requis' },
        { status: 400 }
      );
    }

    try {
      // Résoudre le DNS pour obtenir l'IP
      const dns = await import('dns').then(m => m.promises);
      const addresses = await dns.resolve4(domain);

      // Vérifier si l'IP attendue est dans les résultats
      const isValid = addresses.includes(expectedIP);

      return NextResponse.json({
        valid: isValid,
        resolvedIPs: addresses,
        expectedIP,
        domain,
        message: isValid 
          ? 'L\'enregistrement DNS est correct' 
          : `Le domaine pointe vers ${addresses.join(', ')}, mais l'IP attendue est ${expectedIP}`,
      });
    } catch (dnsError: any) {
      // Erreur de résolution DNS
      let errorMessage = 'Erreur lors de la résolution DNS';
      
      if (dnsError.code === 'ENOTFOUND' || dnsError.code === 'ENODATA') {
        errorMessage = `Le domaine "${domain}" n'existe pas ou n'a pas d'enregistrement DNS A. Veuillez créer l'enregistrement DNS A pointant vers ${expectedIP}`;
      } else if (dnsError.code === 'ETIMEDOUT') {
        errorMessage = 'Timeout lors de la résolution DNS. Veuillez réessayer plus tard.';
      } else {
        errorMessage = dnsError.message || 'Erreur lors de la résolution DNS';
      }

      return NextResponse.json({
        valid: false,
        error: errorMessage,
        errorCode: dnsError.code,
        resolvedIPs: [],
        expectedIP,
        domain,
      });
    }
  } catch (error: any) {
    console.error('Erreur lors de la vérification DNS:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification DNS' },
      { status: 500 }
    );
  }
}


