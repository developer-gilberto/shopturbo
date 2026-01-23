import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
    const token = request.cookies.get('shopturboAuthToken')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    try {
        await jwtVerify(token, SECRET);

        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('Authorization', `Bearer ${token}`);

        const response = NextResponse.next({
            request: { headers: requestHeaders },
        });

        return response;
    } catch (err) {
        console.error('Token inválido ou expirado: ', err);
        return NextResponse.redirect(new URL('/', request.url));
    }
}

export const config = {
    matcher: [
        '/callback/:path*',
        '/commission/:path*',
        '/dashboard/:path*',
        '/integrate/:path*',
        '/my-account/:path*',
        '/orders/:path*',
        '/products/:path*',
        '/profit/:path*',
        '/support/:path*',
        '/taxes/:path*',
    ],
};
