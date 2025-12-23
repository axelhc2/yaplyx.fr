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
  '185.189.158.161',
];

/**
 * Vérifie si une IP est une IPv4
 */
function isIPv4(ip: string): boolean {
  // Regex pour IPv4 (ex: 192.168.1.1)
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  return ipv4Regex.test(ip);
}

/**
 * Récupère l'IP réelle du client (IPv4 uniquement)
 */
function getClientIP(request: NextRequest): string {
  // Vérifier les headers proxy courants
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const ips = forwarded.split(',').map(ip => ip.trim());
    // Chercher la première IPv4
    for (const ip of ips) {
      // Nettoyer l'IP (enlever ::ffff: si présent)
      const cleanIP = ip.replace(/^::ffff:/, '');
      if (isIPv4(cleanIP)) {
        return cleanIP;
      }
    }
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    const cleanIP = realIP.replace(/^::ffff:/, '');
    if (isIPv4(cleanIP)) {
      return cleanIP;
    }
  }
  
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    const cleanIP = cfConnectingIp.replace(/^::ffff:/, '');
    if (isIPv4(cleanIP)) {
      return cleanIP;
    }
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
    // Vérifier l'IP du client (IPv4 uniquement)
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
            offer: {
              select: {
                name: true,
              },
            },
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
      offre: {
        nom: cluster.service.offer?.name ?? null,
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







