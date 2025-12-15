import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { t } from '@/lib/i18n-server';

export async function POST(request: NextRequest) {
  try {
    await auth.api.signOut({
      headers: request.headers,
    });

    return NextResponse.json({
      success: true,
      message: t(request, 'api_success_logout'),
    });
  } catch (error: any) {
    console.error('Erreur lors de la déconnexion:', error);
    return NextResponse.json(
      { error: t(request, 'api_error_logout') },
      { status: 500 }
    );
  }
}










