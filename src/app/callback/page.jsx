'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FeedbackModal } from '@/components/ui/feedback-modal';
import { Loading } from '@/components/ui/loading';
import { fetchApiToken } from '../actions/fetchApiToken';

export default function Callback() {
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
                return setFeedbackMessage(
                    "'code' e 'shop_id' são obrigratórios."
                );
            }

            setSuccessfulRequest(true);
            setFeedbackMessage('Aguarde...');

            const fetchToken = async () => {
                const response = await fetchApiToken(code, shop_id);

                if (response.status !== 200) {
                    setSuccessfulRequest(false);
                    setFeedbackMessage(
                        'Ocorreu um erro ao tentar obter o token de acesso da API Shopee!'
                    );

                    return setTimeout(() => {
                        router.replace('/dashboard');
                    }, 3000);
                }

                setSuccessfulRequest(true);
                setFeedbackMessage('Aguarde...');

                router.replace('/dashboard');
            };

            fetchToken();
        } catch (err) {
            console.log('err.message: ', err.message);
            setFeedbackMessage(
                'Ocorreu um erro ao tentar obter o token de acesso da API Shopee.'
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

            {loading && <Loading />}
        </div>
    );
}
