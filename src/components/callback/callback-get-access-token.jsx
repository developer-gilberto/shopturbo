'use client';

import { fetchApiToken } from '@/api/shopee/fetchApiToken';
import { FeedbackModal } from '@/components/ui/feedback-modal';
import { IsLoading } from '@/components/ui/isLoading';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function CallbackGetAccessToken() {
    const router = useRouter();
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [successfulRequest, setSuccessfulRequest] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const searchParams = new URLSearchParams(window.location.search);
            const code = searchParams.get('code');
            const shop_id = searchParams.get('shop_id');

            if (!code || !shop_id) {
                setSuccessfulRequest(false);
                setFeedbackMessage("ERRO. 'code' e 'shop_id' não recebidos.");

                setTimeout(() => {
                    router.replace('/dashboard');
                }, 3000);

                return;
            }

            setSuccessfulRequest(true);
            setFeedbackMessage('Aguarde...');

            const fetchToken = async () => {
                const response = await fetchApiToken(code, shop_id);

                if (response.status !== 200) {
                    setSuccessfulRequest(false);
                    setFeedbackMessage(
                        'Ocorreu um erro ao tentar obter o token de acesso da API Shopee!',
                    );

                    setTimeout(() => {
                        router.replace('/dashboard');
                    }, 3000);

                    return;
                }

                setSuccessfulRequest(true);
                setFeedbackMessage('Aguarde...');

                router.replace('/dashboard');
            };

            fetchToken();
        } catch (err) {
            console.log('err.message: ', err.message);
            setFeedbackMessage(
                'Ocorreu um erro ao tentar obter o token de acesso da API Shopee.',
            );
            setTimeout(() => {
                router.replace('/dashboard');
            }, 3000);
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center">
            {feedbackMessage && (
                <FeedbackModal
                    request={successfulRequest}
                    message={feedbackMessage}
                />
            )}

            <h1 className="mb-4">Aguarde...</h1>

            {loading && <IsLoading width="w-80" />}
        </div>
    );
}
