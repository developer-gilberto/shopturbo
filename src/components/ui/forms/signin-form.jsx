'use client';

import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/btn';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FeedbackModal } from '../feedback-modal';
import { Loading } from '../loading';
import { signIn } from '@/app/actions/signIn';

export function LoginForm() {
    const router = useRouter();
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [successfulRequest, setSuccessfulRequest] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFeedbackMessage('');
        }, 2000);
        return () => clearTimeout(timer);
    }, [feedbackMessage]);

    async function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        try {
            setLoading(true);

            const response = await signIn(formData);

            if (response !== 200) {
                setSuccessfulRequest(false);

                if (response === 401) {
                    return setFeedbackMessage('Email ou senha incorretos!');
                }

                if (response === 400) {
                    return setFeedbackMessage(
                        'Dados inválidos! Verifique os dados e tente novamente.'
                    );
                }

                return setFeedbackMessage(
                    'Ocorreu um erro ao tentar fazer login! Tente novamente mais tarde...'
                );
            }

            // se o middleware nao conseguir acesso ao cookie, tentar definir aqui no client

            setSuccessfulRequest(true);
            setFeedbackMessage('Login bem sucedido!');

            router.replace('/dashboard');
        } catch (err) {
            setSuccessfulRequest(false);
            return setFeedbackMessage(
                `Erro ao fazer login!\nTente novamente mais tarde...`
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            className="flex flex-col justify-center items-center shadow-2xl border-[1px] border-[--bg_3] max-w-xs gap-8 py-16 px-8 rounded-2xl"
            id="login-form"
            onSubmit={handleSubmit}
            method="POST"
        >
            {feedbackMessage && (
                <FeedbackModal
                    request={successfulRequest}
                    message={feedbackMessage}
                />
            )}

            <h2 className="text-3xl font-extrabold">Login</h2>

            <Input type="email" name="email" placeholder="Email" />

            <Input type="password" name="password" placeholder="Senha" />

            <div className="flex flex-col justify-center items-start gap-0">
                Não tem uma conta ShopTurbo?
                <Link
                    className="text-primary_color hover:cursor-pointer hover:underline hover:text-secondary_color"
                    href="/signup"
                >
                    &gt; Criar conta.
                </Link>
            </div>

            {!loading && (
                <Button type="submit" width="w-full">
                    Entrar
                </Button>
            )}

            {loading && <Loading />}
        </form>
    );
}
