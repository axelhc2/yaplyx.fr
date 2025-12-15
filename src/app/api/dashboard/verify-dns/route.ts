import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedSession } from '@/lib/auth-utils';
import { t } from '@/lib/i18n-server';

/**
 * Route API pour vérifier l'enregistrement DNS
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getAuthenticatedSession(request);
    if (!session) {
      return NextResponse.json(
        { error: t(request, 'api_error_unauthorized') },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { domain, expectedIP } = body;

    if (!domain || !expectedIP) {
      return NextResponse.json(
        { error: t(request, 'api_error_dns_domain_required') },
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
      let errorMessage = t(request, 'api_error_dns');
      
      if (dnsError.code === 'ENOTFOUND' || dnsError.code === 'ENODATA') {
        errorMessage = t(request, 'api_error_dns_not_found', { domain, ip: expectedIP });
      } else if (dnsError.code === 'ETIMEDOUT') {
        errorMessage = t(request, 'api_error_dns_timeout');
      } else {
        errorMessage = dnsError.message || t(request, 'api_error_dns');
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
      { error: t(request, 'api_error_dns_verify') },
      { status: 500 }
    );
  }
}








