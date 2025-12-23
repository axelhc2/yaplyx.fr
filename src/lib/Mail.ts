import nodemailer from 'nodemailer';
import { notifyError } from './Notify';
import prisma from './prisma';

// Configuration du transport SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true pour 465, false pour autres ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  userId?: number;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

/**
 * Envoie un email de manière non-bloquante
 * En cas d'erreur, utilise Notify.ts pour logger
 */
async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn('⚠️ Configuration SMTP manquante, email non envoyé');
      return;
    }

    const transporter = createTransporter();
    const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;

    await transporter.sendMail({
      from: `"Yaplyx" <${fromEmail}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      attachments: options.attachments,
    });

    console.log(`✅ Email envoyé à ${options.to}`);

    // Stocker l'email dans la base de données si userId est fourni
    if (options.userId) {
      try {
        // Vérifier que l'utilisateur existe avant d'enregistrer l'email
        const userExists = await prisma.user.findUnique({
          where: { id: options.userId },
          select: { id: true },
        });

        if (!userExists) {
          console.error(`❌ Utilisateur avec l'ID ${options.userId} n'existe pas en BDD`);
          return;
        }

        const savedMail = await prisma.mail.create({
          data: {
            userId: options.userId,
            subject: options.subject,
            content: options.text,
          },
        });
        console.log(`✅ Email stocké en BDD avec l'ID: ${savedMail.id} pour l'utilisateur ${options.userId}`);
      } catch (dbError: any) {
        // Ne pas bloquer si l'enregistrement en BDD échoue, mais logger l'erreur
        console.error('❌ Erreur lors de l\'enregistrement de l\'email en BDD:', dbError);
        console.error('Détails de l\'erreur:', {
          message: dbError.message,
          code: dbError.code,
          userId: options.userId,
          subject: options.subject,
          stack: dbError.stack,
        });
        
        // Notifier l'erreur via Notify.ts
        const errorMessage = `<b>❌ Erreur d'enregistrement d'email en BDD</b>

<b>Destinataire:</b> ${options.to}
<b>UserId:</b> ${options.userId}
<b>Sujet:</b> ${options.subject}

<b>Erreur:</b>
<code>${dbError.message || JSON.stringify(dbError)}</code>`;

        notifyError(errorMessage).catch((err: any) => {
          console.error('Impossible d\'envoyer la notification d\'erreur email:', err);
        });
      }
    } else {
      console.warn('⚠️ Email envoyé mais non stocké en BDD (userId manquant)');
    }
  } catch (error: any) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    
    // Envoyer une notification d'erreur via Notify.ts
    const errorMessage = `<b>❌ Erreur d'envoi d'email</b>

<b>Destinataire:</b> ${options.to}
<b>Sujet:</b> ${options.subject}

<b>Erreur:</b>
<code>${error.message || JSON.stringify(error)}</code>`;

    notifyError(errorMessage).catch((err: any) => {
      console.error('Impossible d\'envoyer la notification d\'erreur email:', err);
    });
  }
}

/**
 * Email de bienvenue après inscription
 */
export async function sendWelcomeEmail(user: {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}): Promise<void> {
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const text = `YAPLYX
Europe, France
https://www.yaplyx.fr/



Paris le: ${dateStr} ${timeStr}
Objet : Bienvenue sur Yaplyx

Bonjour ${user.firstName},

Nous vous remercions de votre inscription sur yaplyx.fr.

Votre compte a été créé avec succès. Vous pouvez dès maintenant commencer à utiliser nos services de cluster firewall nouvelle génération.

Prochaines étapes :
• Explorez nos offres et choisissez celle qui vous convient
• Installez votre cluster en quelques clics
• Gérez tous vos firewalls depuis un seul tableau de bord

Pour découvrir nos offres : https://yaplyx.fr/offres

Si vous avez des questions, n'hésitez pas à nous contacter via notre support.




Cordialement,

Votre Service client Yaplyx
Pour nous contacter : https://yaplyx.fr/dashboard/support/create
`.trim();

  await sendEmail({
    to: user.email,
    subject: 'Bienvenue sur Yaplyx',
    text,
    userId: user.id,
  });
}

export async function sendPaymentConfirmationEmail(
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  },
  invoice: {
    fullInvoiceNumber: string;
    price: number | string;
    paymentDate: Date | string;
  },
  service: {
    name: string;
    description: string;
  },
  offer: {
    name: string;
  },
  invoicePdfBuffer: Buffer
): Promise<void> {
  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(numPrice);
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const text = `YAPLYX
Europe, France
https://www.yaplyx.fr/



Paris le: ${dateStr} ${timeStr}
Objet : Confirmation de paiement - Facture ${invoice.fullInvoiceNumber}

Bonjour ${user.firstName},

Nous vous remercions pour votre paiement de ${formatPrice(invoice.price)}.

Détails de votre commande :
Facture : ${invoice.fullInvoiceNumber}
Offre : ${offer.name}
Service : ${service.name}
Montant : ${formatPrice(invoice.price)}
Date de paiement : ${formatDate(invoice.paymentDate)}

Votre facture est disponible en pièce jointe de cet email au format PDF.

Description de l'offre :
${service.description}

Pour accéder à vos services : https://yaplyx.fr/dashboard/services

Si vous avez des questions concernant votre facture, n'hésitez pas à nous contacter.




Cordialement,

Votre Service client Yaplyx
Pour nous contacter : https://yaplyx.fr/dashboard/support/create
`.trim();

  await sendEmail({
    to: user.email,
    subject: `Confirmation de paiement - Facture ${invoice.fullInvoiceNumber}`,
    text,
    userId: user.id,
    attachments: [
      {
        filename: `${invoice.fullInvoiceNumber}.pdf`,
        content: invoicePdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });
}

/**
 * Email d'installation de cluster avec les identifiants
 */
export async function sendClusterInstallationEmail(
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  },
  cluster: {
    name: string;
    url: string;
    username: string;
    password: string;
  }
): Promise<void> {
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const text = `YAPLYX
Europe, France
https://www.yaplyx.fr/



Paris le: ${dateStr} ${timeStr}
Objet : Votre cluster ${cluster.name} est prêt

Bonjour ${user.firstName},

Votre cluster "${cluster.name}" a été installé avec succès. Vous pouvez dès maintenant commencer à l'utiliser.

Identifiants de connexion :
URL du cluster : ${cluster.url}
Nom d'utilisateur : ${cluster.username}
Mot de passe : ${cluster.password}

Important : Veuillez conserver ces identifiants en lieu sûr. Pour des raisons de sécurité, nous ne les stockons pas en clair.

Pour accéder à votre cluster : https://${cluster.url}

Prochaines étapes :
• Connectez-vous à votre cluster avec les identifiants ci-dessus
• Configurez vos règles de firewall
• Ajoutez vos serveurs à protéger

Si vous rencontrez des difficultés, n'hésitez pas à contacter notre support.




Cordialement,

Votre Service client Yaplyx
Pour nous contacter : https://yaplyx.fr/dashboard/support/create
`.trim();

  await sendEmail({
    to: user.email,
    subject: `Votre cluster ${cluster.name} est prêt !`,
    text,
    userId: user.id,
  });
}

/**
 * Email de suspension de service
 */
export async function sendServiceSuspendedEmail(
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  },
  service: {
    name: string;
    url?: string;
  }
): Promise<void> {
  const serviceUrl = service.url || 'https://yaplyx.fr/dashboard/services';

  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const serviceUrlSection = service.url ? `URL du service : ${service.url}
` : '';

  const text = `YAPLYX
Europe, France
https://www.yaplyx.fr/



Paris le: ${dateStr} ${timeStr}
Objet : Service ${service.name} suspendu

Bonjour ${user.firstName},

Nous vous informons que votre service "${service.name}" a été suspendu car sa période d'abonnement est arrivée à expiration.

Votre service est actuellement suspendu et n'est plus accessible. Pour le réactiver, veuillez renouveler votre abonnement.

${serviceUrlSection}Pour renouveler votre service : https://yaplyx.fr/dashboard/services

Si vous avez des questions ou souhaitez obtenir de l'aide, n'hésitez pas à nous contacter.




Cordialement,

Votre Service client Yaplyx
Pour nous contacter : https://yaplyx.fr/dashboard/support/create
`.trim();

  await sendEmail({
    to: user.email,
    subject: `Service ${service.name} suspendu`,
    text,
    userId: user.id,
  });
}

