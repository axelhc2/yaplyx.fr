import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    await auth.api.signOut({
      headers: request.headers,
    });

    return NextResponse.json({
      success: true,
      message: 'Déconnexion réussie',
    });
  } catch (error: any) {
    console.error('Erreur lors de la déconnexion:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion' },
      { status: 500 }
    );
  }
}




