#!/usr/bin/env node

/**
 * Script cron pour désactiver les services expirés
 * Met à jour le champ 'active' à false pour les services dont expiresAt est dépassé
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { PrismaClient } = require('../src/generated/prisma/client');

const prisma = new PrismaClient();

async function expireServices() {
  try {
    const now = new Date();
    
    console.log(`[${now.toISOString()}] Vérification des services expirés...`);
    
    // Trouver tous les services actifs dont expiresAt est dépassé
    const expiredServices = await prisma.service.updateMany({
      where: {
        active: true,
        expiresAt: {
          not: null,
          lt: now
        }
      },
      data: {
        active: false
      }
    });
    
    console.log(`[${now.toISOString()}] ${expiredServices.count} service(s) désactivé(s)`);
    
    return expiredServices.count;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Erreur lors de la désactivation des services:`, error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
expireServices()
  .then((count) => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Erreur fatale:', error);
    process.exit(1);
  });

