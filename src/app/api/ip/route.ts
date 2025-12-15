import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Récupérer l'IP depuis les headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare
  const xForwardedFor = request.headers.get('x-forwarded-for');
  
  // Fonction pour vérifier si une chaîne est une IPv4
  const isIPv4 = (ip: string): boolean => {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    return ipv4Regex.test(ip);
  };

  // Fonction pour vérifier si une chaîne est une IPv6 mappée en IPv4 (::ffff:x.x.x.x)
  const isMappedIPv6 = (ip: string): boolean => {
    return /^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/i.test(ip);
  };

  // Fonction pour vérifier si une chaîne est une vraie IPv6 (pas mappée)
  const isIPv6 = (ip: string): boolean => {
    if (isMappedIPv6(ip)) {
      return false; // Les IPv6 mappées ne sont pas de vraies IPv6
    }
    const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
    return ipv6Regex.test(ip) || (ip.includes('::') && !ip.startsWith('::ffff:'));
  };

  // Fonction pour extraire l'IPv4 depuis une IPv6 mappée (::ffff:x.x.x.x)
  const extractIPv4FromMapped = (ip: string): string | null => {
    const mappedRegex = /^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/i;
    const match = ip.match(mappedRegex);
    return match ? match[1] : null;
  };

  // Extraire les IPs depuis x-forwarded-for (peut contenir plusieurs IPs séparées par des virgules)
  let ipv4: string | null = null;
  let ipv6: string | null = null;

  // Essayer d'abord avec cf-connecting-ip (Cloudflare)
  if (cfConnectingIp) {
    if (isIPv4(cfConnectingIp)) {
      ipv4 = cfConnectingIp;
    } else if (isMappedIPv6(cfConnectingIp)) {
      // IPv6 mappée : extraire l'IPv4 uniquement
      const mappedIpv4 = extractIPv4FromMapped(cfConnectingIp);
      if (mappedIpv4) {
        ipv4 = mappedIpv4;
      }
    } else if (isIPv6(cfConnectingIp)) {
      // Vraie IPv6
      ipv6 = cfConnectingIp;
    }
  }

  // Essayer avec x-real-ip
  if (realIp) {
    if (isIPv4(realIp) && !ipv4) {
      ipv4 = realIp;
    } else if (isMappedIPv6(realIp) && !ipv4) {
      // IPv6 mappée : extraire l'IPv4 uniquement
      const mappedIpv4 = extractIPv4FromMapped(realIp);
      if (mappedIpv4) {
        ipv4 = mappedIpv4;
      }
    } else if (isIPv6(realIp) && !ipv6) {
      // Vraie IPv6
      ipv6 = realIp;
    }
  }

  // Traiter x-forwarded-for (peut contenir plusieurs IPs)
  if (xForwardedFor) {
    const ips = xForwardedFor.split(',').map(ip => ip.trim());
    for (const ip of ips) {
      if (isIPv4(ip) && !ipv4) {
        ipv4 = ip;
      } else if (isMappedIPv6(ip) && !ipv4) {
        // IPv6 mappée : extraire l'IPv4 uniquement
        const mappedIpv4 = extractIPv4FromMapped(ip);
        if (mappedIpv4) {
          ipv4 = mappedIpv4;
        }
      } else if (isIPv6(ip) && !ipv6) {
        // Vraie IPv6
        ipv6 = ip;
      }
    }
  }

  // Si aucune IP n'a été trouvée dans les headers, utiliser l'IP de la connexion
  // Note: En production derrière un proxy, cela ne fonctionnera probablement pas
  if (!ipv4 && !ipv6) {
    // Essayer de récupérer depuis l'URL ou les headers supplémentaires
    const remoteAddr = request.headers.get('remote-addr');
    if (remoteAddr) {
      if (isIPv4(remoteAddr)) {
        ipv4 = remoteAddr;
      } else if (isMappedIPv6(remoteAddr)) {
        // IPv6 mappée : extraire l'IPv4 uniquement
        const mappedIpv4 = extractIPv4FromMapped(remoteAddr);
        if (mappedIpv4) {
          ipv4 = mappedIpv4;
        }
      } else if (isIPv6(remoteAddr)) {
        // Vraie IPv6
        ipv6 = remoteAddr;
      }
    }
  }

  return NextResponse.json({
    ipv4: ipv4 || null,
    ipv6: ipv6 || null,
  });
}

