'use server';

import { cookies } from 'next/headers';

export async function signIn(formData) {
    const userData = {
        email: formData.get('email'),
        password: formData.get('password'),
    };

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/signin`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            }
        );

        if (!response.ok) return response.status;

        const data = await response.json();

        const cookie = await cookies();

        cookie.set('shopturboAuthToken', data.token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/',
            priority: 'high',
            maxAge: 60 * 60 * 24, // 24h em segundos
        });

        return 200;
    } catch (err) {
        return 500;
    }
}
