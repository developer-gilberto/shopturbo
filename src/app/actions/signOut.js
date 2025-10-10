'use server';

import { cookies } from 'next/headers';

export async function signOut() {
    const cookie = await cookies();

    cookie.set('shopturboAuthToken', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
        domain: '.gilbertolopes.dev',
    });

    cookie.set('shopturboShopId', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        expires: new Date(Date.now() - 1000),
        domain: '.gilbertolopes.dev',
    });
}
