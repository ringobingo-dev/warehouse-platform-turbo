import { NextResponse } from 'next/server';
import { handleSSOCallback } from 'ui';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { error: 'Authorization code is required' },
      { status: 400 }
    );
  }

  try {
    const userData = await handleSSOCallback(code);
    
    // Create a response that sets the user data in a secure HTTP-only cookie
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`);
    
    // Set the user data in a secure HTTP-only cookie
    response.cookies.set('user', JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=auth_failed`);
  }
} 