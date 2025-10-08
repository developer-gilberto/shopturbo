'use server';

import { cookies } from 'next/headers';

export async function signOut() {
    const cookie = await cookies();

    cookie.delete('shopturboAuthToken');
}
