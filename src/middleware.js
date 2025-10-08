import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
    if (['development', 'homolog'].includes(process.env.NODE_ENV)) {
        console.info('[ Incoming Request ]: ');
        console.info('URL: ', request.url);
        console.info('Method: ', request.method);
        console.info(
            'Cookies: ',
            Object.fromEntries(
                request.cookies.getAll().map((c) => [c.name, c.value])
            )
        );
    }

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

        if (['development', 'homolog'].includes(process.env.NODE_ENV)) {
            console.info(
                '[ Headers com Authorization ]: ',
                Object.fromEntries(requestHeaders.entries())
            );
        }

        return response;
    } catch (err) {
        console.error('Token inválido ou expirado: ', err);
        return NextResponse.redirect(new URL('/', request.url));
    }
}

export const config = {
    matcher: [
        '/callback/:path*',
        '/dashboard/:path*',
        '/get-shop-profile/:path*',
        '/integrate/:path*',
        '/products/:path*',
        '/profit/:path*',
        '/support/:path*',
        '/taxes/:path*',
    ],
};
