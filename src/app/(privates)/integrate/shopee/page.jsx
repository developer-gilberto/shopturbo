'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IsLoading } from '@/components/ui/isLoading';
import { Button } from '@/components/ui/btn';
import { FeedbackModal } from '@/components/ui/feedback-modal';
import { fetchAuthUrl } from '@/app/actions/fetchAuthUrl';
import { Nav } from '@/components/layout/nav';
import { Main } from '@/components/layout/main';

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
        <section className=" w-full min-h-screen flex">
            <Nav />
            <Main>
                {feedbackMessage && (
                    <FeedbackModal
                        request={successfulRequest}
                        message={feedbackMessage}
                    />
                )}

                <div className="w-full min-h-screen flex flex-col justify-center items-center gap-6">
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-xl">
                            Ao clicar no botão abaixo, você vai ser
                            redirecionado para fazer login na Shopee. Entre com
                            a conta da sua loja Shopee que deseja conectar ao
                            ShopTurbo.
                        </p>
                        <p className="text-xl">
                            Após o login, clique em{' '}
                            <span className="text-primary_color">
                                "Confirmar autorização"
                            </span>{' '}
                            e pronto! Agora é só usufruir do ShopTurbo para ter
                            controle e gestão total da sua loja Shopee.
                        </p>
                    </div>
                    <div className="mt-4">
                        {!loading && (
                            <Button onClick={handleIntegrateApiShopee}>
                                Conectar Shopturbo à minha loja Shopee
                            </Button>
                        )}

                        {loading && <IsLoading width="w-[340px]" />}
                    </div>
                </div>
            </Main>
        </section>
    );
}
