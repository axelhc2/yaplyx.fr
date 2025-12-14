import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import prisma from '@/lib/prisma';
import { getAuthenticatedSession } from '@/lib/auth-utils';

const TELEGRAM_BOT_TOKEN = '8578688168:AAEAtXxf72z2Ef2QqpXrQ6g4xVR70__Q5d4';
const TELEGRAM_CHAT_ID = '5248234928';

async function sendTelegramMessage(message: string) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Erreur lors de l\'envoi du message Telegram:', errorData);
      // Ne pas throw, juste logger l'erreur
    }
  } catch (error) {
    // Ne pas bloquer l'exécution si Telegram échoue
    console.error('Erreur lors de l\'envoi du message Telegram:', error);
  }
}

/**
 * Route API pour installer un cluster
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
    const { serviceId, domain, serverId, domainType } = body;

    if (!serviceId || !domain || !serverId) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      );
    }

    const userId = typeof session.user.id === 'string' ? parseInt(session.user.id) : session.user.id;

    // Récupérer le service et l'utilisateur
    const service = await prisma.service.findFirst({
      where: {
        id: parseInt(serviceId),
        userId: userId as number,
      },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service introuvable' },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur introuvable' },
        { status: 404 }
      );
    }

    // Récupérer le serveur
    const server = await prisma.server.findUnique({
      where: { id: serverId },
    });

    if (!server) {
      return NextResponse.json(
        { error: 'Serveur introuvable' },
        { status: 404 }
      );
    }

    // Générer un token unique
    const token = randomUUID();

    // Extraire le nom du cluster (début du domaine)
    const clusterName = domain.split('.')[0];

    // Appeler l'API d'installation du serveur
    const installUrl = `http://${server.ip}:9000/install`;
    
    let installResponse;
    let installData;
    
    try {
      installResponse = await fetch(installUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname: user.firstName,
          lastname: user.lastName,
          email: user.email,
          cluster_name: clusterName,
          domain: domain,
          token: token,
          ip_address: server.ip,
        }),
      });

      const responseText = await installResponse.text();
      
      // Essayer de parser le JSON (peut contenir du texte avant/après)
      try {
        // Chercher le JSON dans la réponse (peut être précédé/suivi de texte)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          installData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Aucun JSON trouvé dans la réponse');
        }
      } catch (parseError) {
        // Si le parsing échoue, traiter comme une erreur
        installData = {
          success: false,
          error: responseText.substring(0, 1000), // Limiter à 1000 caractères
        };
      }
    } catch (fetchError: any) {
      // Erreur de fetch (timeout, réseau, etc.)
      const errorMessage = `
<b>❌ Erreur d'installation de cluster (fetch)</b>

<b>Client:</b>
• Nom: ${user.firstName} ${user.lastName}
• Email: ${user.email}

<b>Informations:</b>
• Service ID: ${serviceId}
• Domaine: ${domain}
• Serveur: ${server.hostname} (${server.ip})
• Type: ${domainType}

<b>Erreur:</b>
<code>${fetchError.message || JSON.stringify(fetchError)}</code>
      `.trim();

      // Envoyer sur Telegram (ne bloque pas si ça échoue)
      sendTelegramMessage(errorMessage).catch(err => {
        console.error('Impossible d\'envoyer le message Telegram:', err);
      });

      return NextResponse.json(
        { error: 'Une erreur est survenue lors de l\'installation. L\'équipe technique a été notifiée.' },
        { status: 500 }
      );
    }

    if (!installData.success) {
      // Envoyer l'erreur sur Telegram
      const errorMessage = `
<b>❌ Erreur d'installation de cluster</b>

<b>Client:</b>
• Nom: ${user.firstName} ${user.lastName}
• Email: ${user.email}

<b>Informations:</b>
• Service ID: ${serviceId}
• Domaine: ${domain}
• Serveur: ${server.hostname} (${server.ip})
• Type: ${domainType}

<b>Erreur:</b>
<code>${installData.error || JSON.stringify(installData)}</code>
      `.trim();

      // Envoyer sur Telegram (ne bloque pas si ça échoue)
      sendTelegramMessage(errorMessage).catch(err => {
        console.error('Impossible d\'envoyer le message Telegram:', err);
      });

      // Ne pas renvoyer l'erreur détaillée au client
      return NextResponse.json(
        { error: 'Une erreur est survenue lors de l\'installation. L\'équipe technique a été notifiée.' },
        { status: 500 }
      );
    }

    // Installation réussie
    // Insérer dans la base de données
    const cluster = await prisma.cluster.create({
      data: {
        userId: userId,
        serviceId: parseInt(serviceId),
        name: clusterName,
        url: domain,
        token: token,
        serverId: serverId,
        username: installData.login?.username || '',
        password: installData.login?.password || '',
      },
    });

    // Envoyer le succès sur Telegram
    const successMessage = `
<b>✅ Installation de cluster réussie</b>

<b>Client:</b>
• Nom: ${user.firstName} ${user.lastName}
• Email: ${user.email}

<b>Informations:</b>
• Cluster ID: ${cluster.id}
• Nom: ${clusterName}
• Domaine: ${domain}
• Serveur: ${server.hostname} (${server.ip})
• Port: ${installData.port || 'N/A'}
• Username: ${installData.login?.username || 'N/A'}
• Email: ${installData.login?.email || 'N/A'}
    `.trim();

    // Envoyer sur Telegram (ne bloque pas si ça échoue)
    sendTelegramMessage(successMessage).catch(err => {
      console.error('Impossible d\'envoyer le message Telegram:', err);
    });

    return NextResponse.json({
      success: true,
      cluster: {
        id: cluster.id,
        name: cluster.name,
        domain: cluster.url,
        port: installData.port,
        login: installData.login,
      },
    });
  } catch (error: any) {
    console.error('Erreur lors de l\'installation du cluster:', error);
    
    // Envoyer l'erreur sur Telegram
    const errorMessage = `
<b>❌ Erreur lors de l'installation de cluster</b>

<b>Erreur système:</b>
<code>${error.message || JSON.stringify(error)}</code>
    `.trim();

    // Envoyer sur Telegram (ne bloque pas si ça échoue)
    sendTelegramMessage(errorMessage).catch(err => {
      console.error('Impossible d\'envoyer le message Telegram:', err);
    });

    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'installation. L\'équipe technique a été notifiée.' },
      { status: 500 }
    );
  }
}
