import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`);
  
  // Clear the user cookie
  response.cookies.set('user', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
  });

  return response;
} 