'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/btn';
import { Input } from '@/components/ui/input';
import { FeedbackModal } from '../feedback-modal';
import { Loading } from '../loading';

export function SignupForm() {
    const router = useRouter();
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [successfulRequest, setSuccessfulRequest] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setFeedbackMessage(''), 1000);
        return () => clearTimeout(timer);
    }, [feedbackMessage]);

    async function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            termsOfUse: formData.get('termsOfUse'),
        };

        if (!userData.name || !userData.email || !userData.password) {
            return setFeedbackMessage('Preencha todos os campos!');
        }

        if (!userData.termsOfUse) {
            return setFeedbackMessage(
                'Você precisa aceitar os termos de uso para criar uma conta!'
            );
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/signup`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData),
                }
            );

            if (!response.ok) {
                setSuccessfulRequest(false);

                if (response.status === 409) {
                    return setFeedbackMessage(
                        'Email inválido! Tente um email diferente.'
                    );
                }

                if (response.status === 400) {
                    return setFeedbackMessage(
                        'Dados inválidos. Verifique os dados e tente novamente.'
                    );
                }

                return setFeedbackMessage(
                    'Ocorreu um erro ao tentar criar a conta!'
                );
            }

            setSuccessfulRequest(true);
            setFeedbackMessage('Conta criada com sucesso!');

            router.replace('/signin');
        } catch (err) {
            setSuccessfulRequest(false);
            return setFeedbackMessage(
                `Erro ao tentar criar conta!\nTente novamente mais tarde...`
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            className="flex flex-col justify-center items-start shadow-2xl border-[1px] border-[--bg_3] max-w-xs gap-8 py-16 px-8 rounded-2xl"
            id="signup-form"
            onSubmit={handleSubmit}
            method="POST"
        >
            {feedbackMessage && (
                <FeedbackModal
                    request={successfulRequest}
                    message={feedbackMessage}
                />
            )}

            <Input type="text" name="name" placeholder="Nome completo" />

            <Input
                type="email"
                name="email"
                placeholder="Digite um e-mail válido"
            />

            <Input type="password" name="password" placeholder="Senha" />

            <div className="flex justify-center items-center gap-2">
                <Input
                    type="checkbox"
                    name="termsOfUse"
                    id="checkbox-accept-terms"
                />

                <label
                    className="hover:cursor-pointer"
                    htmlFor="checkbox-accept-terms"
                >
                    Aceito os termos de uso.
                </label>
            </div>

            <Link
                className="text-primary_color hover:cursor-pointer hover:underline hover:text-secondary_color"
                href="/terms"
            >
                &gt; Termos de uso ShopTurbo.
            </Link>

            {!loading && (
                <Button type="submit" width="w-full">
                    Criar conta
                </Button>
            )}

            {loading && <Loading />}
        </form>
    );
}
