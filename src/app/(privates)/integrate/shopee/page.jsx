'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loading } from '@/components/ui/loading';
import { Button } from '@/components/ui/btn';
import { FeedbackModal } from '@/components/ui/feedback-modal';
import { fetchAuthUrl } from '@/app/actions/fetchAuthUrl';

export default function IntegrateApiShopee() {
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [successfulRequest, setSuccessfulRequest] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleIntegrateApiShopee() {
        setLoading(true);

        try {
            // verificar se o shop ja concedeu a autorização para nao fazer chamada desnecessaria para a api
            const response = await fetchAuthUrl();

            if (response.status !== 200) {
                setLoading(false);

                console.error(
                    'Ocorreu um erro na solicitação da url de autorização.'
                );

                return setFeedbackMessage(
                    'Ocorreu um erro na solicitação da url de autorização! Tente novamente mais tarde...'
                );
            }

            setSuccessfulRequest(true);
            setFeedbackMessage('Aguarde...');

            return router.replace(`${response.url}`);
        } catch (err) {
            console.error(
                'Ocorreu um erro na solicitação da url de autorização: ',
                err.message
            );

            setSuccessfulRequest(false);

            return setFeedbackMessage(
                'Ocorreu um erro inesperado! Tente novamente mais tarde...'
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="w-full h-dvh flex justify-evenly items-center gap-10">
            {feedbackMessage && (
                <FeedbackModal
                    request={successfulRequest}
                    message={feedbackMessage}
                />
            )}

            <div className="flex flex-col justify-between items-center gap-6 w-[768px]">
                <div className="flex flex-col justify-center items-center">
                    <p className="text-xl">
                        Clique no botão abaixo para conceder a autorização para
                        o <span className="text-primary_color">ShopTurbo</span>{' '}
                        se integrar com a{' '}
                        <span className="font-bold">API da Shopee!</span>
                    </p>
                </div>
                <div className="mt-4">
                    {!loading && (
                        <Button onClick={handleIntegrateApiShopee}>
                            Conectar-se à Shopee
                        </Button>
                    )}

                    {loading && <Loading />}
                </div>
            </div>
        </section>
    );
}
