'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="w-full min-h-dvh flex flex-col justify-center items-center gap-4">
            <h2 className="text-4xl text-red-600 font-extrabold">ERRO 😩</h2>
            <button onClick={() => reset()}>
                Ocorreu um erro inesperado. Volte mais tarde...
            </button>
        </div>
    );
}
