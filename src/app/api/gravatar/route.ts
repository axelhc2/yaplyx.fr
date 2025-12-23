import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { t } from '@/lib/i18n-server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { error: t(request, 'api_error_email_required') },
      { status: 400 }
    );
  }

  // Générer le hash MD5 de l'email en minuscules
  const hash = crypto
    .createHash('md5')
    .update(email.toLowerCase().trim())
    .digest('hex');

  return NextResponse.json({ hash });
}













