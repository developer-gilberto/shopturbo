'use server';

import { cookies } from 'next/headers';

export async function signOut() {
    const cookie = await cookies();

    const isProduction = !!process.env.NODE_ENV === 'production';

    cookie.set('shopturboAuthToken', '', {
        httpOnly: isProduction,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
        maxAge: 0,
        domain: isProduction ? process.env.COOKIES_DOMAIN : 'localhost',
    });

    cookie.set('shopturboShopId', '', {
        httpOnly: isProduction,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
        expires: new Date(Date.now() - 1000),
        domain: isProduction ? process.env.COOKIES_DOMAIN : 'localhost',
    });
}
