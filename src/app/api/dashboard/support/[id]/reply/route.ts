import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedSession } from '@/lib/auth-utils';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * Route API pour envoyer une réponse à un ticket de support
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification
    const session = await getAuthenticatedSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const userId = typeof session.user.id === 'string' ? parseInt(session.user.id) : session.user.id;
    const ticketId = parseInt(resolvedParams.id);
    const user = await prisma.user.findUnique({ where: { id: userId as number } });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur introuvable' },
        { status: 404 }
      );
    }

    if (isNaN(ticketId)) {
      return NextResponse.json(
        { error: 'ID de ticket invalide' },
        { status: 400 }
      );
    }

    // Vérifier que le ticket appartient à l'utilisateur
    const ticket = await prisma.support.findFirst({
      where: {
        id: ticketId,
        userId: userId as number,
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket introuvable' },
        { status: 404 }
      );
    }

    // Vérifier que le ticket n'est pas fermé
    if (ticket.status === 'closed') {
      return NextResponse.json(
        { error: 'Le ticket est fermé' },
        { status: 400 }
      );
    }

    // Récupérer les données du formulaire
    const formData = await request.formData();
    const message = formData.get('message') as string;
    const author = `${user.firstName} ${user.lastName}`;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Le message est requis' },
        { status: 400 }
      );
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

    // Créer la réponse
    await prisma.supportReply.create({
      data: {
        ticketId: ticket.id,
        userId: userId as number,
        author,
        text: message,
        img: imagePaths.length > 0 ? imagePaths : null,
      },
    });

    // Mettre à jour le statut du ticket à "answered" si c'était "pending"
    if (ticket.status === 'pending') {
      await prisma.support.update({
        where: { id: ticket.id },
        data: { status: 'answered' },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erreur lors de l\'envoi de la réponse:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de la réponse' },
      { status: 500 }
    );
  }
}

