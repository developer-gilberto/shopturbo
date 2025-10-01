"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FeedbackModal } from "@/components/ui/feedback-modal";
import { Loading } from "@/components/ui/loading";

export default function Callback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get("code");
    const shop_id = searchParams.get("shop_id");

    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [successfulRequest, setSuccessfulRequest] = useState(false);
    const [loading, setLoading] = useState(true);

    if (!code || !shop_id) {
        return (
            <>
                <FeedbackModal
                    request={successfulRequest}
                    message="'code' e 'shop_id' são obrigratórios."
                />
            </>
        );
    }

    useEffect(() => {
        try {
            const fetchToken = async () => {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/shopee/access-token?code=${code}&shop_id=${shop_id}`,
                    {
                        method: "GET",
                        credentials: "include",
                    },
                );

                if (!response.ok) {
                    setFeedbackMessage(
                        "Ocorreu um erro ao tentar obter o token de acesso da API Shopee!",
                    );

                    return setTimeout(() => {
                        router.replace("/dashboard");
                    }, 3000);
                }

                setSuccessfulRequest(true);
                setFeedbackMessage(
                    "Token de acesso obtido com sucesso. Aguarde...",
                );

                setTimeout(() => {
                    router.replace("/get-shop-profile");
                }, 3000);
            };

            fetchToken();
        } catch (err) {
            console.log("err.message: ", err.message);
            setFeedbackMessage(
                "Ocorreu um erro ao tentar obter o token de acesso da API Shopee.",
            );
            setTimeout(() => {
                router.replace("/dashboard");
            }, 3000);
        } finally {
            setLoading(false);
        }
    }, [code, shop_id]);

    return (
        <div className="flex flex-col items-center justify-center">
            {feedbackMessage && (
                <FeedbackModal
                    request={successfulRequest}
                    message={feedbackMessage}
                />
            )}

            <h1 className="mb-4">
                Solicitando o token de acesso da API da Shopee. Aguarde...
            </h1>

            {loading && <Loading />}
        </div>
    );
}
