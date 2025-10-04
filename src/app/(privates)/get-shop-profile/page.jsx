"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useShop } from "@/context/shopContext";
import { FeedbackModal } from "@/components/ui/feedback-modal";
import { Loading } from "@/components/ui/loading";

export default function GetShopProfile() {
    const router = useRouter();
    const { shop, setShop } = useShop();
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [successfulRequest, setSuccessfulRequest] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const fetchShopProfile = async () => {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/shopee/shop/profile`,
                    {
                        method: "GET",
                        credentials: "include",
                    },
                );

                if (!response.ok) {
                    setFeedbackMessage(
                        "Ocorreu um erro ao tentar obter os dados do perfil da loja!",
                    );

                    return setTimeout(() => {
                        router.replace("/dashboard");
                    }, 3000);
                }

                const shopData = await response.json();
                const shopProfileData = shopData.data;

                setShop(shopProfileData);

                setSuccessfulRequest(true);
                setFeedbackMessage(
                    "Dados da loja obtidos com sucesso. Aguarde...",
                );

                setTimeout(() => {
                    router.replace("/dashboard");
                }, 3000);
            };

            fetchShopProfile();
        } catch (err) {
            console.log(err);
            setFeedbackMessage(
                "Ocorreu um erro ao tentar obter os dados do perfil da loja.",
            );
            setTimeout(() => {
                router.replace("/dashboard");
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

            <h1 className="mb-4">
                Solicitando dados do perfil da loja... Aguarde...
            </h1>

            {loading && <Loading />}
        </div>
    );
}
