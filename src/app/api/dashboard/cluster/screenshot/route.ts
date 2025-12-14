import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { getAuthenticatedSession } from '@/lib/auth-utils';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getAuthenticatedSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const clusterId = searchParams.get('clusterId');
    const url = searchParams.get('url');

    if (!clusterId || !url) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      );
    }

    // Vérifier que le cluster appartient à l'utilisateur
    const userId = typeof session.user.id === 'string' ? parseInt(session.user.id) : session.user.id;
    const cluster = await prisma.cluster.findFirst({
      where: {
        id: parseInt(clusterId),
        userId: userId as number,
      },
    });

    if (!cluster) {
      return NextResponse.json(
        { error: 'Cluster introuvable ou non autorisé' },
        { status: 404 }
      );
    }

    // Prendre le screenshot avec Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer',
      ],
    });

    const page = await browser.newPage();
    
    // Bloquer les ressources inutiles pour accélérer le chargement
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const resourceType = req.resourceType();
      // Bloquer les images, fonts, media, etc. pour accélérer
      if (['image', 'font', 'media', 'websocket'].includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });
    
    // Définir la taille de la fenêtre (viewport) - plus petit = plus rapide
    await page.setViewport({
      width: 1280,
      height: 720,
    });

    // Naviguer vers l'URL avec un timeout plus court
    const fullUrl = url.startsWith('http') ? url : `http://${url}`;
    
    try {
      // Utiliser 'load' au lieu de 'networkidle0' pour être plus rapide
      await page.goto(fullUrl, {
        waitUntil: 'load',
        timeout: 10000, // 10 secondes max au lieu de 30
      });
      
      // Attendre un peu que le contenu se charge (optionnel, mais peut aider)
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 seconde max
    } catch (error) {
      await browser.close();
      return NextResponse.json(
        { error: 'Impossible de charger la page' },
        { status: 500 }
      );
    }

    // Prendre le screenshot avec compression
    const screenshot = await page.screenshot({
      type: 'jpeg', // JPEG est plus rapide et plus léger que PNG
      quality: 80, // Qualité acceptable mais plus rapide
      fullPage: false, // Prendre seulement le viewport visible
    });

    await browser.close();

    // Convertir le Buffer en Uint8Array (comme pour les PDFs)
    const screenshotArray = new Uint8Array(screenshot as Buffer);

    // Retourner l'image
    return new Response(screenshotArray, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=3600', // Cache 1 heure
      },
    });
  } catch (error: any) {
    console.error('Erreur lors de la capture d\'écran:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la capture d\'écran' },
      { status: 500 }
    );
  }
}
