import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedSession } from '@/lib/auth-utils';

const POWERDNS_URL = 'http://185.253.54.6:9191/api/v1/servers/localhost/zones/yaplyx.online.';
const POWERDNS_API_KEY = 'djhwS2xMQUVYQjN0bDg5';

/**
 * Route API pour créer un sous-domaine .yaplyx.online via PowerDNS
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
    const { subdomain, serverIP } = body;

    if (!subdomain || !serverIP) {
      return NextResponse.json(
        { error: 'Sous-domaine et IP du serveur requis' },
        { status: 400 }
      );
    }

    // Vérifier que le sous-domaine se termine par .yaplyx.online
    if (!subdomain.endsWith('.yaplyx.online')) {
      return NextResponse.json(
        { error: 'Le sous-domaine doit se terminer par .yaplyx.online' },
        { status: 400 }
      );
    }

    // Ajouter le point final pour PowerDNS (format FQDN)
    const fqdn = subdomain.endsWith('.') ? subdomain : `${subdomain}.`;

    // Créer l'enregistrement DNS via PowerDNS API
    const powerDNSResponse = await fetch(POWERDNS_URL, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': POWERDNS_API_KEY,
      },
      body: JSON.stringify({
        rrsets: [
          {
            name: fqdn,
            type: 'A',
            ttl: 300,
            changetype: 'REPLACE',
            records: [
              {
                content: serverIP,
                disabled: false,
              },
            ],
          },
        ],
      }),
    });

    if (!powerDNSResponse.ok) {
      const errorText = await powerDNSResponse.text();
      console.error('Erreur PowerDNS:', errorText);
      return NextResponse.json(
        { error: 'Erreur lors de la création du sous-domaine dans PowerDNS', details: errorText },
        { status: powerDNSResponse.status }
      );
    }

    // Attendre un peu pour que le DNS se propage
    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json({
      success: true,
      domain: subdomain,
      ip: serverIP,
      message: 'Sous-domaine créé avec succès',
    });
  } catch (error: any) {
    console.error('Erreur lors de la création du sous-domaine:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du sous-domaine', details: error.message },
      { status: 500 }
    );
  }
}
