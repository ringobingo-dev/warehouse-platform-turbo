import { NextResponse } from 'next/server';
import { generateSSOUrl } from 'ui';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get('provider') as 'google' | 'microsoft' | 'saml';
  const organizationId = searchParams.get('organizationId');

  if (!provider) {
    return NextResponse.json(
      { error: 'Provider is required' },
      { status: 400 }
    );
  }

  try {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`;
    const url = await generateSSOUrl(provider, redirectUri, organizationId || undefined);
    
    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate login' },
      { status: 500 }
    );
  }
} 