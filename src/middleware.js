import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req) {
  const token = await getToken({ req, secret });

  // console.log(token , "this is token of middleware")
  const { pathname } = req.nextUrl;

  
  if (pathname.startsWith('/signin') || pathname.startsWith('/signup')) {
    return NextResponse.next();
  }
  
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/signin'; 
    return NextResponse.redirect(url);
  }


  return NextResponse.next();
}


export const config = {
  matcher: [ '/dashboard' , '/eventForm' ]
};
