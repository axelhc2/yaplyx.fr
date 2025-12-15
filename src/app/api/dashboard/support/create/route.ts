import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedSession } from '@/lib/auth-utils';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Configuration pour désactiver le bodyParser et gérer FormData
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Route API pour créer un ticket de support
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

    const userId = typeof session.user.id === 'string' ? parseInt(session.user.id) : session.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId as number } });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur introuvable' },
        { status: 404 }
      );
    }

    // Récupérer les données du formulaire
    const formData = await request.formData();
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const serviceId = formData.get('serviceId') as string;
    const author = `${user.firstName} ${user.lastName}`;

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Le sujet et le message sont requis' },
        { status: 400 }
      );
    }

    // Traiter le serviceId
    let servicesValue = 'none';
    if (serviceId && serviceId !== 'none') {
      servicesValue = serviceId;
    }

    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'support');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Traiter les fichiers uploadés
    const imagePaths: string[] = [];
    const files = formData.getAll('files') as File[];

    for (const file of files) {
      if (file.size === 0) continue;

      // Vérifier la taille (100MB max)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `Le fichier ${file.name} dépasse la taille maximale de 100MB` },
          { status: 400 }
        );
      }

      // Vérifier l'extension
      const allowedExtensions = ['.jpg', '.jpeg', '.gif', '.png', '.txt', '.pdf'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        return NextResponse.json(
          { error: `L'extension ${fileExtension} n'est pas autorisée` },
          { status: 400 }
        );
      }

      // Générer un nom de fichier unique
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileName = `${timestamp}-${randomString}${fileExtension}`;
      const filePath = join(uploadsDir, fileName);

      // Convertir le fichier en buffer et l'écrire
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      // Sauvegarder le chemin relatif (sans /public)
      const relativePath = `uploads/support/${fileName}`;
      imagePaths.push(relativePath);
    }

    // Créer le ticket de support
    const ticket = await prisma.support.create({
      data: {
        userId: userId as number,
        subject,
        services: servicesValue,
        status: 'pending',
      },
    });

    // Créer la première réponse (le message initial)
    await prisma.supportReply.create({
      data: {
        ticketId: ticket.id,
        userId: userId as number,
        author,
        text: message,
        img: imagePaths.length > 0 ? imagePaths : null,
      },
    });

    return NextResponse.json({ 
      success: true, 
      ticketId: ticket.id 
    });
  } catch (error: any) {
    console.error('Erreur lors de la création du ticket:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du ticket' },
      { status: 500 }
    );
  }
}

