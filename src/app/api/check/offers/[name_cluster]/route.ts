import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * IPs autorisées pour accéder à cette API
 */
const ALLOWED_IPS = [
  '185.161.169.23',
  '194.15.53.71',
  '185.46.112.144',
  '185.189.156.185',
];

/**
 * Récupère l'IP réelle du client
 */
function getClientIP(request: NextRequest): string {
  // Vérifier les headers proxy courants
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const ips = forwarded.split(',').map(ip => ip.trim());
    return ips[0] || 'unknown';
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  // Fallback sur l'IP de la requête
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  return 'unknown';
}

/**
 * Route API pour vérifier un cluster par son nom/token
 * GET /api/check/offers/[name_cluster]
 * 
 * Accessible uniquement depuis les IPs autorisées
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name_cluster: string }> }
) {
  try {
    // Vérifier l'IP du client
    const clientIP = getClientIP(request);
    
    if (!ALLOWED_IPS.includes(clientIP)) {
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 403 }
      );
    }

    const { name_cluster } = await params;

    if (!name_cluster) {
      return NextResponse.json(
        { error: 'Nom du cluster manquant' },
        { status: 400 }
      );
    }

    // Chercher le cluster par token (le name_cluster est probablement le token)
    const cluster = await prisma.cluster.findFirst({
      where: {
        token: name_cluster,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        service: {
          select: {
            active: true,
            servers: true,
            group: true,
            rules: true,
            logs: true,
            stats: true,
          },
        },
      },
    });

    if (!cluster) {
      return NextResponse.json(
        { error: 'Cluster introuvable' },
        { status: 404 }
      );
    }

    // Formater la réponse
    const response = {
      client: {
        prenom: cluster.user.firstName,
        nom: cluster.user.lastName,
        email: cluster.user.email,
      },
      service: {
        actif: cluster.service.active,
        servers: cluster.service.servers,
        groupe: cluster.service.group,
        rules: cluster.service.rules,
        logs: cluster.service.logs,
        stats: cluster.service.stats,
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Erreur lors de la vérification du cluster:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification du cluster' },
      { status: 500 }
    );
  }
}



