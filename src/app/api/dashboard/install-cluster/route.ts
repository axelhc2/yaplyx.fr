import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import prisma from '@/lib/prisma';
import { getAuthenticatedSession } from '@/lib/auth-utils';
import { t } from '@/lib/i18n-server';
import { notifyError, notifySuccess } from '@/lib/Notify';
import { sendClusterInstallationEmail } from '@/lib/Mail';

/**
 * Route API pour installer un cluster
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
    const { serviceId, domain, serverId, domainType } = body;

    if (!serviceId || !domain || !serverId) {
      return NextResponse.json(
        { error: t(request, 'api_error_missing_params') },
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
      include: {
        clusters: true,
      },
    });

    if (!service) {
      return NextResponse.json(
        { error: t(request, 'api_error_service_not_found') },
        { status: 404 }
      );
    }

    // Vérifier si le service a déjà un cluster
    if (service.clusters && service.clusters.length > 0) {
      return NextResponse.json(
        { error: 'Ce service a déjà un cluster installé' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: t(request, 'api_error_user_not_found') },
        { status: 404 }
      );
    }

    // Récupérer le serveur
    const server = await prisma.server.findUnique({
      where: { id: serverId },
    });

    if (!server) {
      return NextResponse.json(
        { error: t(request, 'api_error_server_not_found') },
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

      // Envoyer sur Telegram et Teams (ne bloque pas si ça échoue)
      notifyError(errorMessage).catch(err => {
        console.error('Impossible d\'envoyer les notifications:', err);
      });

      return NextResponse.json(
        { error: t(request, 'api_error_installation') },
        { status: 500 }
      );
    }

    if (!installData.success) {
      // Envoyer l'erreur sur Telegram et Teams
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

      // Envoyer sur Telegram et Teams (ne bloque pas si ça échoue)
      notifyError(errorMessage).catch(err => {
        console.error('Impossible d\'envoyer les notifications:', err);
      });

      // Ne pas renvoyer l'erreur détaillée au client
      return NextResponse.json(
        { error: t(request, 'api_error_installation') },
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

    // Envoyer le succès sur Telegram et Teams
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

    // Envoyer sur Telegram et Teams (ne bloque pas si ça échoue)
    notifySuccess(successMessage).catch(err => {
      console.error('Impossible d\'envoyer les notifications:', err);
    });

    // Envoyer l'email avec les identifiants du cluster (non-bloquant)
    Promise.resolve().then(async () => {
      try {
        await sendClusterInstallationEmail(
          {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          {
            name: cluster.name,
            url: cluster.url,
            username: cluster.username,
            password: cluster.password,
          }
        );
      } catch (error: any) {
        console.error('Erreur lors de l\'envoi de l\'email d\'installation du cluster:', error);
        // Ne pas bloquer l'installation si l'email échoue
      }
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
    
    // Envoyer l'erreur sur Telegram et Teams
    const errorMessage = `
<b>❌ Erreur lors de l'installation de cluster</b>

<b>Erreur système:</b>
<code>${error.message || JSON.stringify(error)}</code>
    `.trim();

    // Envoyer sur Telegram et Teams (ne bloque pas si ça échoue)
    notifyError(errorMessage).catch((err: any) => {
      console.error('Impossible d\'envoyer les notifications:', err);
    });

    return NextResponse.json(
      { error: t(request, 'api_error_installation') },
      { status: 500 }
    );
  }
}
