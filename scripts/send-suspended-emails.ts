/**
 * Script pour envoyer les emails de suspension de services
 * Appelé depuis expire-services.js
 */

import { PrismaClient } from '../src/generated/prisma/client';
import { sendServiceSuspendedEmail } from '../src/lib/Mail';
import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '..', '.env') });

const prisma = new PrismaClient();

export async function sendSuspendedEmails(serviceIds: number[]): Promise<void> {
  try {
    const services = await prisma.service.findMany({
      where: {
        id: {
          in: serviceIds,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        clusters: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
    });

    for (const service of services) {
      try {
        const serviceUrl = service.clusters && service.clusters.length > 0 
          ? service.clusters[0].url 
          : undefined;

        await sendServiceSuspendedEmail(
          {
            id: service.user.id,
            email: service.user.email,
            firstName: service.user.firstName,
            lastName: service.user.lastName,
          },
          {
            name: service.name,
            url: serviceUrl,
          }
        );

        console.log(`[${new Date().toISOString()}] Email envoyé pour le service ${service.name} (${service.user.email})`);
      } catch (error: any) {
        console.error(`[${new Date().toISOString()}] Erreur lors de l'envoi de l'email pour le service ${service.name}:`, error.message || error);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Si appelé directement
const serviceIds = process.argv.slice(2).map(id => parseInt(id, 10));
if (serviceIds.length > 0) {
  sendSuspendedEmails(serviceIds)
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('Erreur fatale:', error);
      process.exit(1);
    });
}

