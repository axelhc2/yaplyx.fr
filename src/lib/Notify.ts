/**
 * Composant de notification pour envoyer des messages sur Telegram et Microsoft Teams
 */

export type NotificationType = 'success' | 'info' | 'error';

interface NotificationOptions {
  message: string;
  type: NotificationType;
}

/**
 * Envoie un message sur Telegram
 */
async function sendTelegramMessage(message: string): Promise<void> {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Variables d\'environnement Telegram non configurées');
    return;
  }

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
    }
  } catch (error) {
    // Ne pas bloquer l'exécution si Telegram échoue
    console.error('Erreur lors de l\'envoi du message Telegram:', error);
  }
}

/**
 * Envoie un message sur Microsoft Teams
 */
async function sendTeamsMessage(message: string, type: NotificationType): Promise<void> {
  const TEAMS_WEBHOOK_URL = process.env.TEAMS_WEBHOOK_URL;

  if (!TEAMS_WEBHOOK_URL) {
    console.warn('Variable d\'environnement Teams non configurée');
    return;
  }

  try {
    // Convertir le message HTML en texte formaté pour Teams
    // D'abord remplacer les balises <br> par des retours à la ligne
    let plainText = message.replace(/<br\s*\/?>/gi, '\n');
    
    // Convertir les balises HTML en Markdown en préservant les retours à la ligne
    plainText = plainText
      .replace(/<b>(.*?)<\/b>/g, '**$1**') // Gras
      .replace(/<code>(.*?)<\/code>/g, '`$1`') // Code
      .replace(/<\/?[^>]+>/g, ''); // Supprimer les autres balises HTML

    // Nettoyer les espaces multiples mais préserver les retours à la ligne
    plainText = plainText.replace(/\n{3,}/g, '\n\n').trim();

    // Déterminer la couleur et le résumé selon le type
    const themeColors = {
      success: '00FF00',
      info: '0078D4',
      error: 'FF0000',
    };

    const summaries = {
      success: 'Notification de succès',
      info: 'Notification d\'information',
      error: 'Notification d\'erreur',
    };

    // Pour Teams, utiliser \n\n pour les retours à la ligne (comme dans l'exemple)
    // Remplacer tous les \n simples par \n\n pour que Teams affiche correctement
    const formattedText = plainText.replace(/\n/g, '\n\n');

    const response = await fetch(TEAMS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        '@type': 'MessageCard',
        '@context': 'https://schema.org/extensions',
        summary: summaries[type],
        themeColor: themeColors[type],
        text: formattedText,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text().catch(() => 'Unknown error');
      console.error('Erreur lors de l\'envoi du message Teams:', errorData);
    }
  } catch (error) {
    // Ne pas bloquer l'exécution si Teams échoue
    console.error('Erreur lors de l\'envoi du message Teams:', error);
  }
}

/**
 * Envoie une notification sur Telegram et Microsoft Teams
 * @param options - Options de notification avec message et type
 */
export async function notify(options: NotificationOptions): Promise<void> {
  const { message, type } = options;

  // Envoyer sur Telegram et Teams en parallèle
  await Promise.allSettled([
    sendTelegramMessage(message),
    sendTeamsMessage(message, type),
  ]);
}

/**
 * Fonction helper pour envoyer une notification de succès
 */
export async function notifySuccess(message: string): Promise<void> {
  await notify({ message, type: 'success' });
}

/**
 * Fonction helper pour envoyer une notification d'information
 */
export async function notifyInfo(message: string): Promise<void> {
  await notify({ message, type: 'info' });
}

/**
 * Fonction helper pour envoyer une notification d'erreur
 */
export async function notifyError(message: string): Promise<void> {
  await notify({ message, type: 'error' });
}

