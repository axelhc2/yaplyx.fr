#!/usr/bin/env node

/**
 * Script cron pour désactiver les services expirés
 * Met à jour le champ 'active' à false pour les services dont expiresAt est dépassé
 * Envoie un email de notification pour chaque service suspendu
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { PrismaClient } = require('../src/generated/prisma/client');

const prisma = new PrismaClient();

async function expireServices() {
  try {
    const now = new Date();
    
    console.log(`[${now.toISOString()}] Vérification des services expirés...`);
    
    // Trouver tous les services actifs dont expiresAt est dépassé avec leurs utilisateurs et clusters
    const expiredServices = await prisma.service.findMany({
      where: {
        active: true,
        expiresAt: {
          not: null,
          lt: now
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          }
        },
        clusters: {
          select: {
            url: true,
          },
          take: 1, // Prendre le premier cluster s'il existe
        }
      }
    });
    
    console.log(`[${now.toISOString()}] ${expiredServices.length} service(s) trouvé(s) à désactiver`);
    
    // Désactiver les services
    const result = await prisma.service.updateMany({
      where: {
        id: {
          in: expiredServices.map(s => s.id)
        }
      },
      data: {
        active: false
      }
    });
    
    console.log(`[${now.toISOString()}] ${result.count} service(s) désactivé(s)`);
    
    // Envoyer les emails de suspension via un script TypeScript
    if (expiredServices.length > 0) {
      console.log(`[${now.toISOString()}] Tentative d'envoi des emails de suspension...`);
      
      try {
        const { exec } = require('child_process');
        const { promisify } = require('util');
        const execAsync = promisify(exec);
        const path = require('path');
        
        const serviceIds = expiredServices.map(s => s.id);
        const scriptPath = path.join(__dirname, 'send-suspended-emails.ts');
        const command = `npx tsx ${scriptPath} ${serviceIds.join(' ')}`;
        
        const { stdout, stderr } = await execAsync(command, {
          cwd: path.join(__dirname, '..'),
          env: process.env,
        });
        
        if (stdout) {
          console.log(stdout);
        }
        if (stderr && !stderr.includes('Warning')) {
          console.error(stderr);
        }
        
        console.log(`[${now.toISOString()}] Emails de suspension traités pour ${serviceIds.length} service(s)`);
      } catch (emailError) {
        console.error(`[${now.toISOString()}] Erreur lors de l'envoi des emails:`, emailError.message || emailError);
        console.log(`[${now.toISOString()}] Les services ont été suspendus mais les emails n'ont pas pu être envoyés.`);
        // Log les services suspendus même si l'email échoue
        for (const service of expiredServices) {
          const serviceUrl = service.clusters && service.clusters.length > 0 
            ? service.clusters[0].url 
            : undefined;
          console.log(`[${now.toISOString()}] Service suspendu: ${service.name} - Utilisateur: ${service.user.email} - URL: ${serviceUrl || 'N/A'}`);
        }
      }
    }
    
    return expiredServices.length;
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

