import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { error: 'Email requis' },
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




